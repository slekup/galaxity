import { WebhookDocument, WebhookModel, WebhookSchema } from '@models/Webhook';
import logger from '@utils/client/logger';
import { decrypt, encrypt } from '@utils/functions/encryption';
import {
  WebhookClient,
  WebhookEditOptions,
  WebhookMessageCreateOptions,
} from 'discord.js';

/**
 * Webhook class.
 */
export class Webhook {
  public id: string;
  public token: string;
  public guildId: string;
  public channelId: string;

  /**
   * Webhook class constructor.
   * @param doc The webhook document.
   */
  public constructor(doc: WebhookDocument) {
    this.id = doc.data.id;
    const encryptedToken = decrypt(doc.data.token);
    if (encryptedToken) this.token = encryptedToken;
    else throw new Error('Webhook token could not be decrypted');
    this.guildId = doc.guildId;
    this.channelId = doc.channelId;
  }

  /**
   * Assign the webhook document to the class.
   * @param doc The webhook document.
   */
  private assign(doc: WebhookDocument): void {
    this.id = doc.data.id;
    const encryptedToken = decrypt(doc.data.token);
    if (encryptedToken) this.token = encryptedToken;
    this.guildId = doc.guildId;
    this.channelId = doc.channelId;
  }

  /**
   * Fetch a webhook.
   * @returns The webhook.
   */
  public async fetch(): Promise<Webhook> {
    try {
      // Fetch the webhook from the database
      const webhook = await WebhookModel.findOne({
        guildId: this.id,
      });

      // If the webhook does not exist throw an error
      if (!webhook) throw new Error(`Webhook not found: ${this.id}`);

      // Assign the webhook document to the class
      this.assign(webhook);

      return this;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Delete a webhook.
   * @returns If the webhook was deleted or not.
   */
  public async delete(): Promise<boolean> {
    try {
      const deletedWebhook = await WebhookModel.findOneAndDelete({
        guildId: this.guildId,
        channelId: this.channelId,
      });

      if (!deletedWebhook) return false;

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Send a webhook message.
   * @param options The webhook message options.
   * @returns The webhook client.
   */
  public send(options: WebhookMessageCreateOptions): WebhookClient {
    try {
      // Create a new webhook client
      const webhookClient = new WebhookClient({
        id: this.id,
        token: this.token,
      });

      // Send the webhook message
      webhookClient.send(options);

      // Destroy the webhook client
      webhookClient.destroy();

      return webhookClient;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Edit a webhook message.
   * @param options The webhook message options.
   * @returns The webhook client.
   */
  public edit(options: WebhookEditOptions): WebhookClient {
    try {
      // Create a new webhook client
      const webhookClient = new WebhookClient({
        id: this.id,
        token: this.token,
      });

      // Edit the webhook message
      webhookClient.edit(options);

      // Destroy the webhook client
      webhookClient.destroy();

      return webhookClient;
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

/**
 * Webhooks class.
 */
export default class Webhooks {
  public cache = new Map<string, Webhook>();
  public guildIds: string[] = [];

  /**
   * Fetch method type without channelId.
   */
  public async fetch(): Promise<Webhook[]>;

  /**
   * Fetch method type with channelId.
   * @param channelId The channel id.
   */
  public async fetch(channelId?: string): Promise<Webhook>;

  /**
   * Fetch a webhook if the channel id is provided or all webhooks if a channel id is not provided.
   * @param channelId The channel id.
   * @returns The webhook, all webhooks, or throw an error.
   */
  public async fetch(channelId?: string): Promise<Webhook | Webhook[]> {
    if (channelId) {
      // If the webhook is in the cache return it
      if (this.cache.has(channelId)) {
        const cachedChannel = this.cache.get(channelId);
        if (cachedChannel) return cachedChannel;
        logger.error(`typeof cachedChannel: ${typeof cachedChannel}`);
        throw new Error(
          `Webhook not found, despite being in cache: ${channelId}`
        );
      }

      try {
        // Fetch the webhook from the database
        const webhookDoc = await WebhookModel.findOne({
          channelId,
        });

        // If the webhook does not exist throw an error
        if (!webhookDoc) throw new Error(`Webhook not found: ${channelId}`);

        // Create a new webhook class
        const webhook = new Webhook(webhookDoc);

        // Set the webhook to the cache
        this.cache.set(channelId, webhook);

        return webhook;
      } catch (error) {
        throw new Error(error as string);
      }
    } else {
      try {
        // Fetch all webhooks from the database
        const webhookDocs = await WebhookModel.find({
          guildId: { $in: this.guildIds },
        });

        // Loop through all all webhook documents and set a new webhook class for each
        const webhooks = webhookDocs.map((webhookDoc) => {
          const webhook = new Webhook(webhookDoc);
          this.cache.set(webhook.id, webhook);
          return webhook;
        });

        return webhooks;
      } catch (error) {
        throw new Error(error as string);
      }
    }
  }

  /**
   * Fetch all webhooks for a guild.
   * @param guildId The guild id.
   * @returns All webhooks or throw an error.
   */
  public async fetchAll(guildId: string): Promise<Webhook[]> {
    try {
      // Fetch all webhooks from the database
      const webhookDocs = await WebhookModel.find({
        guildId,
      });

      // Loop through all all webhook documents and set a new webhook class for each
      const webhooks = webhookDocs.map((webhookDoc) => {
        const webhook = new Webhook(webhookDoc);
        this.cache.set(webhook.id, webhook);
        return webhook;
      });

      return webhooks;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Create a webhook.
   * @param webhookData The webhook data to create a webhook with.
   * @returns The webhook or throw an error.
   */
  public async create(webhookData: WebhookSchema): Promise<Webhook> {
    try {
      // Create a new webhook document
      const webhookDoc = await WebhookModel.findOneAndUpdate(
        {
          guildId: webhookData.guildId,
          channelId: webhookData.channelId,
        },
        {
          $set: {
            data: {
              id: webhookData.data.id,
              token: encrypt(webhookData.data.token),
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      // Create a new guild profile instance
      const webhook = new Webhook(webhookDoc);

      // Add the guild profile to the cache
      this.cache.set(webhookDoc.channelId, webhook);

      return webhook;
    } catch (error) {
      throw new Error(error as string);
    }
  }

  /**
   * Sync the webhooks to local cache.
   * @param guildIds The guild ids.
   */
  public async sync(guildIds: string[]): Promise<void> {
    this.guildIds = guildIds;
    try {
      await this.fetch();
    } catch (error) {
      throw new Error(error as string);
    }
  }
}

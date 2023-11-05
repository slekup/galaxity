import {
  ApplicationCommand,
  BaseInteraction,
  Client,
  Collection,
  GatewayIntentBits,
  Message,
  Partials,
} from 'discord.js';

import config from '@config';
import {
  EventExecute,
  IButton,
  ICommand,
  IContextMenuCommand,
  IExtendedClient,
  IModal,
  IPrefixCommand,
  ISelectMenu,
  ISubCommand,
  InteractionStats,
} from '@typings/client';
import { logger } from '@utils/client';
import { clientError } from '@utils/client/errorHandler';
import Webhooks from '@utils/managers/Webhooks';
import { defer, followUp, respond } from 'discord-advanced';

interface ClientErrorParams {
  error: Error | string;
  title?: string | undefined;
  description?: string | undefined;
  footer?: string | undefined;
  interaction?: BaseInteraction | Message | undefined;
}

/**
 * A custom class representing the discord client.
 */
export class ExtendedClient extends Client implements IExtendedClient {
  /**
   * Client variables.
   */
  public botStartTime = new Date().getTime();
  public synced = false;
  public databaseLatency = 0;
  public developers: string[] = [];

  public interactions = {
    total: 0,
    slash: 0,
    prefix: 0,
    context: 0,
    buttons: 0,
    selectMenus: 0,
    modals: 0,
  };
  public cpuPercentage = 0;
  public botOnlineMessage: unknown;
  public useCommands: ApplicationCommand[] = [];

  /**
   * Client Events.
   */
  public events = new Collection<string, EventExecute>();
  public commands = new Collection<string, ICommand>();
  public subCommands = new Collection<string, ISubCommand>();
  public subCommandGroups = new Collection<string, ISubCommand>();
  public contextMenuCommands = new Collection<string, IContextMenuCommand>();
  public buttons = new Collection<string, IButton>();
  public selectMenus = new Collection<string, ISelectMenu>();
  public modals = new Collection<string, IModal>();
  public prefixCommands = new Collection<string, IPrefixCommand>();
  public prefixAliases = new Collection<string, string>();
  public sudoCommands = new Collection<string, IPrefixCommand>();

  /**
   * Guild Settings.
   */
  public webhooks: Webhooks;

  // Client functions
  public logger = logger.child({});
  public respond = respond;
  public defer = defer;
  public followUp = followUp;

  /**
   * Create a new client instance.
   */
  public constructor() {
    super({
      partials: [
        Partials.Channel,
        Partials.GuildMember,
        Partials.GuildScheduledEvent,
        Partials.Message,
        Partials.Reaction,
        Partials.ThreadMember,
        Partials.User,
      ],
      intents: [
        // GatewayIntentBits.AutoModerationConfiguration,
        // GatewayIntentBits.AutoModerationExecution,
        // GatewayIntentBits.DirectMessageReactions,
        // GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildEmojisAndStickers,
        // GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        // GatewayIntentBits.GuildPresences, // Do not have the intent
        // GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.webhooks = new Webhooks();
  }

  public setDatabaseLatency(latency: number): void {
    this.databaseLatency = latency;
  }

  public setCpuPercentage(percentage: number): void {
    this.cpuPercentage = percentage;
  }

  public setInteractions(interactions: InteractionStats): void {
    this.interactions = interactions;
  }

  public setUseCommands(commands: ApplicationCommand[]): void {
    this.useCommands = commands;
  }

  public setBotOnlineMessage(message: unknown): void {
    this.botOnlineMessage = message;
  }

  /**
   * Log an error.
   * @param params The parameters for the error.
   */
  public error = async (params: ClientErrorParams): Promise<void> => {
    await clientError(this, params);
  };

  /**
   * Authenticate the client.
   * @returns The client.
   */
  public async authenticate(): Promise<void> {
    await this.login(config.BOT_TOKEN);
  }

  /**
   * Function to prevent code from running unless client is synced with database.
   * @returns Whether the client is synced with the database.
   */
  public ensureDatabaseSynced = (): Promise<boolean> =>
    new Promise((resolve) => {
      /**
       * Checks if the client is synced with the database.
       */
      const checkSynced = (): void => {
        if (this.synced) resolve(true);
        else setTimeout(checkSynced, 1); // check every 10ms
      };
      checkSynced();
    });

  /**
   * Updates the client's synced status.
   * @param synced Whether the client is synced with the database.
   */
  public setSynced(synced: boolean): void {
    this.synced = synced;
  }

  /**
   * Sets the developers.
   * @param developers The developers to set.
   */
  public setDevelopers(developers: string[]): void {
    this.developers = developers;
  }
}

export default {};

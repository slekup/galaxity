import { Document, Schema, SchemaTimestampsConfig, model } from 'mongoose';

export interface Webhook {
  guildId: string;
  channelId: string;
  data: {
    id: string;
    token: string;
  };
}

export interface WebhookSchema extends Webhook, SchemaTimestampsConfig {}

export interface WebhookDocument extends Webhook, Document {}

export const WebhookModel = model<WebhookDocument>(
  'webhook',
  new Schema(
    {
      guildId: { type: String, required: true },
      channelId: { type: String, required: true },
      data: {
        id: { type: String, required: true },
        token: { type: String, required: true },
      },
    },
    { timestamps: true }
  )
);

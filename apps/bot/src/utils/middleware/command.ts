import {
  Channel,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  Message,
  MessageContextMenuCommandInteraction,
  PermissionFlagsBits,
  User,
  UserContextMenuCommandInteraction,
} from 'discord.js';

import config from '@config';
import { IExtendedClient } from '@typings/client';
import webhookManager from '@utils/client/webhookManager';

interface LogData {
  client: IExtendedClient;
  user: User;
  member: GuildMember;
  guild: Guild;
  channel: Channel;
  type: 'slash' | 'context' | 'prefix' | 'sudo';
  dataName: string;
  dataId: string;
  data?: Record<string, unknown>;
}

/**
 * Log a command use.
 * @param options The data used to log.
 * @returns The logged data.
 */
const logEvent = async (options: LogData): Promise<void> => {
  const { client, member, user, guild, dataName } = options;

  const webhook = await webhookManager.get(
    client,
    config.env.DEV_GUILD_ID,
    config.env.USER_HISTORY_CHANNEL_ID
  );

  if (!webhook) {
    client.logger.error('Failed to log command use');
    return;
  }

  webhook.send({
    username: 'Galaxity',
    ...(client.user?.displayAvatarURL
      ? { avatarURL: client.user.displayAvatarURL() }
      : {}),
    content: `${user.tag} ${
      user.id === guild.ownerId
        ? '(owner)'
        : member.permissions.has(PermissionFlagsBits.Administrator)
        ? '(admin)'
        : member.permissions.has(PermissionFlagsBits.ModerateMembers)
        ? '(mod)'
        : ''
    } used \`${dataName}\` in ${guild.name} (${guild.memberCount}) <t:${(
      Date.now() / 1000
    ).toFixed(0)}:R>`,
  });

  webhook.destroy();
};

interface CommandUseSlashOptions {
  interaction: ChatInputCommandInteraction;
  client: IExtendedClient;
  subCommand?: string;
}

/**
 * Log a slash command use.
 * @param options The data used to log.
 * @returns The logged data.
 */
export const slash = async (options: CommandUseSlashOptions): Promise<void> => {
  const { interaction, client, subCommand } = options;

  const { user, member, guild, channelId, commandName, commandId } =
    interaction;

  if (!guild) {
    client.logger.error(
      `Slash command (${commandId}) doesn't have a guild (${interaction.guildId})`
    );
    return;
  }

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    client.logger.error(
      `Slash command (${commandId}) doesn't have a channel (${channelId})`
    );
    return;
  }

  await logEvent({
    client,
    user,
    member: member as GuildMember,
    guild,
    channel,
    type: 'slash',
    dataName: `${commandName}${subCommand ? ` ${subCommand}` : ''}`,
    dataId: commandId,
  });
};

interface CommandUsePrefixOptions {
  message: Message;
  client: IExtendedClient;
  cmd: string;
  prefix: string;
  type: 'prefix' | 'sudo';
}

/**
 * Log a sudo command use.
 * @param options The data used to log.
 * @returns The logged data.
 */
export const prefix = async (
  options: CommandUsePrefixOptions
): Promise<void> => {
  const { message, client, cmd, prefix, type } = options;

  const { author, member, id, guild, channel } = message;

  if (!guild) {
    client.logger.error(
      `${type} command (${cmd}) doesn't have a guild (${message.guildId})`
    );
    return;
  }

  if (!member) {
    client.logger.error(
      `${type} command (${cmd}) doesn't have a member (${author.id})`
    );
    return;
  }

  await logEvent({
    client,
    user: author,
    member,
    guild,
    channel,
    type,
    dataName: cmd,
    dataId: id,
    data: {
      prefix,
    },
  });
};

interface CommandUseContextOptions {
  interaction:
    | UserContextMenuCommandInteraction
    | MessageContextMenuCommandInteraction;
  client: IExtendedClient;
}

/**
 * Log a context command use.
 * @param options The data used to log.
 * @returns The logged data.
 */
export const context = async (
  options: CommandUseContextOptions
): Promise<void> => {
  const { interaction, client } = options;

  const { user, guild, member, channelId, commandName, commandId } =
    interaction;

  if (!guild) {
    client.logger.error(
      `Context command (${commandId}) doesn't have a guild (${interaction.guildId})`
    );
    return;
  }

  const channel = guild.channels.cache.get(channelId);

  if (!channel) {
    client.logger.error(
      `Context command (${commandId}) doesn't have a channel (${channelId})`
    );
    return;
  }

  await logEvent({
    client,
    user,
    member: member as GuildMember,
    guild,
    channel,
    type: 'context',
    dataName: `${commandName}`,
    dataId: commandId,
  });
};

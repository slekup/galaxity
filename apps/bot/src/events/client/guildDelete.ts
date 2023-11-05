import { EmbedBuilder, Events, Guild, WebhookClient } from 'discord.js';

import config from '@config';
import Event from '@utils/builders/Event';

/**
 * Filters the guild name to remove certain words.
 * @param name The name of the guild.
 * @returns The filtered guild name.
 */
const filterGuildName = (name: string): string =>
  name
    .replace('Discord', '')
    .replace('discord', '')
    .replace('Everyone', '')
    .replace('everyone', '');

export default new Event({
  name: Events.GuildDelete,
}).setExecute<[Guild]>(async (client, guild) => {
  if (!guild.name) return;

  // Initialize the private webhook client
  const webhookPrivate = new WebhookClient({
    url: config.env.GUILD_CHANNEL_ID,
  });

  // Emojis string
  const emojis = `${guild.verified ? config.emojis.verified.full : ''} ${
    guild.partnered ? config.emojis.partner.full : ''
  }`;

  // Send the guild leave message to the private guild channel
  await webhookPrivate.send({
    username: filterGuildName(guild.name),
    ...(guild.iconURL
      ? { avatarURL: guild.iconURL({ size: 1024 }) as string }
      : {}),
    embeds: [
      new EmbedBuilder()
        .setTitle(`← Left Server`)
        .setColor(config.colors.danger)
        .setThumbnail(guild.iconURL())
        .setDescription(
          `
            ${emojis}
            **Name:** ${filterGuildName(guild.name)}
            **Users:** ${guild.memberCount.toLocaleString()}
            **Features:** ${guild.features
              .map((feature) => `${feature}`)
              .join(', ')}
            **Server Count:** ${client.guilds.cache.size}
            `
        ),
    ],
    allowedMentions: { parse: [] },
  });

  // Initialize the public webhook client
  const publicWebhook = new WebhookClient({
    url: config.env.GUILD_CHANNEL_ID,
  });

  // Send the leave message to the public guild channel
  publicWebhook.send({
    username: filterGuildName(guild.name),
    ...(guild.iconURL
      ? { avatarURL: guild.iconURL({ size: 1024 }) as string }
      : {}),
    content: `❌ Left ${guild.name}. I'm now in ${client.guilds.cache.size} servers.`,
  });
});

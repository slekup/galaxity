import {
  ActionRowBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Message,
} from 'discord.js';

import config from '@config';
import { stripIndents } from '@slekup/utils';
import { IExtendedClient } from '@typings/client';

export default function helpInterface(
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): void {
  const embed = new EmbedBuilder()
    .setColor(config.colors.primary)
    .setImage(config.images.banner)
    .setAuthor({
      name: `Galaxity Help Menu`,
      ...(client.user?.displayAvatarURL
        ? { iconURL: client.user?.displayAvatarURL() }
        : {}),
    })
    .setDescription(
      stripIndents(`
      > Galaxity is a Discord bot with advanced statistics and in-depth analysis to drive higher member engagement and activity.

      **Prefix:** \`g \` or \`/\`
      **Example Command:** \`g help\` or \`/help\`

      **Available Commands:**
      > \`help\` - Show the help menu
      > \`serverinfo\` - Shows server information.
      `)
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel('Invite Galaxity')
      .setStyle(ButtonStyle.Link)
      .setURL(config.links.invite),
    new ButtonBuilder()
      .setLabel('Discord')
      .setStyle(ButtonStyle.Link)
      .setURL(config.links.support)
  );

  client.respond(interaction, {
    embeds: [embed],
    components: [row],
  });
}

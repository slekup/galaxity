import { IExtendedClient } from '@typings/client';
import {
  ActionRowBuilder,
  AnyComponentBuilder,
  BaseInteraction,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  Guild,
  GuildDefaultMessageNotifications,
  Message,
  User,
} from 'discord.js';

const getPreferredLocale = {
  'da': ['Danish', 'Dansk'],
  'de': ['German', 'Deutsch'],
  'en-GB': ['English, UK', 'English, UK'],
  'en-US': ['English, US', 'English, US'],
  'es-ES': ['Spanish', 'Español'],
  'fr': ['French', 'Français'],
  'hr': ['Croatian', 'Hrvatski'],
  'it': ['Italian', 'Italiano'],
  'lt': ['Lithuanian', 'Lietuviškai'],
  'hu': ['Hungarian', 'Magyar'],
  'nl': ['Dutch', 'Nederlands'],
  'no': ['Norwegian', 'Norsk'],
  'pl': ['Polish', 'Polski'],
  'pt-BR': ['Portuguese, Brazilian', 'Português do Brasil'],
  'ro': ['Romanian, Romania', 'Română'],
  'fi': ['Finnish', 'Suomi'],
  'sv-SE': ['Swedish', 'Svenska'],
  'vi': ['Vietnamese', 'Tiếng Việt'],
  'tr': ['Turkish', 'Türkçe'],
  'cs': ['Czech', 'Čeština'],
  'el': ['Greek', 'Ελληνικά'],
  'bg': ['Bulgarian', 'български'],
  'ru': ['Russian', 'Pусский'],
  'uk': ['Ukrainian', 'Українська'],
  'hi': ['Hindi', 'हिन्दी'],
  'th': ['Thai', 'ไทย'],
  'zh-CN': ['Chinese, China', '中文'],
  'ja': ['Japanese', '日本語'],
  'zh-TW': ['Chinese, Taiwan', '繁體中文'],
  'ko': ['Korean', '한국어'],
};

const globalEmbed = (guild: Guild, user: User): EmbedBuilder =>
  new EmbedBuilder()
    .setAuthor({
      name: guild.name,
      ...(guild?.iconURL ? { iconURL: guild.iconURL() as string } : {}),
    })
    .setThumbnail(guild?.iconURL())
    .setFooter({
      text: `Requested By ${user.tag}`,
      iconURL: user?.displayAvatarURL(),
    })
    .setTimestamp();

const buttons = (
  select: string,
  id: string
): ActionRowBuilder<AnyComponentBuilder> => {
  const selected = select ? select : 'general';

  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`serverinfo*${id}-general`)
      .setLabel('General')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 'general'),
    new ButtonBuilder()
      .setCustomId(`serverinfo*${id}-users`)
      .setLabel('Users')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 'users'),
    new ButtonBuilder()
      .setCustomId(`serverinfo*${id}-channels`)
      .setLabel('Channels')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 'channels'),
    new ButtonBuilder()
      .setCustomId(`serverinfo*${id}-stats`)
      .setLabel('Stats')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 'stats'),
    new ButtonBuilder()
      .setCustomId(`serverinfo*${id}-owner`)
      .setLabel('Owner')
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(selected === 'owner')
  );
};

export const serverInfoGeneral = async (
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): Promise<void> => {
  const { guild } = interaction;
  if (!guild || !interaction.member) return;

  const member = await guild.members.fetch(interaction.member.user.id);
  const { user } = member;

  const {
    createdTimestamp,
    memberCount,
    description,
    ownerId,
    id,
    rulesChannel,
    publicUpdatesChannel,
    systemChannel,
    defaultMessageNotifications,
    preferredLocale,
    premiumSubscriptionCount,
    features,
  } = guild;

  const embed = globalEmbed(guild, user)
    .setDescription(
      `**Description:** ${description ? description : 'No description'}
      **Created:** <t:${(createdTimestamp / 1000).toFixed(0)}:R>
      **Features**: ${
        features.length > 0
          ? features.map((feat) => ` \`${feat}\``).join(', ')
          : '`None`'
      }`
    )
    .addFields(
      {
        name: 'Owner',
        value: `<@${ownerId}>`,
        inline: true,
      },
      { name: 'Server ID', value: `${id}`, inline: true },
      { name: 'Members', value: `${memberCount}`, inline: true },
      {
        name: 'Rules Channel',
        value: rulesChannel ? `<#${rulesChannel.id}>` : 'No Rules Channel',
        inline: true,
      },
      {
        name: 'Public Updates Channel',
        value: publicUpdatesChannel
          ? `<#${publicUpdatesChannel.id}>`
          : 'No public updates channel',
        inline: true,
      },
      {
        name: 'System Channel',
        value: systemChannel ? `<#${systemChannel.id}>` : 'No system channel',
        inline: true,
      },
      {
        name: 'Notifications',
        value:
          defaultMessageNotifications ===
          GuildDefaultMessageNotifications.AllMessages
            ? 'All Messages'
            : 'Only @mentions',
        inline: true,
      },
      {
        name: 'Preferred Locale',
        value: preferredLocale
          ? `${getPreferredLocale[
              preferredLocale as keyof typeof getPreferredLocale
            ].join(' | ')}`
          : 'None',
        inline: true,
      },
      {
        name: 'Boosts',
        value: premiumSubscriptionCount
          ? premiumSubscriptionCount.toString()
          : 'No Boosts',
        inline: true,
      }
    );

  client.respond(interaction, {
    embeds: [embed],
    components: [buttons('general', member.user.id)],
    buttonUpdate: true,
  });
};

export const serverInfoUsers = async (
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): Promise<void> => {
  const { guild } = interaction;
  if (!guild) return;
  const { members, memberCount, maximumMembers } = guild;
  if (!members) return;
  const invites = await guild.invites.fetch();

  if (!interaction.member) return;

  const member = await members.fetch(interaction.member.user.id);
  if (!member) return;
  const { user } = member;

  const embed = globalEmbed(guild, user).addFields(
    {
      name: 'Human Accounts',
      value: `${members.cache.filter((mem) => !mem.user.bot).size}`,
      inline: true,
    },
    {
      name: 'Bot Accounts',
      value: `${members.cache.filter((mem) => mem.user.bot).size}`,
      inline: true,
    },
    {
      name: 'Total Members',
      value: `${memberCount}`,
      inline: true,
    },
    {
      name: 'Boosters',
      value: `${members.cache.filter((mem) => mem.premiumSince).size}`,
      inline: true,
    },
    {
      name: 'Invites',
      value: `${invites.size}`,
      inline: true,
    },
    {
      name: 'Maximum Members',
      value: `${maximumMembers}`,
      inline: true,
    }
  );

  client.respond(interaction, {
    embeds: [embed],
    components: [buttons('users', interaction.member.user.id)],
    buttonUpdate: true,
  });
};

export const serverInfoChannels = async (
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): Promise<void> => {
  const { guild } = interaction;
  if (!guild || !interaction.member) return;
  const { channels } = guild;

  const member = await guild.members.fetch(interaction.member.user.id);
  const { user } = member;

  const embed = globalEmbed(guild, user).addFields(
    {
      name: 'Text Channels',
      value: `${
        channels.cache.filter((chan) => chan.type === ChannelType.GuildText)
          .size
      }`,
      inline: true,
    },
    {
      name: 'Voice Channels',
      value: `${
        channels.cache.filter((chan) => chan.type === ChannelType.GuildVoice)
          .size
      }`,
      inline: true,
    },
    {
      name: 'Thread Channels',
      value: `${
        channels.cache.filter(
          (chan) =>
            chan.type === ChannelType.GuildNewsThread &&
            ChannelType.PrivateThread &&
            ChannelType.PublicThread
        ).size
      }`,
      inline: true,
    },
    {
      name: 'Total Categories',
      value: `${
        channels.cache.filter((chan) => chan.type === ChannelType.GuildCategory)
          .size
      }`,
      inline: true,
    },
    {
      name: 'Stage Channels',
      value: `${
        channels.cache.filter(
          (chan) => chan.type === ChannelType.GuildStageVoice
        ).size
      }`,
      inline: true,
    },
    {
      name: 'News Channels',
      value: `${
        channels.cache.filter((chan) => chan.type === ChannelType.GuildNews)
          .size
      }`,
      inline: true,
    },
    {
      name: 'Total Channels',
      value: `${channels.cache.size}`,
      inline: true,
    }
  );

  if (!interaction.member) return;

  client.respond(interaction, {
    embeds: [embed],
    components: [buttons('channels', interaction.member.user.id)],
    buttonUpdate: true,
  });
};

export const serverInfoStats = async (
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): Promise<void> => {
  const { guild } = interaction;
  if (!guild || !interaction.member) return;
  const member = await guild.members.fetch(interaction.member.user.id);
  const { user } = member;

  const {
    members,
    roles,
    premiumTier,
    premiumSubscriptionCount,
    bans,
    verificationLevel,
    large,
    preferredLocale,
    afkTimeout,
    defaultMessageNotifications,
    emojis,
    stickers,
  } = guild;

  const invites = await guild.invites.fetch();

  const embed = globalEmbed(guild, user).addFields(
    {
      name: 'Roles',
      value: `${roles.cache.size}`,
      inline: true,
    },
    {
      name: 'Boost Tier',
      value: `${premiumTier}`,
      inline: true,
    },
    {
      name: 'Boosts',
      value: `${premiumSubscriptionCount}`,
      inline: true,
    },
    {
      name: 'Boosters',
      value: `${members.cache.filter((member) => member.premiumSince).size}`,
      inline: true,
    },
    {
      name: 'Bans',
      value: `${bans.cache.size}`,
      inline: true,
    },
    {
      name: 'Invites',
      value: `${invites.size}`,
      inline: true,
    },
    {
      name: 'Verification Level',
      value: `${verificationLevel}`,
      inline: true,
    },
    {
      name: 'Large',
      value: `${large}`,
      inline: true,
    },
    {
      name: 'AFK Timeout',
      value: `${afkTimeout}`,
      inline: true,
    },
    {
      name: 'Message Notifications',
      value:
        defaultMessageNotifications ===
        GuildDefaultMessageNotifications.AllMessages
          ? 'All Messages'
          : 'Only @mentions',
      inline: true,
    },
    {
      name: 'Preferred Locale',
      value: preferredLocale
        ? `${getPreferredLocale[
            preferredLocale as keyof typeof getPreferredLocale
          ].join(' | ')}`
        : 'None',
      inline: true,
    },
    {
      name: 'Animated Emojis',
      value: `${emojis.cache.filter((em) => em.animated).size}`,
      inline: true,
    },
    {
      name: 'Static Emojis',
      value: `${emojis.cache.filter((em) => !em.animated).size}`,
      inline: true,
    },
    {
      name: 'Total Emojis',
      value: `${emojis.cache.size + stickers.cache.size}`,
      inline: true,
    },
    {
      name: 'Stickers',
      value: `${stickers.cache.size}`,
      inline: true,
    }
  );

  if (!interaction.member) return;

  client.respond(interaction, {
    embeds: [embed],
    components: [buttons('stats', interaction.member.user.id)],
    buttonUpdate: true,
  });
};

export const serverInfoOwner = async (
  client: IExtendedClient,
  interaction: BaseInteraction | Message
): Promise<void> => {
  const { guild } = interaction;
  if (!guild || !interaction.member) return;
  const member = await guild?.members.fetch(interaction.member.user.id);
  if (!member) return;
  const { user } = member;

  const owner = await guild?.fetchOwner();
  if (!owner) return;

  // Member variables
  const roles =
    owner.roles.cache
      .filter((role) => role.id !== guild.id)
      .map((role) => role)
      .join(', ') || 'none';

  // User variables
  const embed = globalEmbed(guild, user)
    .setAuthor({
      name: `Owner: ${owner.user.tag}`,
      iconURL: owner.user?.displayAvatarURL(),
    })
    .setThumbnail(owner.user?.displayAvatarURL())
    .addFields(
      {
        name: 'Display Name & Account',
        value: `${owner.displayName} | <@${owner.user.id}>`,
        inline: true,
      },
      { name: 'Discord Tag', value: owner.user.tag, inline: true },
      {
        name: 'Joined at',
        value: owner.joinedAt
          ? `<t:${(owner.joinedAt.getTime() / 1000).toFixed(0)}:R>`
          : 'Unknown',
        inline: true,
      },
      { name: 'User ID', value: owner.user.id, inline: true },
      { name: 'Username', value: owner.user.username, inline: true },
      {
        name: 'Created At',
        value: `<t:${(owner.user.createdAt.getTime() / 1000).toFixed(0)}:R>`,
        inline: true,
      }
    )
    .setDescription(`**Roles**\n${roles}`);

  client.respond(interaction, {
    embeds: [embed],
    components: [buttons('owner', member.user.id)],
    buttonUpdate: true,
  });
};

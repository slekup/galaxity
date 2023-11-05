import {
  EmbedBuilder,
  Guild,
  GuildBasedChannel,
  GuildMember,
  Message,
  PermissionFlagsBits,
  PermissionResolvable,
  PermissionsBitField,
  TextChannel,
} from 'discord.js';

import config from '@config';
import { IExtendedClient, IPrefixCommand } from '@typings/client';

/**
 * Check if the client can send messages.
 * @param message The message that was sent.
 * @returns A boolean.
 */
export const canSend = (message: Message): boolean => {
  const { SendMessages } = PermissionFlagsBits;
  const channel = message.channel as TextChannel;

  if (message.guild?.members.me?.permissionsIn(channel).has(SendMessages))
    return true;

  return false;
};

/**
 * Check if the client is synced with the database.
 * @param message The message that was sent.
 * @param client The extended client.
 * @returns A boolean.
 */
export const isSynced = (
  message: Message,
  client: IExtendedClient
): boolean => {
  if (!client.synced) {
    client.respond(message, {
      content: `${
        client.user?.username ?? ''
      } is starting up, try again in a few seconds.`,
    });
    return false;
  }
  return true;
};

/**
 * Message that responds to client mentions.
 * @param prefix The prefix for the guild.
 * @param message The message that was sent.
 * @param client The extended client.
 */
export const respondToMention = (
  prefix: string,
  message: Message,
  client: IExtendedClient
): void => {
  client.respond(message, {
    content: `Yo, wassup ${message.author.username}, my prefix for this server is \`${prefix}\``,
  });
};

/**
 * Formatted response for when the user does not pass the required options.
 * @param invalidOptions The invalid options.
 * @param message The message that was sent.
 * @param client The extended client.
 */
const invalidOptionsResponse = (
  invalidOptions: {
    option: {
      name: string;
      type: 'string' | 'number' | 'boolean' | 'user' | 'channel' | 'role';
      required?: boolean;
      choices?: string[];
      min?: number;
      max?: number;
    };
    issue: 'type' | 'range' | 'choices';
    num: number;
  }[],
  message: Message,
  client: IExtendedClient
): void => {
  const embed = new EmbedBuilder()
    .setColor('Red')
    .setAuthor({
      name: `Invalid option${invalidOptions.length > 1 ? 's' : ''}`,
    })
    .setDescription(
      `${invalidOptions
        .map((io) => {
          const name = io.option.required
            ? `[${io.option.name}]`
            : `(${io.option.name})`;
          switch (io.issue) {
            case 'type':
              return `\`${name}\` (option #${io.num}) requires type \`${
                io.option.type.charAt(0).toUpperCase() + io.option.type.slice(1)
              }\``;
            case 'range': {
              const range = io.option.max
                ? `a minimum of \`${
                    io.option.min ?? '?'
                  }\` and a maximum of \`${io.option.max}\``
                : io.option.min
                ? `a minimum of \`${io.option.min}\``
                : '?';
              return `\`${name}\` (option #${io.num}) requires ${range}`;
            }
            case 'choices': {
              const choices = io.option.choices?.length
                ? io.option.choices.map((choice) => `${choice}`).join(', ')
                : 'CHOICES NOT PROVIDED';
              return `\`${name}\` (option #${io.num}) requires one of the following choices:\n\`\`\`\n${choices}\`\`\``;
            }
            default:
              return '';
          }
        })
        .join('\n')}`
    )
    .setFooter({ text: '[] = required. () = optional' });

  client.respond(message, {
    embeds: [embed],
  });
};

/**
 * Ensure that all options are provided and meet the command requirements.
 * @param prefix The prefix for the guild.
 * @param command The command.
 * @param args The arguments.
 * @param message The message that was sent.
 * @param client The extended client.
 * @returns Whether or not the options are valid.
 */
export const hasInvalidOptions = (
  prefix: string,
  command: IPrefixCommand,
  args: (string | GuildMember | GuildBasedChannel)[],
  message: Message,
  client: IExtendedClient
): boolean => {
  interface InvalidOption {
    option: {
      name: string;
      type: 'string' | 'number' | 'boolean' | 'user' | 'channel' | 'role';
      required?: boolean;
      choices?: string[];
      min?: number;
      max?: number;
    };
    issue: 'type' | 'range' | 'choices';
    num: number;
  }

  const invalidOptions: InvalidOption[] = [];

  // Check arguments
  if (Array.isArray(command.options)) {
    if (
      command.options.filter((option) => option.required).length > args.length
    ) {
      const invalidEmbed = new EmbedBuilder()
        .setColor('Red')
        .setAuthor({ name: 'Invalid number of arguments provided' })
        .setDescription(
          `Correct format for this command:\n\`\`\`ini\n${prefix}${
            command.name
          } ${command.options
            .map((option) =>
              option.required ? `[${option.name}]` : `(${option.name})`
            )
            .join(' ')}\`\`\``
        )
        .setFooter({ text: '[] = required. () = optional' });

      client.respond(message, {
        embeds: [invalidEmbed],
      });

      return true;
    }

    for (let index = 0; index < command.options.length; index += 1) {
      const option = command.options[index];
      const arg = args[index];
      if (!option) continue;
      if (!option.required && !arg) continue;
      if (typeof arg !== 'string') continue;

      switch (option.type) {
        case 'string':
          break;
        case 'number':
          // If the argument is not a number
          if (Number.isNaN(parseInt(arg, 10))) {
            invalidOptions.push({ option, num: index + 1, issue: 'type' });
            continue;
          }

          // If the argument is not within the range
          if (
            (option.min && parseInt(arg, 10) < option.min) ||
            (option.max && parseInt(arg, 10) > option.max)
          )
            invalidOptions.push({ option, num: index + 1, issue: 'range' });

          break;
        case 'user':
          {
            let userId = arg;

            if (userId.startsWith('<@') && userId.endsWith('>')) {
              userId = userId.slice(2, -1);
              if (userId.startsWith('!')) userId = userId.slice(1);
            }

            const member = message.guild?.members.cache.get(userId);

            // eslint-disable-next-line no-param-reassign
            if (member) args[index] = member;
            else invalidOptions.push({ option, num: index + 1, issue: 'type' });
          }
          break;
        case 'channel':
          {
            let channelId = arg;

            if (channelId.startsWith('<#') && channelId.endsWith('>')) {
              channelId = channelId.slice(2, -1);

              if (channelId.startsWith('!')) {
                channelId = channelId.slice(1);
              }
            }

            const channel = message.guild?.channels.cache.get(channelId);

            // eslint-disable-next-line no-param-reassign
            if (channel) args[index] = channel;
            else invalidOptions.push({ option, num: index + 1, issue: 'type' });
          }
          break;
        default:
          break;
      }

      // If a required choice is not provided
      const requiredNotProvided =
        option.required && option.choices && !option.choices.includes(arg);

      // If a choice is invalid
      const invalidChoice =
        args[index] && option.choices && !option.choices.includes(arg);

      if (requiredNotProvided || invalidChoice)
        invalidOptions.push({ option, num: index + 1, issue: 'choices' });
    }
  }

  if (invalidOptions.length > 0) {
    invalidOptionsResponse(invalidOptions, message, client);
    return true;
  }

  return false;
};

/**
 * Ensure that both the user and client have the required permissions.
 * @param command The command.
 * @param client The extended client.
 * @param message The message that was sent.
 * @returns Whether or not the user and client have the required permissions.
 */
export const lacksPermission = (
  command: IPrefixCommand,
  client: IExtendedClient,
  message: Message
): boolean | undefined => {
  const { member, guild } = message;
  let bothHavePerms = true;

  // If there is a permissions array for the command make sure the user has the permissions or is a developer
  if (
    command.permissions &&
    !config.developers.includes(member?.user.id ?? '')
  ) {
    let userHasPerms = true;
    let botHasPerms = true;

    const userLacks: PermissionResolvable[] = [];
    const botLacks: PermissionResolvable[] = [];

    for (const perm of command.permissions) {
      if (!member?.permissions.has(perm)) {
        userHasPerms = false;
        userLacks.push(perm);
      }

      if (!guild?.members.me?.permissions.has(perm)) {
        botHasPerms = false;
        botLacks.push(perm);
      }
    }

    if (!userHasPerms)
      client.respond(message, {
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setDescription(
              `⛔ You do not have the required permissions to run this command: ${new PermissionsBitField(
                userLacks
              )
                .toArray()
                .join(', ')}`
            ),
        ],
      });

    if (!botHasPerms)
      client.respond(message, {
        embeds: [
          new EmbedBuilder()
            .setColor('Red')
            .setTitle('Missing Perms')
            .setDescription(
              `I don't have required perms for this command: ${new PermissionsBitField(
                botLacks
              )
                .toArray()
                .join(', ')}`
            ),
        ],
      });

    if (!userHasPerms || !botHasPerms) bothHavePerms = false;
    return !bothHavePerms;
  }

  return undefined;
};

/**
 * Check if there is a conflict between environments.
 * The following takes effect when different environments are in the same guild:
 * Client in production responds by default and with -p
 * Client in beta responds with -b
 * Client in dev responds with -d.
 * @param args The arguments.
 * @param guild The guild.
 * @returns Whether or not there is a conflict.
 */
export const conflictExists = async (
  args: string[],
  guild: Guild
): Promise<boolean> => {
  const { ENVIRONMENT: ENV } = process.env;

  const hasArg = {
    dev: args.includes('-d'),
    beta: args.includes('-b'),
    production: args.includes('-p'),
  };

  if (ENV === 'production' && (hasArg.dev || hasArg.beta)) return true;
  if (ENV !== 'production' && hasArg.production) return true;
  const productionBot = await guild.members
    .fetch(config.productionId)
    .catch(() => null);
  if (ENV === 'dev' && productionBot && !hasArg.dev) return true;
  if (ENV === 'beta' && productionBot && !hasArg.beta) return true;

  return false;
};

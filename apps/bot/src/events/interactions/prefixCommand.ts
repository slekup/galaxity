import { ChannelType, Events, Message, PermissionFlagsBits } from 'discord.js';

import { EventBuilder } from '@utils/builders';
import * as commandMiddleware from '@utils/middleware/command';
import * as textCommand from '@utils/middleware/textCommand';

const cooldown = new Set();

export default new EventBuilder({
  name: Events.MessageCreate,
}).setExecute<[Message]>(async (client, message) => {
  const { content, channel, member, guild } = message;
  if (member?.user === client.user || member?.user.bot) return;
  if (!member) return;
  if (channel.type === ChannelType.DM) return;
  if (!textCommand.canSend(message)) return;
  if (!guild?.id || !client.user) return;

  // Message does not have the prefix
  const serverPrefix = `g `;

  // Respond when the bot is mentioned
  if (content === `<@${client.user.id}>`)
    return textCommand.respondToMention(serverPrefix, message, client);

  if (!content.startsWith(serverPrefix)) return;

  let args: string[] = content.slice(serverPrefix.length).trim().split(/ +/g);
  let cmd = args.shift()?.toLowerCase();

  // No command after prefix
  if (!cmd || cmd.length === 0) return;

  let command = client.prefixCommands.get(cmd);

  // Check if alias
  if (!command) {
    const aliasCmd = client.prefixAliases.get(cmd);
    if (!aliasCmd) return;
    command = client.prefixCommands.get(aliasCmd);
  }

  if (!command) {
    cmd += ` ${args.shift() ?? ''}`;
    command = client.prefixCommands.get(cmd);
  }

  if (!command) return;

  if (await textCommand.conflictExists(args, guild)) return;
  args = args.filter((arg) => !['-d', '-b', '-p'].includes(arg));
  if (textCommand.lacksPermission(command, client, message)) return;
  if (
    textCommand.hasInvalidOptions(serverPrefix, command, args, message, client)
  )
    return;

  try {
    if (cooldown.has(member.user.id)) {
      const msg = await client.respond(message, {
        content: `Woah, a little bit too fast there <@${member.user.id}>!`,
      });
      if (msg)
        setTimeout(() => {
          msg.delete().catch(() => null);
        }, 3000);
      return;
    }

    cooldown.add(member.user.id);
    setTimeout(() => cooldown.delete(member.user.id), 500);

    if (!command.execute) {
      client.respond(message, {
        content: 'This command is currently unavailable. Error: NE.',
        ephemeral: true,
      });
      client.logger.error(
        `Command ${command.name} does not have an execute function.`
      );
      return;
    }

    await command.execute(client, message, args);

    commandMiddleware.prefix({
      message,
      client,
      cmd: command.name,
      prefix: serverPrefix,
      type: 'prefix',
    });
  } catch (error) {
    client.logger.info(error);
    client.error({ error: error as Error, interaction: message });

    const owner = await guild.fetchOwner();
    const errDes = `
    \`\`\`yaml
    Command: ${command.name}
    User: ${member.user.tag}${
      member.permissions.has(PermissionFlagsBits.Administrator)
        ? ' (admin)'
        : ''
    } - ${member.user.id}
    Guild: ${guild.name} (${guild.memberCount}) - ${guild.id}
    Guild Owner: ${owner.user.tag} - ${guild.ownerId}
    Channel: ${channel.name} - ${channel.id}\`\`\`
    `;

    client.error({
      title: 'Prefix Command Failed',
      description: errDes,
      error: error as Error,
      interaction: message,
    });
  }
});

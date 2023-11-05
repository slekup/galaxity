import {
  BaseInteraction,
  ChatInputCommandInteraction,
  Events,
} from 'discord.js';

import config from '@config';
import Event from '@utils/builders/Event';
import * as commandMiddleware from '@utils/middleware/command';

const cooldown = new Set();

export default new Event({
  name: Events.InteractionCreate,
}).setExecute<[BaseInteraction]>(async (client, interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.guild || !interaction.channel?.id || !client.user) return;
  const { commandName, user } = interaction;

  // If the client has not synced with the database
  if (!client.synced)
    interaction.reply({
      content: `${client.user.username} is starting up, try again in a few seconds.`,
      ephemeral: true,
    });

  const command = client.commands.get(commandName);

  // If the command is not found
  if (!command) {
    interaction.reply({
      content:
        'There is no code for this command. It may have updated, please try to re-use the command.',
      ephemeral: true,
    });
    return;
  }

  try {
    // If the user is on command cooldown
    if (cooldown.has(user.id)) {
      const msg = await interaction.reply({
        content: `Woah, a little bit too fast there <@${user.id}>. Please try again after a few seconds.`,
        ephemeral: true,
      });
      setTimeout(() => {
        msg.delete().catch(client.logger.error);
      }, 3000);
      return;
    }

    // Add the user to the cooldown set
    cooldown.add(user.id);
    // Remove the user from the cooldown set after the specified button cooldown time
    setTimeout(() => cooldown.delete(user.id), config.limits.cooldown.slash[0]);

    if (command.execute)
      command.execute(client, interaction as ChatInputCommandInteraction);

    // Run the command middleware

    commandMiddleware.slash({
      client,
      interaction: interaction as ChatInputCommandInteraction,
    });
  } catch (err) {
    if (err) client.logger.error(err);
    interaction.reply({
      content: 'An error occurred while trying to execute that command.',
      ephemeral: true,
    });
  }
});

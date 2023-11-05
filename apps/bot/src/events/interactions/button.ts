import { BaseInteraction, Events } from 'discord.js';

import config from '@config';
import Event from '@utils/builders/Event';
import buttonMiddleware from '@utils/middleware/button';

const cooldown = new Set();

export default new Event({
  name: Events.InteractionCreate,
}).setExecute<[BaseInteraction]>(async (client, interaction) => {
  if (!interaction.isButton()) return;
  if (!interaction.guild || !interaction.channel?.id || !client.user) return;
  const { customId, user } = interaction;

  // If the client has not synced with the database
  if (!client.synced) {
    interaction.reply({
      content: `${client.user.username} is starting up, try again in a few seconds.`,
      ephemeral: true,
    });
    return;
  }

  let buttonId = customId;

  // If the button has arguments
  if (buttonId.includes('*')) {
    const index = buttonId.indexOf('*');
    buttonId = buttonId.substring(0, index);
  }

  // Get the button if it exists
  const button = client.buttons.get(buttonId);

  // If the button could not be found
  if (!button) {
    interaction.reply({
      content:
        'There is no code for this button. It may have updated, please try to re-use the command that made the button.',
      ephemeral: true,
    });
    return;
  }

  // If the button is a developer only button and the user is not a developer
  if (button.developer && !config.developers.includes(user.id)) {
    interaction.reply({
      content: 'This interaction is only available to the developer',
      ephemeral: true,
    });
    return;
  }

  try {
    // If the user is on button cooldown
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
    setTimeout(
      () => cooldown.delete(user.id),
      config.limits.cooldown.button[0]
    );

    // If the button has arguments
    if (customId.includes('*')) {
      // Get the button argments
      const args = customId
        .substring(customId.indexOf('*') + 1, customId.length)
        .split('-');

      // If the interaction should not be used by other members
      if (button.perUser) {
        const userId = args[0];

        if (user.id !== userId) {
          interaction.reply({
            content: 'This is for someone else.',
            ephemeral: true,
          });
          return;
        }

        // Remove user id from args
        args.shift();

        // Execute the button with args
        if (button.execute) await button.execute(client, interaction, args);
      } else if (button.execute) {
        // Execute the button without args
        await button.execute(client, interaction);
      }
    }

    // Run the button middleware
    buttonMiddleware(client, interaction);
  } catch (err) {
    if (err) client.logger.error(err);
    interaction.reply({
      content: 'An error occurred while trying to execute that command.',
      ephemeral: true,
    });
  }
});

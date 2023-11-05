import { BaseInteraction, Events } from 'discord.js';

import config from '@config';
import Event from '@utils/builders/Event';

export default new Event({
  name: Events.InteractionCreate,
}).setExecute<[BaseInteraction]>(async (client, interaction) => {
  if (!interaction.isModalSubmit()) return;
  if (!client.user) return;

  // If the client has not synced with the database
  if (!client.synced) {
    interaction.reply({
      content: `${client.user.username} is starting up, try again in a few seconds.`,
      ephemeral: true,
    });
    return;
  }

  const { customId, user } = interaction;

  let modalId = customId;

  // Remove the arguments from the modal id
  if (modalId.includes('*')) {
    const index = modalId.indexOf('*');
    modalId = modalId.substring(0, index);
  }

  // Get the modal
  const modal = client.modals.get(modalId);

  // If the modal doesn't exist
  if (!modal) {
    interaction.reply({
      content:
        'There is no code for this modal. It may have updated, please try to re-use the command that made the modal.',
      ephemeral: true,
    });
    return;
  }

  // If the modal is only for developers and the user is not a developer
  if (modal.developer && !config.developers.includes(user.id)) {
    interaction.reply({
      content: 'This interaction is only available to the developer',
      ephemeral: true,
    });
    return;
  }

  try {
    // If the modal has arguments
    if (customId.includes('*')) {
      // Get the arguments
      const args = customId
        .substring(customId.indexOf('*') + 1, customId.length)
        .split('-');

      // Execute the modal with arguments
      if (modal.execute) await modal.execute(client, interaction, args);
    } else if (modal.execute) {
      // Execute the modal without arguments
      await modal.execute(client, interaction);
    }
  } catch (error) {
    client.error({ error: String(error), interaction });
  }
});

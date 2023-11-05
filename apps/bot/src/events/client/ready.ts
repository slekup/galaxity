import { ActivityType, Events } from 'discord.js';

import config from '@config';
import Event from '@utils/builders/Event';
import { logger } from '@utils/client';
import { registerCommands } from '@utils/start';

export default new Event({
  once: true,
  name: Events.ClientReady,
}).setExecute(async (client) => {
  logger.info(`Logged in as ${client.user?.username ?? 'Unknown'}`);

  if (!client.user?.id) return;

  const developers = [];
  for (const id of config.developers) {
    try {
      const devUser = await client.users.fetch(id);
      developers.push(devUser.username);
    } catch (error) {
      developers.push(`Error: ${id}`);
    }
  }
  client.setDevelopers(developers);

  client.user.setPresence({
    activities: [{ name: 'Booting up...' }],
    status: 'idle',
  });

  await registerCommands(client);

  /**
   * Sets the status of the bot.
   */
  if (config.status)
    client.user.setPresence({
      activities: [{ name: config.status, type: ActivityType.Custom }],
      status: 'online',
    });
});

import Event from '@utils/builders/Event';
import { Events } from 'discord.js';

export default new Event({
  name: Events.Debug,
}).setExecute<[string]>((client, info): void => {
  // Ignore token info
  if (info.toLowerCase().includes('token')) return;
  // Ignore heartbeat info
  if (info.toLowerCase().includes('heartbeat')) return;
  // Log debug info
  client.logger.debug(`[DISCORD.JS DEBUG] ${info}`);
});

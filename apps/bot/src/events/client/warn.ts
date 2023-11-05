import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.Warn,
}).setExecute<[string]>((client, info) => {
  client.logger.warn(`Warning: ${info}`);
});

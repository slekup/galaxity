import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.ShardReconnecting,
}).setExecute<[string]>((client, id) => {
  client.logger.info(`Shard reconnecting: ${id}`);
});

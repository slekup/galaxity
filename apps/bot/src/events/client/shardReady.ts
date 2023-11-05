import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.ShardReady,
}).setExecute<[string, Set<string> | undefined]>(
  (client, id, unavailableGuilds) => {
    client.logger.info(`Shard ready: ${id}`);
    if (unavailableGuilds?.size)
      client.logger.info(`Shards unavailable: ${unavailableGuilds.size}`);
  }
);

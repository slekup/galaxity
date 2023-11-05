import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.ShardError,
}).setExecute<[Error, string]>((client, error: Error, shardId: string) => {
  client.logger.error(`Shard error: ${shardId}\nError: ${String(error)}`);
});

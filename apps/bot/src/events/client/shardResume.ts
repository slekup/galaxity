import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.ShardResume,
}).setExecute<[string, number]>(
  (client, id: string, replayedEvents: number) => {
    client.logger.info(
      `Shard resume: ${id} (${replayedEvents} events replayed)`
    );
  }
);

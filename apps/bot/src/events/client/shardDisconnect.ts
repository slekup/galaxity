import Event from '@utils/builders/Event';
import { Events } from 'discord.js';

export default new Event({
  name: Events.ShardDisconnect,
}).setExecute<[CloseEvent, number]>((client, event, id) => {
  client.logger.info(
    `Shard disconnected: ${id}\nReason: ${event.reason}\nCode: ${
      event.code
    }\n:Was Clean: ${event.wasClean ? 'true' : 'false'}`
  );
});

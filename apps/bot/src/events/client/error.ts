import { Events } from 'discord.js';

import Event from '@utils/builders/Event';

export default new Event({
  name: Events.Error,
}).setExecute<[Error]>((client, error) => {
  client.logger.error(error);
});

import config from '@config';
import { IExtendedClient } from '@typings/client';
import { DiscordLogger } from 'discord-advanced';

import customQueue from './logValues';

let discordLogger: DiscordLogger | undefined;

/**
 * Initializes the discord logger.
 * @param client The discord client.
 */
export const initDiscordLogger = (client: IExtendedClient): void => {
  discordLogger = new DiscordLogger({
    client,
    channels: {
      info: config.env.INFO_CHANNEL_ID,
      warn: config.env.WARN_CHANNEL_ID,
      error: config.env.ERROR_CHANNEL_ID,
      debug: config.env.DEBUG_CHANNEL_ID,
    },
    customQueue,
  });

  discordLogger.send('info', 'Discord logger is ready!');
};

export default discordLogger;

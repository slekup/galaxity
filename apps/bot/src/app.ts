import { ensureDirectories } from '@slekup/utils';
import colors from 'colors';

import config from '@config';
import { initializeProcessErrorHandling } from '@utils/client/errorHandler';
import connectToDatabase from '@utils/start/databaseConnection';
import databaseSync from '@utils/start/databaseSync';
import initializeHandlers from '@utils/start/initializeHandlers';
import { ExtendedClient } from './client';

/**
 * Main app file.
 * @param client The extended client.
 */
export default async (client: ExtendedClient): Promise<void> => {
  // Run startup functions
  ensureDirectories([
    ['./static', './tmp'],
    ['./tmp/logs'],
    [`./tmp/logs/${config.logFolder}`],
  ]);
  await initializeHandlers(client);
  initializeProcessErrorHandling(client);

  // Connect to database
  await connectToDatabase();

  // Sync database
  // Initialize translations

  // Authenticate the client
  const authStart = Date.now();
  await client.authenticate();
  const time = ((Date.now() - authStart) / 1000).toFixed(2);
  client.logger.info(colors.green(`Client authenticated in ${time} seconds`));

  await databaseSync(client);

  // Initialize discord logging (sends logs to discord channels)
  const { initDiscordLogger } = await import('./utils/client/discordLogger.js');
  initDiscordLogger(client);
};

import app from './app';
import { ExtendedClient } from './client';

/**
 * The extended client class.
 */
export const client = new ExtendedClient();

(() => {
  client.logger.info('Starting client');
  client.logger.debug('Debug Enabled');

  app(client);
})();

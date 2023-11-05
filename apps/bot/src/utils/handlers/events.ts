import { Events } from 'discord.js';

import Event from '@utils/builders/Event';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the events.
 * @param client The extended client.
 */
export default async (client: ExtendedClient): Promise<void> => {
  client.events.clear();

  const files = await loadFiles('events');

  for (const fileName of files) {
    client.logger.debug(`Importing event: ${fileName}`);

    const eventFile = (await import(`../../events/${fileName}.js`)) as
      | { default: Event | undefined }
      | undefined;

    if (!eventFile?.default) {
      client.logger.error(`Event: ${fileName} did not load properly`);
      continue;
    }

    const event = eventFile.default;

    if (event.disabled) {
      client.logger.warn(`Event: ${event.name} is disabled, skipping...`);
      continue;
    }

    if (!event.execute) {
      client.logger.error(`Event: ${event.name} is missing an export method`);
      continue;
    }

    client.events.set(event.name, event.execute);

    try {
      if (event.once)
        client.once(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          async () => {
            await client.ensureDatabaseSynced();
            if (event.execute) await event.execute(client);
          }
        );
      else
        client.on(
          event.name as Events.Raw | Events.VoiceServerUpdate,
          async (...args: unknown[]) => {
            await client.ensureDatabaseSynced();
            if (event.execute) await event.execute(client, ...args);
          }
        );
    } catch (error) {
      client.logger.error(`Event: ${event.name} failed to initialize`);
    }
  }
};

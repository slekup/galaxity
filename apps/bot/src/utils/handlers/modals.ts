import { Modal } from '@utils/builders';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the modals.
 * @param client The extended client.
 */
export default async (client: ExtendedClient): Promise<void> => {
  client.modals.clear();

  const files = await loadFiles('interactions/modals');

  for (const fileName of files) {
    client.logger.debug(`Importing modal: ${fileName}`);

    const modalFile = (await import(
      `../../interactions/modals/${fileName}`
    )) as { default: Modal | undefined } | undefined;

    const modal = modalFile?.default;

    if (!modal) {
      client.logger.error(`Modal: ${fileName} did not load properly`);
      continue;
    }

    if (modal.disabled) {
      client.logger.warn(`Modal: ${modal.id} is disabled, skipping...`);
      continue;
    }

    if (!modal.id) {
      client.logger.error(`Modal: ${modal.id} is missing an ID`);
      continue;
    }

    if (!modal.execute) {
      client.logger.error(`Modal: ${modal.id} is missing an export method`);
      continue;
    }

    client.modals.set(modal.id, modal);
  }
};

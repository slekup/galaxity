import { Command } from '@utils/builders';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Load the commands.
 * @param client The extended client.
 */
export default async (client: ExtendedClient): Promise<void> => {
  client.commands.clear();

  const files = await loadFiles('interactions/commands');

  for (const fileName of files) {
    client.logger.debug(`Importing command: ${fileName}`);

    const commandFile = (await import(
      `../../interactions/commands/${fileName}.js`
    )) as { default: Command | undefined } | undefined;

    if (!commandFile?.default) {
      client.logger.error(`Command: ${fileName} did not load properly`);
      continue;
    }

    if (!commandFile.default.data.name) {
      client.logger.error(`Command: ${fileName} is missing data or a name`);
      continue;
    }

    const command = commandFile.default;

    if (command.disabled) {
      client.logger.warn(
        `Button: ${command.data.name} is disabled, skipping...`
      );
      continue;
    }

    if (!command.execute) {
      client.logger.error(
        `Command: ${command.data.name} is missing an export method`
      );
      continue;
    }

    client.commands.set(command.data.name, command);
  }
};

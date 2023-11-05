import { PrefixCommand } from '@utils/builders';
import loadFiles from '@utils/client/loadFiles';
import { ExtendedClient } from 'src/client';

/**
 * Initializes all prefix commands.
 * @param client The extended client.
 */
const handlePrefixCommand = async (client: ExtendedClient): Promise<void> => {
  client.prefixCommands.clear();

  const files = await loadFiles('interactions/prefix');

  for (const fileName of files) {
    client.logger.debug(`Importing prefix command: ${fileName}`);

    const commandFile = (await import(
      `../../interactions/prefix/${fileName}.js`
    )) as { default: PrefixCommand | undefined } | undefined;

    if (!commandFile?.default) {
      client.logger.error(`Command: ${fileName} did not load properly`);
      continue;
    }

    const command = commandFile.default;

    if (command.disabled) {
      client.logger.warn(
        `Prefix Command: ${command.name} is disabled, skipping...`
      );
      continue;
    }

    if (command.name.split('.').length === 2) {
      const category = fileName.split('/').slice(-3)[0];
      if (!category) throw new Error(`Category not found ${command.name}`);
      command.category = category;
    } else {
      const category = fileName.split('/').slice(-2)[0];
      if (!category) throw new Error(`Category not found ${command.name}`);
      command.category = category;
    }

    client.prefixCommands.set(command.name.replaceAll('.', ' '), command);
    if (command.alias) client.prefixAliases.set(command.alias, command.name);
  }
};

export default handlePrefixCommand;

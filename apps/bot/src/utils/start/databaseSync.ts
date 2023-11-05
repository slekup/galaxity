import { IExtendedClient } from '@typings/client';

/**
 * Sync the database to local cache.
 * @param client The extended client.
 */
export default async (client: IExtendedClient): Promise<void> => {
  const timeStart = Date.now();

  const guildIds = (await client.guilds.fetch()).map((guild) => guild.id);

  // NOTE: Database sync functions go here, if they are to be added.
  // await Promise.all([
  //   await client.webhooks.sync(guildIds),
  // ]);

  const timeEnd = Date.now();
  client.logger.info(
    `Synced Guilds: ${guildIds.join(', ')} (${timeEnd - timeStart}ms)`
  );

  client.setSynced(true);
};

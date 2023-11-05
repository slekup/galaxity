import {
  serverInfoChannels,
  serverInfoGeneral,
  serverInfoOwner,
  serverInfoStats,
  serverInfoUsers,
} from '@interface/guild/serverinfo';

import { Button } from '@utils/builders';

export default new Button({
  id: 'serverinfo',
  description: 'Shows server information',
  perUser: true,
}).setExecute((client, interaction, args) => {
  const cat = args?.[0];

  switch (cat) {
    case 'general':
      serverInfoGeneral(client, interaction);
      break;
    case 'channels':
      serverInfoChannels(client, interaction);

      break;
    case 'users':
      serverInfoUsers(client, interaction);

      break;
    case 'stats':
      serverInfoStats(client, interaction);

      break;
    case 'owner':
      serverInfoOwner(client, interaction);
      break;
    default:
      client.logger.error(
        `Invalid server info category: ${cat} (${interaction.customId})`
      );
      break;
  }
});

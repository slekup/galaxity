import { serverInfoGeneral } from '@interface/guild/serverinfo';
import { PrefixCommand } from '@utils/builders';

export default new PrefixCommand({
  name: 'serverinfo',
  description: 'Show server information',
}).setExecute((client, message) => {
  serverInfoGeneral(client, message);
});

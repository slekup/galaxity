import helpInterface from '@interface/help/help';
import { PrefixCommand } from '@utils/builders';

export default new PrefixCommand({
  name: 'help',
  description: 'Shows the help menu',
}).setExecute((client, message) => {
  helpInterface(client, message);
});

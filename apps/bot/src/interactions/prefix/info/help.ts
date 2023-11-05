import { PrefixCommand } from '@utils/builders';

export default new PrefixCommand({
  name: 'paxson',
  description: 'A custom command',
}).setExecute(async (_client, message) => {
  await message.reply({
    content: 'Paxson is the best!',
    allowedMentions: { repliedUser: false },
  });
});

import { SlashCommandBuilder } from 'discord.js';

import { Command } from '@utils/builders';
import helpInterface from '@interface/help/help';

export default new Command({
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('help')
    .setDescription('Shows the help menu'),
}).setExecute((client, interaction) => {
  helpInterface(client, interaction);
});

import { SlashCommandBuilder } from 'discord.js';

import { Command } from '@utils/builders';
import { serverInfoGeneral } from '@interface/guild/serverinfo';

export default new Command({
  data: new SlashCommandBuilder()
    .setDMPermission(false)
    .setName('serverinfo')
    .setDescription('Shows server information'),
}).setExecute((client, interaction) => {
  serverInfoGeneral(client, interaction);
});

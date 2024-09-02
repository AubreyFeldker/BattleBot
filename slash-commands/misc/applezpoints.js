const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'misc',
  localOnly: true,
	data: new SlashCommandBuilder()
		.setName('applezpoints')
		.setDescription('? ? ? ?'),
	async execute(interaction, client) {
    interaction.reply({content: `You current have ${Math.round((Math.random() * 50000))} ${client.emoji.apple} Applez Points.`});
	},
};
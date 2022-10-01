// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level, Discord) => {
  // Setting member to first member memntioned
  const { ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
  
  const row = new Discord.MessageActionRow()
			.addComponents(
				new Discord.SelectMenuComponent()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Select me',
							description: 'This is a description',
							value: 'first_option',
						},
						{
							label: 'You can select me too',
							description: 'This is also a description',
							value: 'second_option',
						},
					),
			);
			
			return message.channel.send({ content: 'Test', components: [row] });
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod',
  args: 0,
};

module.exports.help = {
  name: 'dropdowntest',
  category: 'moderation',
  minidesc: 'Kick a user',
  description: 'kicks the mentioned member. Can be used with or without a stated reason.',
  usage: 'kick <@member> <reason>',
  details: '<@member> => Any valid member of the server that does not have a higher role and is not the owner.\n<reason> => The reason for the kick. Totally optional.',
};

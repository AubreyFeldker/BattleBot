const Discord = require('discord.js');
const eco = require('discordenvo');

module.exports = async (client, interaction) => {
	if (!interaction.isButton()) return;
	
	const buttonId = interaction.customId.split(" ");
	
	if (buttonId[0] == 'lb') {
		const num = buttonId.length == 6 ? parseInt(buttonId[3]) : 1;
		interaction.channel.messages.fetch(buttonId[buttonId.length - 1]).then(message => client.commands.get('nleaderboard').run(client, message, [buttonId[2], num, interaction], 0, Discord, eco) );
		
	}
	else {
	if (buttonId[0] == interaction.user.id || interaction.member.roles.cache.some((r) => r.name.includes('Moderator'))) {
		const page = buttonId[1].toLowerCase();
		let embed = new Discord.MessageEmbed();
		let comp = [interaction.message.components[0]];
		let arrows = new Discord.MessageActionRow();
		let person = interaction.guild.members.cache.get(buttonId[0]);
		
		let back = 1; let next = 2; let curr_page = 1;
		
		
		switch(page) {
			case "summ":
				embed = client.createProfEmbed(person, eco);
				break;
			case "prog":
				embed = client.createProgEmbed(person);
				const buttons = new Discord.MessageActionRow()		
				break;
			case "items":
				
				if (buttonId.length >= 3) {
					curr_page = parseInt(buttonId[2]);
					back = curr_page == 1 ? 1 : curr_page - 1;
					next = curr_page == 12 ? 12 : curr_page + 1;				
				}
				embed = client.createItemsEmbed(person, curr_page);
				arrows.addComponents(
					new Discord.MessageButton().setCustomId(`${person.id} items ${back} back`).setLabel('<--').setStyle('SECONDARY'),
					new Discord.MessageButton().setCustomId(`${person.id} items ${next} next`).setLabel('-->').setStyle('SECONDARY')
				);
				comp.push(arrows);
				break;
			case "emotes":
				let num_emotes = client.userEmotes.ensure(buttonId[0], []).length;
				
				if (num_emotes < 12) { next = 1;}
				else if (buttonId.length >= 3) {
					curr_page = parseInt(buttonId[2]);
					back = curr_page == 1 ? 1 : curr_page - 1;
					next = num_emotes > curr_page * 12 ? curr_page + 1 : curr_page;				
				}
				embed = client.createEmotesEmbed(person, curr_page);
				arrows.addComponents(
					new Discord.MessageButton().setCustomId(`${person.id} emotes ${back} back`).setLabel('<--').setStyle('SECONDARY'),
					new Discord.MessageButton().setCustomId(`${person.id} emotes ${next} next`).setLabel('-->').setStyle('SECONDARY')
				);
				comp.push(arrows);
				break;
			default:
				embed = client.createProfEmbed(person, eco);
		}	
		
			await interaction.update({ embeds: [embed], components: comp });
		
	}
		
		
	}
};


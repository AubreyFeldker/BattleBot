/*const Discord = require('discord.js');
//const eco = require('discordenvo');

module.exports = async (client, interaction) => {
	//console.log(interaction);
	if (interaction.isSelectMenu() && interaction.customId.split('-')[0] == 'dropdown') {
	
		let addedRoles = [];
		let removedRoles = [];
		let cont = 1;
		const user = client.userDB.get(interaction.member.id);
		//const roleArray = [['He/Him', 'She/Her', 'They/Them', 'Any Pronouns', 'Ask for Pronouns'], ['3D World', 'Mario Maker 2', 'Mario Kart', 'Mario Strikers', 'Mario Party', 'Smash Bros.'], ['Happening Space', 'Question of the Day']];
		
		
		interaction.values.forEach((val) => {
		const buttonId = val.split('-');
		const role = interaction.guild.roles.cache.find((r) => r.name === buttonId[2]);
		
		if (buttonId[1] != 1) { //Toggle role on/off
			if(interaction.member.roles.cache.has(role.id)) {
				interaction.member.roles.remove(role);
				removedRoles.push(role.name);
			}
			else { 
				interaction.member.roles.add(role); 
				addedRoles.push(role.name);
			}
		}
		else {
			const characters = client.characterRoleEmotes;
			
			//Check user is appropriate level for the role
			if(buttonId[3] == 2) {
				const rank = client.teamSettings.get('unlockableTeams').find((c) => c.teams.includes(role.name.slice(5)));
				if(user.rank + (user.prestige * 12) < rank.rankNeeded) {
					interaction.reply({ content: 'You are not a high enough level to obtain that team role!', ephemeral: true });
					cont = 0;
				}
			}
			if (cont == 1) {
			// Remove other character roles besides special ones if the user has one
			if (interaction.member.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)))) {
        		removedRoles.push(interaction.member.roles.cache.find((r) => r.name.includes('Team')&& characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))).name);
        		interaction.member.roles.remove(interaction.member.roles.cache.find((r) => r.name.includes('Team')&& characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))));
		}
			//Give the user the new character role
			interaction.member.roles.add(role);
			addedRoles.push(role.name);
		}}
	});
		interaction.reply({ content: `Added roles: ${addedRoles.join(', ')}\nRemoved roles: ${removedRoles.join(', ')}`, ephemeral: true });
	}
	else {
		
		if (interaction.customId == 'gooigi') {
			interaction.guild.channels.cache.get('370373520745693199').permissionOverwrites.edit(interaction.guild.id, { VIEW_CHANNEL: true });
		
			interaction.message.edit('OPENING CONSOLE');
			interaction.deferUpdate();
			return;
		}
	
	const buttonId = interaction.customId.split(" ");
	
	if (buttonId[0] == 'lb') {
		const num = buttonId.length == 6 ? parseInt(buttonId[3]) : 1;
		interaction.channel.messages.fetch(buttonId[buttonId.length - 1]).then(message => client.commands.get('leaderboard').run(client, message, [buttonId[2], num, interaction], 0, Discord) );
		
	}
	else if (buttonId[0] == 'addrole') {
		if (interaction.member.roles.cache.some((r) => r.name.includes("Mario's Marines")) || interaction.member.roles.cache.some((r) => r.name.includes("Wario's Scallywags"))) {
			interaction.reply({ content: 'Aye, ye already joined a team! As they say in every crew: "a flippant crew member is one that walks the plank"!', ephemeral: true }); // '
			return;
		}
		let role_name = buttonId[1] + " " + buttonId[2];
		//console.log(role_name);
		const mario_wario_role = interaction.guild.roles.cache.find((r) => r.name === role_name);
		interaction.member.roles.add(mario_wario_role);
		interaction.reply({ content: `Welcome aboard, sailor! Yer now part of ${role_name}!`, ephemeral: true }); // '
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
				embed = client.createProfEmbed(person);
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
}
};*/

const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		const client = interaction.client;
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);
	
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
	
		try {
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				console.log(`**${interaction.author.tag}** *(${interaction.author.id})* ran cmd \`${command.name}\` in ${interaction.guild ? `**${interaction.guild.name}** *(${interaction.guild.id})*` : '**DMs**'}!`);
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level, Discord) => {
  
  //Base character roles
  let row1 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('dropdown-1-1')
					.setPlaceholder('Base Team Roles')
			);
	client.teamSettings.get('teams').forEach ((char) => {
		let emote = client.emojis.cache.get(client.characterRoleEmotes.get(char).emote)
		row1.components[0].addOptions([{label: `Team ${char}`, value: `dropdown-1-Team ${char}-1`, emoji: {id: emote.id}}]);
	});
	
	let row1_2 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('dropdown-1-2')
					.setPlaceholder('Unlockable Team Roles')
			);
	client.teamSettings.get('unlockableTeams').forEach ((rank) => {
		if(rank.rankNeeded < 11) {
			rank.teams.forEach ((char) => {
				let emote = client.emojis.cache.get(client.characterRoleEmotes.get(char).emote)
				row1_2.components[0].addOptions([{label: `Team ${char}`, value: `dropdown-1-Team ${char}-2`, description: `Level up to RANK ${rank.rankNeeded} to unlock!`, emoji: {id: emote.id}}]);
			});
		}
	});
	
	//Pronoun roles
	const pronouns = ['He/Him', 'She/Her', 'They/Them', 'Any Pronouns', 'Ask for Pronouns'];
	let row2 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('dropdown-2')
					.setPlaceholder('Pronoun Roles')
					.setMaxValues(5)
			);
	pronouns.forEach ((w) => {
		row2.components[0].addOptions([{label: w, value: `dropdown-2-${w}`}]);
	});
	
	//LFG roles
	const lfg = ['3D World', 'Mario Maker 2', 'Mario Kart', 'Mario Strikers', 'Mario Party', 'Smash Bros.'];
	let row3 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('dropdown-3')
					.setPlaceholder('Looking for Games Roles')
					.setMaxValues(6)
			);
	lfg.forEach ((lfg) => {
		row3.components[0].addOptions([{label: lfg, value: `dropdown-3-${lfg} LFG`}]);
	});
	
	//Notif roles
	let row4 = new Discord.MessageActionRow()
			.addComponents(
				new Discord.MessageSelectMenu()
					.setCustomId('dropdown-4')
					.setPlaceholder('Notification Roles')
					.setMaxValues(2)
					.addOptions(
						{
							label: 'Happening Space',
							description: 'Stay up to date on all the events happening on 1-Up World!',
							value: 'dropdown-4-Happening Space',
						},
						{
							label: 'Question of the Day',
							description: 'Get notified whenever the Question of the Day is posted!',
							value: 'dropdown-4-Question of the Day',
						},
					),
			);
			
			return message.channel.send({ content: '<a:powerstar:621871806491525132> **Choose Your Roles!** <a:powerstar:621871806491525132>\nSelecting a role you already have will remove it from you. You may select multiple roles for pronouns, LFG, and other roles!', components: [row1, row1_2, row2, row3, row4] });
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  args: 0,
};

module.exports.help = {
  name: 'getroles',
  category: 'roles',
  minidesc: 'Role dropdown',
  description: 'Dropdown menu for more efficient role adding',
  usage: 'getroles',
};

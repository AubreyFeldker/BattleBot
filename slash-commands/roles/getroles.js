const { SlashCommandBuilder, StringSelectMenuBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        category: 'roles',
        data: new SlashCommandBuilder()
                .setName('getroles')
                .setDescription('Returns a dropdown menu for obtainable character roles.'),
        async execute(interaction, client) {
			const channel = interaction.options.getChannel('channel');
			//Base character roles
			let menu1 = new StringSelectMenuBuilder()
				.setCustomId('dropdown-1')
				.setPlaceholder('Core Team Roles');
			client.teamSettings.get('teams').forEach ((char) => {
				let emote = client.characterRoleEmotes.get(char) ?? client.emoji.boost_star;
				menu1.addOptions(new StringSelectMenuOptionBuilder()
					.setLabel(`Team ${char}`)
					.setValue(`reg|Team ${char}`)
					.setEmoji(emote)
				);
			});
			
			let menu2 = new StringSelectMenuBuilder()
				.setCustomId('dropdown-2')
				.setPlaceholder('Extra Team Roles');
			client.teamSettings.get('secretTeams').forEach ((char) => {
				if (char.desc) {
					let emote = client.characterRoleEmotes.get(char.name) ?? client.emoji.boost_star;
					menu2.addOptions(new StringSelectMenuOptionBuilder()
						.setLabel(`Team ${char.name}`)
						.setValue(`extra|Team ${char.name}`)
						.setDescription(char.desc)
						.setEmoji(emote)
					);
				}
			});

			let menu3 = new StringSelectMenuBuilder()
				.setCustomId('dropdown-3')
				.setPlaceholder('Unlockable Team Roles');
			client.teamSettings.get('unlockableTeams').forEach ((rank) => {
				rank.teams.forEach ((char) => {
					let emote = client.characterRoleEmotes.get(char) ?? client.emoji.boost_star;
					menu3.addOptions(new StringSelectMenuOptionBuilder()
						.setLabel(`Team ${char}`)
						.setValue(`unlock|Team ${char}`)
						.setDescription(`Level up to RANK ${rank.rankNeeded} to unlock!`)
						.setEmoji(emote)
					);
				});
			});

			const components = [new ActionRowBuilder().addComponents(menu1),
				new ActionRowBuilder().addComponents(menu2),
				new ActionRowBuilder().addComponents(menu3)
			];

			return interaction.reply({ content: '<a:powerstar:621871806491525132> **Choose Your Character Role!** <a:powerstar:621871806491525132>\nIf you want to add pronoun, LFG, or ping roles, check <id:customize>.', components: components });
        	//({content: "Menu sent!", ephemeral: true});
        },
};
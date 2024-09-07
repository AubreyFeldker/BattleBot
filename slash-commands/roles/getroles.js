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
				.setPlaceholder('Base Team Roles');
			client.teamSettings.get('teams').forEach ((char) => {
				let emote = client.characterRoleEmotes.get(char);
				menu1.addOptions(new StringSelectMenuOptionBuilder()
					.setLabel(`Team ${char}`)
					.setValue(`reg-Team ${char}`)
					.setEmoji(emote)
				);
			});
			client.teamSettings.get('secretTeams').forEach ((char) => {
				if (char.desc) {
					let emote = client.characterRoleEmotes.get(char.name) ?? client.emoji.boost_star;
					menu1.addOptions(new StringSelectMenuOptionBuilder()
						.setLabel(`Team ${char.name}`)
						.setValue(`reg-Team ${char.name}`)
						.setDescription(char.desc)
						.setEmoji(emote)
					);
				}
			});

			let menu2 = new StringSelectMenuBuilder()
				.setCustomId('dropdown-2')
				.setPlaceholder('Unlockable Team Roles');
			client.teamSettings.get('unlockableTeams').forEach ((rank) => {
				rank.teams.forEach ((char) => {
					let emote = client.characterRoleEmotes.get(char);
					menu2.addOptions(new StringSelectMenuOptionBuilder()
						.setLabel(`Team ${char}`)
						.setValue(`unlock-Team ${char}`)
						.setDescription(`Level up to RANK ${rank.rankNeeded} to unlock!`)
						.setEmoji(emote)
					);
				});
			});

			const row1 = new ActionRowBuilder().addComponents(menu1);
			const row2 = new ActionRowBuilder().addComponents(menu2);

			return interaction.reply({ content: '<a:powerstar:621871806491525132> **Choose Your Character Role!** <a:powerstar:621871806491525132>\nIf you want to add pronoun, LFG, or ping roles, check <id:customize>.', components: [row1, row2] });
        	//({content: "Menu sent!", ephemeral: true});
        },
};
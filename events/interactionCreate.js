const { Events, EmbedBuilder, PermissionsBitField } = require('discord.js');

// Button handling
async function handleButtons(interaction) {
	const buttonId = interaction.customId.split(" ");
	const client = interaction.client;
	
    // Switch based off which command this button was attacjed to
	switch(buttonId[0]) {
		case 'lb': // Leaderboard
			const num = buttonId.length == 6 ? parseInt(buttonId[3]) : 1;
            // Re-run the leaderboard command to build it at a different position
			interaction.channel.messages.fetch(buttonId[buttonId.length - 1])
                .then(message => 
                    client.commands.get('leaderboard').run(client, message, [buttonId[2], num, interaction], 0, Discord)
                );
			break;
		/*case 'addrole':
			if (interaction.member.roles.cache.some((r) => r.name.includes("Mario's Marines")) || interaction.member.roles.cache.some((r) => r.name.includes("Wario's Scallywags"))) {
				interaction.reply({ content: 'Aye, ye already joined a team! As they say in every crew: "a flippant crew member is one that walks the plank"!', ephemeral: true }); // '
				return;
			}

			let role_name = buttonId[1] + " " + buttonId[2];
			//console.log(role_name);
			const mario_wario_role = interaction.guild.roles.cache.find((r) => r.name === role_name);
			interaction.member.roles.add(mario_wario_role);
			interaction.reply({ content: `Welcome aboard, sailor! Yer now part of ${role_name}!`, ephemeral: true }); // '
			break;*/
		case 'qotd': //Question of the day submission
			let qotdSubmissionEmbed = EmbedBuilder.from(interaction.message.embeds[0]);
            //If the approval button, add the question's information to the QotD queue
			if(buttonId[1] == "approved") {
				client.questions.set(client.questions.autonum, {channel: qotdSubmissionEmbed.data.fields[0].name.slice(20,-2), question: qotdSubmissionEmbed.data.fields[0].value.slice(4), author: qotdSubmissionEmbed.data.footer.text.slice(9)});
				qotdSubmissionEmbed.setTitle('Question of the Day Submission [APPROVED]');
			}
            //Otherwise, delete the buttons and deny the question
			else
				qotdSubmissionEmbed.setTitle('Question of the Day Submission [DENIED]');

			interaction.update({embeds: [qotdSubmissionEmbed], components: []});
			break;
		default:
			interaction.followUp({content: "Unrecognized button format.", ephemeral: true});
	}
}

// Selection menu handling (team role)
async function handleSelect(interaction) {
	const id = interaction.customId.split('-');
	const client = interaction.client;
	if (id[0] == 'dropdown') {
	
		const user = client.userDB.get(interaction.member.id);		
		const characters = client.characterRoleEmotes;
		const buttonId = interaction.values[0].split('|');
		const role = interaction.guild.roles.cache.find((r) => r.name === buttonId[1]);	
		let removedRole;
		
		//Level-gated role: heck user is appropriate level for the role
		if(id[1] === "3") {
			const rank = client.teamSettings.get('unlockableTeams').find((c) => c.teams.includes(role.name.slice(5)));
			if(user.rank + (user.prestige * 12) < rank.rankNeeded) {
				return interaction.reply({ content: 'You are not a high enough level to obtain that team role!', ephemeral: true });
			}
		}
		// Remove other character roles besides special ones if the user has one
		if (interaction.member.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)))) {
			removedRole = interaction.member.roles.cache.find((r) => r.name.includes('Team')&& characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)));
			interaction.member.roles.remove(removedRole);
		}

		//Give the user the new character role
		interaction.member.roles.add(role);

		if (removedRole)
			interaction.reply({ content: `Added role: ${role}\nRemoved role: ${removedRole}`, ephemeral: true });
		else
		    interaction.reply({ content: `Added role: ${role}`, ephemeral: true });
	}
}

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Relegates the test client and main client to their own servers
		if (interaction.client.testClient != (interaction.guildId == "510274578107465732" || interaction.channel.id === "1281818000902852609") || interaction.client.responseInTest)
			return;
		const client = interaction.client;

        //Handle the button and select menu stuff in their own commands
		if (interaction.isButton()) return await handleButtons(interaction);
		else if (interaction.isStringSelectMenu()) return await handleSelect(interaction);

        //its a slash command then. grab the module for this slash command
		const command = interaction.client.commands.get(interaction.commandName);
	
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		// Checks if the slash command is either done by a mod or is used in a valid channel
		else if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages) || client.validChannels.includes(interaction.channel.id) || (command.useAnywhere || (command.validChannels && command.validChannels.includes(interaction.channel.id))))) {
			await interaction.reply({ content: 'Please keep all bot commands in <#355186664869724161>!', ephemeral: true });
		}
		try {
            // Log the interaction then execute it
			console.log(`${interaction.member.displayName} used the command ${interaction.commandName} in ${interaction.guild.name}'s #${interaction.channel.name}`);
			await command.execute(interaction, client);
		} catch (error) {
			console.error(error);
            // If the command failed mid-interaction, must provide a follow-up post instead of a normal post
            // Has an error message regardless
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
				console.log(`**${interaction.member.displayName}** *(${interaction.author.id})* ran cmd \`${command.name}\` in ${interaction.guild ? `**${interaction.guild.name}** *(${interaction.guild.id})*` : '**DMs**'}!`);
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
};
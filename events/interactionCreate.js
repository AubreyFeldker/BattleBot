const { Events, EmbedBuilder, PermissionsBitField, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const { Servers, Channels } = require('../src/consts/channels');
const { User } = require('../src/consts/user');

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
                interaction.update({embeds: [qotdSubmissionEmbed], components: []});
			}
            //Otherwise, delete the buttons and deny the question
			else {
                //await interaction.deferUpdate();
                const modal = new ModalBuilder()
                    .setCustomId('QDD-test')
                    .setTitle('Delete QotD');

                const removeReason = new TextInputBuilder()
                    .setCustomId('reason')
                    .setLabel('Deletion reason:')
                    .setStyle(TextInputStyle.Short);

                modal.addComponents(new ActionRowBuilder().addComponents(removeReason));
                await interaction.showModal(modal);

                let modalInput = {};
                const filter = (modalInteraction) => {
                    const interactionId = modalInteraction.customId.split('-');
                    return interactionId[0] === 'QDD'; };
                interaction.awaitModalSubmit({ filter, time: 15_000 })
                    .then(modalInteraction => {
                        modalInput.reason = modalInteraction.fields.getTextInputValue('reason');
                        modalInput.mod = modalInteraction.user.globalName;

                        qotdSubmissionEmbed.setTitle(`Question of the Day Submission [DENIED BY ${modalInput.mod.toUpperCase()}]`);
                        qotdSubmissionEmbed.setDescription(`Denial reason: ${modalInput.reason}`);

                        modalInteraction.update({embeds: [qotdSubmissionEmbed], components: []});
                    })
                    .catch(console.error);
            }
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
	
		const user = new User(client, interaction.member.id)
		const characters = client.characterRoleEmotes;
		const buttonId = interaction.values[0].split('|');
		const role = interaction.guild.roles.cache.find((r) => r.name === buttonId[1]);	
		let removedRole;
		
		//Level-gated role: check user is appropriate level for the role
		if(id[1] === "3") {
			const rank = client.teamSettings.get('unlockableTeams').find((c) => c.teams.includes(role.name.slice(5)));
			if(user.prestige() === 0 && user.rank() < rank.rankNeeded) {
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

/* // For handling modal inputs (QotD submissions)
async function handleModal(interaction) {
    const interactionId = interaction.customId.split('-');
    if(id[0] === 'QDD') {
        console.log(interaction);
    }
} */

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		// Relegates the test client and main client to their own servers
		if ((interaction.client.testClient !=
            (interaction.guildId == Servers.TEST_SERVER || interaction.channel.id === Channels.TEST_BOT_TESTING))
            && !interaction.client.responseInTest)
            
			return;

        // If interactions are disabled
        if (!interaction.client.interact && !(interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages))) {return;}

		const client = interaction.client;

        //Handle the button and select menu stuff in their own commands
		if (interaction.isButton()) return await handleButtons(interaction);
		else if (interaction.isStringSelectMenu()) return await handleSelect(interaction);
        else if (interaction.isModalSubmit()) return;

        //its a slash command then. grab the module for this slash command
		const command = interaction.client.commands.get(interaction.commandName);
	
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}
		// Checks if the slash command is either done by a mod or is used in a valid channel
		else if (!(interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)
            || client.validChannels.includes(interaction.channel.id)
            || (command.useAnywhere || (command.validChannels && command.validChannels.includes(interaction.channel.id))))) {

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
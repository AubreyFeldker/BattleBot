const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const { sendOutQuestion } = require('../../src/utils');

async function addQuestion(client, interaction) {
    const ms_in_day = (3600 * 1000 * 24);
	const dateString = interaction.options.getString('date') ?? null;
	const question = interaction.options.getString('question');

	if(! dateString) {
		client.questions.set(client.questions.autonum, {channel: interaction.options.getChannel('channel').id, question: question})
		interaction.followUp(`**New question added to the database!**\n ${question}`);
		if (! client.settings.get('questionSentToday')) //there was no question today
			sendOutQuestion();
		return;
	}
    
	let options = { weekday: 'long', month: 'short', day: 'numeric' };
	
	let parts = dateString.split('-');
	let myDate = new Date();
	let day = 0;
	try {
		myDate = new Date(parts[0], parts[1] - 1, parts[2]); 
		day = Math.floor(myDate.getTime() / ms_in_day);
	}
	catch (e) { 
        console.log(e);
        return interaction.followUp("Improper date formation! Proper formatting is `YYYY-MM-DD`.");
    }

	if (day == NaN)
		return interaction.followUp("Invalid date! Proper formatting is `YYYY-MM-DD`.");
	if (client.datedQuestions.has(day)) {
		return message.error(`There is already a question set to be posted on that day: "${client.datedQuestions.get(day).question}"`);
	}

	client.datedQuestions.set(day.toString(), {channel: interaction.options.getChannel('channel').id, question: question})
	return interaction.followUp(`New question added to the database!\n> ${question}\nIt will be posted on ${myDate.toLocaleDateString("en-US", options)}.`);
}

async function showQuestions(client, interaction) {
    const ms_in_day = (3600 * 1000 * 24);
    let startDay = Math.floor(Date.now() / ms_in_day);
	
	let rightNow = new Date();
    const noon = new Date(
        rightNow.getFullYear(),
        rightNow.getMonth(),
        rightNow.getDate(),
        12, 0, 0);
        
	if (rightNow.getTime() > noon.getTime()) { startDay++; rightNow = new Date(
        rightNow.getFullYear(),
        rightNow.getMonth(),
        rightNow.getDate() + 1);}
	let undatedKeys = client.questions.keyArray();
    let i = 0;
    let j = 0;
    let post = "";

    // Stuff for showing what date a question will be posted, w/formatting
    let options = { weekday: 'long', month: 'short', day: 'numeric' };
    
    while (i < 10) {
        if (client.datedQuestions.has(startDay)) {
            let questionInfo = client.datedQuestions.get(startDay);
            post += `[${startDay}] | ${rightNow.toLocaleDateString("en-US", options)} | <#${questionInfo.channel}> | ${questionInfo.question}\n`
        }
        else if (j < undatedKeys.length) {
            let questionInfo = client.questions.get(undatedKeys[j]);
            post += `[${undatedKeys[j].toString().padStart(5, '0')}] | ${rightNow.toLocaleDateString("en-US", options)} | <#${questionInfo.channel}> | ${questionInfo.question}\n`
            j++;
        }
        rightNow = new Date(
            rightNow.getFullYear(),
            rightNow.getMonth(),
            rightNow.getDate() + 1);
        startDay++;
        i++;
    }
    
    if (post === "") {return interaction.followUp("Question queue is empty.");}

    return interaction.followUp(post);
}

module.exports = {
        category: 'moderation',
		localOnly: false,
        data: new SlashCommandBuilder()
			.setName('editquestions')
			.setDescription('The backend of Question of the Day prompts.')
			.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
			.addSubcommand(subcommand =>
				subcommand.setName('add')
				.setDescription('Add a Question of the Day to the pile.')
				.addChannelOption(option =>
					option.setName('channel')
					.setDescription('The channel the question is sent in')
					.setRequired(true)
					.addChannelTypes(ChannelType.GuildText)
				)
				.addStringOption(option =>
					option.setName('question')
					.setDescription('The question in... question')
					.setRequired(true)
				)
				.addStringOption(option =>
					option.setName('date')
					.setDescription('The day this question will be sent (Format: YYYY-MM-DD)')
				)
			)
			.addSubcommand(subcommand =>
				subcommand.setName('show')
				.setDescription('Shows the upcoming Questions of the Day.')
			)
		,
        async execute(interaction, client) {
			await interaction.deferReply();

			switch(interaction.options.getSubcommand()) {
				case('add'):
					addQuestion(client, interaction);
					break;
				case('show'):
					showQuestions(client, interaction);
					break;
				default:
					interaction.followUp({content: "Unrecognized subcommand.", ephemeral: true});
			}
        },
};
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

async function clean (clientParam, text) {
  // If the text provided is of type Promise, await it
  // This negates the 'Pending<Promise>' text returned when a promise is provided
  if (text && text.constructor.name === 'Promise') {
    text = await text;
  }
  // If the text is not a string, convert it to one
  if (typeof text !== 'string') {
    // eslint-disable-next-line global-require
    text = require('util').inspect(text, { depth: 1 });
  }

  // Replace elements in the text string that could interfere with Discord markdown, @ing unnecessarily, or protecting the token
  text = text
    .replace(/`/g, `\`${String.fromCharCode(8203)}`)
    .replace(/@/g, `@${String.fromCharCode(8203)}`)
    .replace(clientParam.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

  // Return the text
  return text;
}

module.exports = {
  category: 'system',
	data: new SlashCommandBuilder()
		.setName('eval')
		.setDescription('Code to run.')
      .addStringOption(option =>
          option.setName('code')
              .setDescription('Code to run')
              .setRequired(true)
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
    if (! interaction.member.id == client.maker) {
      interaction.reply({content: "Hey, only Poochy is allowed to use this command!", ephemeral: true});
    }
    const code = interaction.options.getString('code');
    await interaction.deferReply();
    try {
      // Eval the code provided in an async function
      const evaled = await eval(`(async () => {${code}})()`);
      // Clean the returned value of the evaled code to ensure it's displayed properly and no sensitive information (such as the token) is displayed
      const cleaned = await clean(client, evaled);
  
      // Send the returned value of the cleaned eval
      interaction.followUp(`**Eval**\n\`\`\`js\n${cleaned}\`\`\``);
    } catch (err) {
      // If an error is caught, clean and send it
      const error = await clean(client, err);
      interaction.followUp(`**Eval**\n\`\`\`xl\n${error.split('at', 3).join(' ')}\`\`\``);
    }
	},
};
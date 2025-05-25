const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ButtonBuilder, ButtonStyle, ChannelType, ActionRowBuilder } = require('discord.js');
const { Channels } = require('../../src/consts/channels');

const oneWeek = 604800000;

module.exports = {
  category: 'forms',
  data: new SlashCommandBuilder()
    .setName('submit')
    .setDescription('Submit forms for the server.')
    .addSubcommand(subcommand =>
      subcommand.setName('qotd')
      .setDescription('Submit your idea for a Question of the Day, once per 7 days.')
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
    ).setDefaultMemberPermissions(PermissionFlagsBits.SendTTSMessages),
  async execute(interaction, client) {
    //Will split this off into its own method once multiple subcommands are implemented
    const lastQuestion = client.userDB.ensure(interaction.user.id, 0, "lastQuestion");
    const thisQuestion = Date.now();
    
    if(thisQuestion - lastQuestion < oneWeek) {
      return interaction.reply({content: `It's been too soon since your last Question of the Day submission! You'll be able to send a new one <t:${Math.floor((lastQuestion+oneWeek)/1000)}:R>.`, ephemeral: true});
    }

    const qotdSubmissionEmbed = new EmbedBuilder()
        .setColor(interaction.member.displayColor)
        .setTitle('Question of the Day Submission [UNTOUCHED]')
        .setAuthor({ name: '@' + interaction.user.tag, iconURL: interaction.member.displayAvatarURL()})
        .addFields({ name: `For submission in ${interaction.options.getChannel('channel')}:`, value: '>>> ' + interaction.options.getString('question') })
        .setFooter({ text: `User ID: ${interaction.user.id}` });

    const confirm = new ButtonBuilder()
        .setCustomId('qotd approved')
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success);
    const deny = new ButtonBuilder()
        .setCustomId('qotd denied')
        .setLabel('Deny')
        .setStyle(ButtonStyle.Danger);
    const row = new ActionRowBuilder().addComponents(confirm, deny);

    await interaction.guild.channels.cache.get(Channels.QOTD_SUBMISSIONS).send({embeds: [qotdSubmissionEmbed], components: [row]});
    interaction.reply({content: "Your question was submitted!", ephemeral: true});
    
    client.userDB.set(interaction.user.id, thisQuestion, "lastQuestion");
  },
};
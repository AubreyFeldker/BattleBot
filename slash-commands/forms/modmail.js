const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Channels } = require('../../src/consts/channels');

module.exports = {
    category: 'forms',
    data: new SlashCommandBuilder()
            .setName('modmail')
            .setDescription('Send a private message to the staff team.')
    .addStringOption(option =>
            option.setName('message')
            .setDescription('What you need to tell us')
            .setRequired(true)
            .setMaxLength(1_000)
    )
    .addAttachmentOption(option =>
        option.setName('image')
        .setDescription('Image relevant to the message, if you have any')
    ),
    async execute(interaction, client) {
        await interaction.deferReply();
        
        const mailer = interaction.member;

        // Build an embed with all information of the replier and the message input into the command
        let modmailEmbed = new EmbedBuilder()
            .setColor(mailer.displayColor)
            .setTitle('1-Up World Modmail Form')
            .setAuthor({ name: '@' + mailer.user.tag, iconURL: mailer.displayAvatarURL()})
            .addFields({ name: 'Message:', value: interaction.options.getString('message') },)
            .setTimestamp()
            .setFooter({ text: `User ID: ${mailer.id}` });
        // If there's submitted images, add their discord urls to the embed image
        if (interaction.options.getAttachment('image'))
            modmailEmbed.setImage(interaction.options.getAttachment('image').proxyURL);

        try {
            await interaction.guild.channels.cache.get(Channels.MODMAIL_SUBMISSIONS).send({embeds: [modmailEmbed]});
            return interaction.editReply({content: "Your message has been sent to the staff team! We'll reach out to you if any follow-up is required.", ephemeral: true});
        } catch (e) {
            return interaction.editReply({content: "Sorry, there was an error with sending the modmail! Please reach out to a staff member directly.", ephemeral: true});
        }
    },
};
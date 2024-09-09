const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

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
        interaction.deferReply();
        
        const mailer = interaction.member;

        let modmailEmbed = new EmbedBuilder()
            .setColor(mailer.displayColor)
            .setTitle('1-Up World Modmail Form')
            .setAuthor({ name: '@' + mailer.user.tag, iconURL: mailer.displayAvatarURL()})
            .addFields({ name: 'Message:', value: interaction.options.getString('message') },)
            .setTimestamp()
            .setFooter({ text: `User ID: ${mailer.id}` });
        if (interaction.options.getAttachment('image'))
            modmailEmbed.setImage(interaction.options.getAttachment('image').proxyURL);

        try {
            interaction.guild.channels.cache.get('904794977551413298').send({embeds: [modmailEmbed]});
            return interaction.reply({content: "Your message has been sent to the staff team! We'll reach out to you if any follow-up is required.", ephemeral: true});
        } catch (e) {
            return interaction.reply({content: "Sorry, there was an error with sending the modmail! Please reach out to a staff member directly.", ephemeral: true});
        }
    },
};
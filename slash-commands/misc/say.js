const { SlashCommandBuilder } = require('discord.js');
const { PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Relays the given message into a channel.')
      .addChannelOption(option =>
          option.setName('channel')
              .setDescription('Channel to send the message in')
              .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('message')
            .setDescription('Message to pass')
            .setRequired(true)
      )
      .addStringOption(option =>
        option.setName('response-id')
            .setDescription('ID of a message to reply to')
      ),
	async execute(interaction, client) {
        const channel = interaction.options.getChannel('channel');
        const msgRef = interaction.options.getString('response-id');
        const message = interaction.options.getString('message');

        const perms = channel.permissionsFor(client.user);
        const userPerms = channel.permissionsFor(interaction.member);

        if (!perms.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]))
          interaction.reply({content: "I'm unable to send messages in that channel!", ephemeral: true});
        else if (!userPerms.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]))
          interaction.reply({content: "You're unable to send messages in that channel!", ephemeral: true});
        else if (msgRef && ! channel.messages.cache.get(msgRef))
          interaction.reply({content: "I couldn't find the message you're trying to reply to!", ephemeral: true});
        else {
          await channel.send({content: "message", reply: { messageReference: msgRef}});
          interaction.reply({content: "Message sent!", ephemeral: true});
        }
	},
};

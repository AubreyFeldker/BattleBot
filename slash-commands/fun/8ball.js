const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('8ball')
		.setDescription('Seek the wisdom of the Super Mario Magic 8 Ball™.')
      .addStringOption(option =>
        option.setName('question')
            .setDescription('The question you want a response to')
            .setRequired(true)
      ),
	async execute(interaction, client) {
      const responses = ["WOWZER, OUTLOOK GOOD",
        "OH YEAH!",
        "NO PROBLEM!",
        "OKIE DOKIE!",
        "SIGNS SAY YA-HAAA!",
        "IT'S-A-CERTAIN",
        "WITHOUT A DOUBT!",
        "SIGNS POINT TO YES",
        "AS I SEE IT YES",
        "YEAH! YEAH! OF COURSE!",
        "CONCENTRATRATE, LET'S-A-GO",
        "ASK A BRO AGAIN",
        "SORRY, I'M-A TIRED",
        "ALL RIGHT, LET'S-A SEE",
        "ASK AGAIN LATER",
        "NO WAY, AMATEUR!",
        "AS I SEE IT, TOUGH LUCK!",
        "GAH! GIVE IT UP ALREADY!",
        "DON'T COUNT ON IT",
        "MY SOURCES SAY NO"
      ];

      const message = interaction.options.getString('question');
      const response = responses[Math.floor(Math.random() * responses.length)];

      interaction.reply(`-# "${message}"\n# \`${response}\``);
	},
  category: 'fun',
  localOnly: false,
  useAnywhere: true
};

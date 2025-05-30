const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { User } = require('../../src/consts/user');

module.exports = {
  category: 'economy',
  localOnly: false,
  data: new SlashCommandBuilder()
          .setName('daily')
          .setDescription('Collect Star Bits and Blue Coins once per day. Refreshes at 5am UTC.'),
  async execute(interaction, client) {
    const starbits = client.emojis.cache.get(client.emoji.starbits);
    const bluecoins = client.emojis.cache.get(client.emoji.bluecoins);
    
    const user = new User(client, interaction.user.id);
    const now = new Date();
    const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0);

    //Not enough time has passed to do the new daily
    if (today - user.lastDaily < 0) { 
  		const tom = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1,
			0, 0, 0);

  		interaction.reply({content: `Hold on now, you already collected your daily currencies! You will be able to get them again <t:${tom[Symbol.toPrimitive]('number') / 1000}:R>.`, ephemeral: true});
      return;
    }

    //If user has the 'Boost Star' role, rewards are doubled!
    const multi = (interaction.member.roles.cache.has('585533364489158666') ? 2 : 1) * client.settings.get('dailyMult'); 

    user.addCurrency('starbits', client.dailyStarbits * multi);
    user.addCurrency('bluecoins', client.dailyCoins * multi);

    user.setLast('Daily');

    interaction.reply(`Claimed! You collected **${client.dailyStarbits * multi} starbits** ${starbits} and **${client.dailyCoins * multi} Blue Coins** ${bluecoins}.\nYou now have **${user.currency.starbits} starbits** ${starbits} and **${user.currency.bluecoins} Blue Coins** ${bluecoins}!`);
  },
};
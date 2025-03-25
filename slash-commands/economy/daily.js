const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  category: 'economy',
  localOnly: false,
  data: new SlashCommandBuilder()
          .setName('daily')
          .setDescription('Collect Star Bits and Blue Coins once per day. Refreshes at 5am UTC.'),
  async execute(interaction, client) {
    const starbits = client.emojis.cache.get(client.emoji.starbits);
    const bluecoins = client.emojis.cache.get(client.emoji.bluecoins);
    
    const d_star = 5000;
    const d_coin = 5;
    
    let user = client.userDB.observe(interaction.user.id);
    const now = new Date();
    const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0, 0, 0);

    //Not enough time has passed to do the new daily
    if (today - user.last_daily < 0) { 
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

    user.starbits += (d_star * multi);  
		user.blue_coins += (d_coin * multi);
		user.last_daily = Date.now();
		
		let stats = client.userStats.observe(interaction.member.id);
		stats.starbits += (d_star * multi);
		stats.blue_coins += (d_coin * multi);

    interaction.reply(`Claimed! You collected **${d_star * multi} starbits** ${starbits} and **${d_coin * multi} Blue Coins** ${bluecoins}.\nYou now have **${user.starbits} starbits** ${starbits} and **${user.blue_coins} Blue Coins** ${bluecoins}!`);
  },
};
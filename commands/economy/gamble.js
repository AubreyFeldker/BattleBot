module.exports.run = async (client, message, args, level, Discord, eco) => {
  // Get the starbits emoji
  const starbits = client.emojis.cache.get(client.emoji.starbits);
  // Pasre the amount from args
  const amount = parseInt(args[0], 10);

  // If amount is NaN (Not a Number) or less than 0, error on insufficient amount
  if (isNaN(amount) || amount <= 0) { // eslint-disable-line no-restricted-globals
    return message.error('Insufficient Amount!', 'Please specify a proper amount of starbits you wish to gamble!');
  }

  // Fetch user balance and check if it's less than the amount provided. If it is, error on insufficient funds
  let user = client.userDB.observe(message.author.id);
  if (user.starbits < amount) {
    return message.error('Insufficient Funds!', 'You have less starbits than the amount you want to gamble!');
  }

  // Use pre-built coinflip function to calculate outcome and add/subtract from user's balance
  if (Math.random() > .5) {
  		user.starbits += amount;
  		client.userStats.observe(message.author.id).starbits += amount;
  		return message.success('You got heads!', `You gambled ${amount} starbits ${starbits} and won! Now, you have **${user.starbits} starbits ${starbits}**!`);
  }
  else {
  		user.starbits -= amount;
  		return message.error('You got tails!', `You gambled ${amount} starbits ${starbits} and lost... Now, you have **${user.starbits} starbits ${starbits}**!`);
  }

};

module.exports.conf = {
  guildOnly: true,
  aliases: ['g'],
  permLevel: 'Mod',
  args: 1,
  cooldown: 60,
};

module.exports.help = {
  name: 'gamble',
  category: 'economy',
  minidesc: 'Gambles specified # of starbits',
  description: 'Gambles the specified amount of starbits',
  usage: 'gamble <amount>',
  details: '<amount> => The amount you wish to gamble. Must be equal to or less than what you own',
};
module.exports.run = async (client, message, args, level, Discord, eco) => {
  // Get either a mentioned member or the member oject of the author
  const member = message.mentions.members.first() || message.member;
  // Get the starbits emoji
  const starbits = client.emojis.cache.get(client.emoji.starbits);

  // Fetch user balance from economy database
  const output = await eco.fetchBalance(member.id);
  // Send balance to channel
  return message.channel.send(`**${member.displayName}'s** balance is ${starbits} \`${output.balance.toLocaleString()} starbits\`!`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['bal', 'money', 'starbits'],
  permLevel: 'User',
};

module.exports.help = {
  name: 'balance',
  category: 'economy',
  minidesc: 'Shows user balance',
  description: 'Shows your current balance or the balance of a mentioned user',
  usage: 'balance <@user>',
  details: '<@user> => (Optional) Any valid member of the server',
};

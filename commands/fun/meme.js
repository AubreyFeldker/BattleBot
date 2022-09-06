// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  // Reads from text file memes.txt in order to create an array of memes
  var fs = require('fs');
  const memes = fs.readFileSync('/home/pi/BattleBot/commands/fun/memes.txt').toString().split("\n");

  // Gets a random number between 0 and length of memes - 1
  const random = Math.floor(Math.random() * memes.length);

  // Send the response
  return message.channel.send(`${memes[random]}`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  args: 0,
};

module.exports.help = {
  name: 'meme',
  category: 'fun',
  minidesc: 'Posts a meme',
  description: 'Posts a meme, can only be used in #mario-memes',
  usage: '<fun>',
  details: '<fun> => There. I just memed',
};

// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  // Reads from text file memes.txt in order to create an array of memes

  var fs = require('fs');

  if (args[0] == "add") {
	let memes = fs.readFileSync('/home/pi/BattleBot/commands/fun/memes.txt').toString().split("\n");
	let dupe = 0;

	for (let i = 0; i < memes.length; i++) {
		if (memes[i] == args[1].split("\n")[0])
			dupe = 1;
	}

	if (dupe == 0) {
		fs.appendFileSync('/home/pi/BattleBot/commands/fun/memes.txt', "\n" + args[1].split("\n")[0]);
		return message.success("New meme added to the database!", `${args[1].split("\n")[0]}`);
	}
	else
		return message.error("Duplicate meme!", `<${args[1].split("\n")[0]}> is already in the list of memes.`);
  }
  else if (args[0] == "remove") {
	let memes = fs.readFileSync('/home/pi/BattleBot/commands/fun/memes.txt').toString().split("\n");
	let nuMemes = "";
	let removed = 0;

	for (let i = 0; i < memes.length; i++) {
		if (memes[i] != args[1].split("\n")[0])
			nuMemes += memes[i] + "\n";
		else
			removed = 1;
	}
	nuMemes = nuMemes.slice(0, -2);

	if (removed == 1) {
		fs.writeFileSync('/home/pi/BattleBot/commands/fun/memes.txt', nuMemes);
		return message.success("Meme deleted!", `<${args[1].split("\n")[0]}> has been removed from the list of available memes.`);
	}
	else
		return message.error("Meme not found!", `I was unable to find <${args[1].split("\n")[0]}> in the list of memes.`);
  }
  else {
	return message.error("Incorrect syntax!", "Be sure to format the command as `.editmemes <add/remove> <link>`.");
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod',
  args: 2,
};

module.exports.help = {
  name: 'editmemes',
  category: 'moderation',
  description: 'Edits the list of memes available through the `.meme` command',
  usage: '.editmemes <add/remove> <link>',
};

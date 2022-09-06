// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  // Reads from text file memes.txt in order to create an array of memes

  var fs = require('fs');

  if (args[0] == "add") {
	let question = "";
	for (let i = 2; i < args.length; i++) {
		question = question + args[i] + " ";
	}

	fs.appendFileSync('/home/pi/BattleBot/commands/moderation/questions.txt', question);
	fs.appendFileSync('/home/pi/BattleBot/commands/moderation/questions.txt', "\n" + message.mentions.channels.first().id + "\n");
	return message.success("New question added to the database!", `${question}`);
  }
  if (args[0] == "addspecial") {
	let question = "";
	for (let i = 3; i < args.length; i++) {
		question = question + args[i] + " ";
	}

	var parts = args[2].split('-');
	try {
		var myDate = new Date(parts[0], parts[1] - 1, parts[2]); 
		if (myDate < new Date()) { throw " "; }
	}
	catch (e) { return message.error("Improper date formation!", 'Proper formatting is `YYYY-MM-DD`. Date must be in the future.'); }

	let spQuestions = fs.readFileSync('/home/pi/BattleBot/commands/moderation/questions_special.txt').toString().split("\n");
	for (let i = 2; i < spQuestions.length; i+=3) {
		if (args[2] == spQuestions[i]) { return message.error("Question already found!", `There is already a question set to be posted on that day: "${spQuestions[i-1]}"`); }
	}

	fs.appendFileSync('/home/pi/BattleBot/commands/moderation/questions_special.txt', question);
	fs.appendFileSync('/home/pi/BattleBot/commands/moderation/questions_special.txt', "\n" + message.mentions.channels.first().id + "\n" + args[2] + "\n");
	return message.success("New question added to the database!", `${question}\nIt will be posted on ${myDate.toLocaleDateString("en-US", options)}.`);
  }
  else if (args[0] == "remove") {
	let questions = fs.readFileSync('/home/pi/BattleBot/commands/moderation/questions.txt').toString().split("\n");
	let nuQuestions = ""
	let removeQ = args.slice(1).join(' ');
	let removed = false;

	for (let i = 0; i < questions.length - 1; i+= 2) {
		if (removeQ != questions[i]) {
			nuQuestions += (questions[i] + "\n" + questions[i+1] + "\n"); }
		else { removed = true; }
	}

	fs.writeFileSync('/home/pi/BattleBot/commands/moderation/questions.txt', nuQuestions);
	if (removed) { return message.success("Question removed!", `${removeQ}`); }
	else { return message.error("Question could not be found!", `${removeQ}`); }

  }	
  else if (args[0] == "show") { //Shows the next 10 questions in the queue
	let num = (args.size > 1) ? parseInt(args[1]) * 2 : 20
	let questions = fs.readFileSync('/home/pi/BattleBot/commands/moderation/questions.txt').toString().split("\n");
	let spQuestions = fs.readFileSync('/home/pi/BattleBot/commands/moderation/questions_special.txt').toString().split("\n");

	if (questions.length < 2) { message.channel.send("Question queue is empty."); }
	else {
		let i = 0;
		let j = 0;
		let post = "";

		// Stuff for showing what date a question will be posted, w/formatting
		let day = new Date();
		var options = { weekday: 'long', month: 'short', day: 'numeric' };

		while (i < questions.length - 1 && i < num - 1) {
			day.setDate(day.getDate() + 1)

			if ( j < spQuestions.length - 2) {
				let parts = spQuestions[j + 2].split('-');
				var spDate = new Date(parts[0], parts[1] - 1, parts[2]);

				if (day.getDate() == spDate.getDate()) { post += `${day.toLocaleDateString("en-US", options)} | <#${spQuestions[j+1]}> | ${spQuestions[j]}\n`; j += 3; continue; }
			}
			post += `${day.toLocaleDateString("en-US", options)} | <#${questions[i+1]}> | ${questions[i]}\n`;
			i += 2;
		}

		while (j < spQuestions.length - 1) {
			let parts = spQuestions[j + 2].split('-');
			var spDate = new Date(parts[0], parts[1] - 1, parts[2]);
			if (spDate.getDate() > day.getDate() + 7) { break; }
			post += `${spDate.toLocaleDateString("en-US", options)} | <#${spQuestions[j+1]}> | ${spQuestions[j]}\n`;
			j += 3;
		}

		message.channel.send(post);
	}
  }
  else if (args[0] == "archive") { //Posts text document with archive of questions
	message.channel.send({content: 'List of previously asked questions:', files: ['/home/pi/BattleBot/commands/moderation/questions_archive.txt']});
  }
  else if (args[0] == "search") { //Parses archive for questions that fit the given search criteria
	let keyword = "";
	for (let i = 1; i < args.length; i++) {
		keyword = (keyword + args[i] + " ").slice(0, -1);
	}
	let list =  `LIST OF QUESTIONS CONTAINING "${keyword}":`
	keyword = keyword.toLowerCase();

	let archive = fs.readFileSync('/home/pi/BattleBot/commands/moderation/questions_archive.txt').toString().split("\n");
	for (let j = 0; j < archive.length; j++) {
		if (archive[j].toLowerCase().includes(keyword))
			list += `\n  -  ${archive[j]}`
	}

	message.channel.send(list);
  }
  else {
	return message.error("Incorrect syntax!", "Be sure to format the command as `.editquestions <add/remove/show> <channel> <question>`.");
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['editqotd'],
  permLevel: 'Mod',
  args: 1,
};

module.exports.help = {
  name: 'editquestions',
  category: 'moderation',
  minidesc: 'Edit the list of questions',
  description: 'Edits the list of questions of the day',
  usage: '.editquestions <add/remove/show> <channel> <question>.',
};
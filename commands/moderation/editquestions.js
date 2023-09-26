// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  // Reads from text file memes.txt in order to create an array of memes
  
  const ms_in_day = (3600 * 1000 * 24)
  const today = Math.floor(Date.now() / ms_in_day);

  var fs = require('fs');

  if (args[0] == "add") {
	let q = "";
	for (let i = 2; i < args.length; i++) {
		q = q + args[i] + " ";
	}

	client.questions.set(client.questions.autonum, {channel: message.mentions.channels.first().id, question: q})
	return message.success("New question added to the database!", `${q}`);
  }
  if (args[0] == "addtimed") {
	let q = "";
	for (let i = 3; i < args.length; i++) {
		q = q + args[i] + " ";
	}


	let options = { weekday: 'long', month: 'short', day: 'numeric' };
	
	let parts = args[2].split('-');
	let myDate = new Date();
	let day = 0;
	try {
		myDate = new Date(parts[0], parts[1] - 1, parts[2]); 
		day = Math.floor(myDate.getTime() / ms_in_day);
		console.log(day);
	}
	catch (e) { return message.error("Improper date formation!", 'Proper formatting is `YYYY-MM-DD`.'); }

	if (day == NaN)
		return message.error("Invalid date!", 'Proper formatting is `YYYY-MM-DD`.');
	if (client.datedQuestions.has(day)) {
		return message.error("Question already found!", `There is already a question set to be posted on that day: "${client.datedQuestions.get(day).question}"`);
	}

	client.datedQuestions.set(day.toString(), {channel: message.mentions.channels.first().id, question: q})
	return message.success("New question added to the database!", `${q}\nIt will be posted on ${myDate.toLocaleDateString("en-US", options)}.`);
  }
  else if (args[0] == "remove") {
	let id = parseInt(args[1]).toString(); //Idiot proof removal of leading zeroes :P
	let text = "";
	
	if (client.datedQuestions.has(id) && id >= today) {
		text = client.datedQuestions.get(id).question;
		client.datedQuestions.delete(id);
	}
	else if (client.questions.has(id)) {
		text = client.questions.get(id).question;
		client.questions.delete(id);
	}
	else { return message.error("Question could not be found!", ""); }
		

	return message.success("Question removed!", `Question: "${text}"`);
	

  }	
  else if (args[0] == "show") { //Shows the next 10 questions in the queue
	
	let startDay = today;
	
	let rightNow = new Date();
   const noon = new Date(
	rightNow.getFullYear(),
	rightNow.getMonth(),
	rightNow.getDate(),
	12, 0, 0);
	
	if (rightNow.getTime() > noon.getTime()) { startDay++; rightNow = new Date(
	rightNow.getFullYear(),
	rightNow.getMonth(),
	rightNow.getDate() + 1);}
	let undatedKeys = client.questions.keyArray();
		let i = 0;
		let j = 0;
		let post = "";

		// Stuff for showing what date a question will be posted, w/formatting
		let options = { weekday: 'long', month: 'short', day: 'numeric' };
		
		while (i < 10) {
			if (client.datedQuestions.has(startDay)) {
				let questionInfo = client.datedQuestions.get(startDay);
				post += `[${startDay}] | ${rightNow.toLocaleDateString("en-US", options)} | <#${questionInfo.channel}> | ${questionInfo.question}\n`
			}
			else if (j < undatedKeys.length) {
				let questionInfo = client.questions.get(undatedKeys[j]);
				post += `[${undatedKeys[j].toString().padStart(5, '0')}] | ${rightNow.toLocaleDateString("en-US", options)} | <#${questionInfo.channel}> | ${questionInfo.question}\n`
				j++;
			}
			rightNow = new Date(
				rightNow.getFullYear(),
				rightNow.getMonth(),
				rightNow.getDate() + 1);
			startDay++;
			i++;
		}
		
		if (post === "") {return message.channel.send("Question queue is empty.");}

		message.channel.send(post);
  }
  else if (args[0] == "archive") { //Posts text document with archive of questions
	message.channel.send({content: 'List of previously asked questions:', files: ['/home/pi/BattleBot/commands/moderation/questions_archive.txt']});
  }
  else if (args[0] == "search") { //Parses archive for questions that fit the given search criteria
	let keyword = "";
	for (let i = 1; i < args.length; i++) {
		keyword = (keyword + args[i] + " ").slice(0, -1);
	}
	keyword = (keyword === "") ? " " : keyword;
	
	let list =  `LIST OF QUESTIONS CONTAINING "${keyword}":`
	keyword = keyword.toLowerCase();
	
	let searchedQs = client.datedQuestions.filterArray(val => val.question.toLowerCase().includes(keyword));
	for (let i = 0; i < searchedQs.length; i++) {
		list += `\n  -  ${searchedQs[i].question}`	
	}

	if (list.length > 2000) {
		fs.writeFileSync('/home/pi/BattleBot/commands/moderation/too_big_questions.txt', list);
		message.channel.send({files: ['/home/pi/BattleBot/commands/moderation/too_big_questions.txt']});
	}
	message.channel.send(list);
  }
  else {
	return message.error("Incorrect syntax!", "Be sure to format the command as `.editquestions <add/remove/show> <channel> <question>`.");
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['editqotd', 'editq'],
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
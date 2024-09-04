module.exports.run = async (client, message, args, level, Discord) => {
	
  let team_info = client.marioOrWario(message);
  if(team_info.team == 'mario' && client.onePieceVars.get('marioCanDecode'))
  		client.onePieceVars.set('marioCanDecode', false);
  else if(team_info.team == 'wario' && client.onePieceVars.get('warioCanDecode'))
  		client.onePieceVars.set('warioCanDecode', false);
  else 
  		return  message.channel.send('I can only run one decoding process at a time.');
  	
  message.channel.send(`I will try using \`${args[0]}\`! Commencing decoding process...`);
  
   setTimeout(() => { 
	switch (args[0].toUpperCase()) {
 		case "KOOPA-KIDS-LAW-OF-DICE-RECURSION":
 		message.channel.send("Computing `Koopa Kid's Law of Dice Recursion` on input...");
 		 	setTimeout(() => { 
 		 	if(args[1] == '30382') {
 		 		client.onePieceVars.observe(team_info.team + 'Die')[0] = {val: 8, changed: true};
 		 			message.channel.send("SUCCESS: Die face set to final output `8`.");
 		 	}
 		 	else
 		 			message.channel.send("ERROR: Invalid input for algorithm.");
 		 		
 		 	client.onePieceVars.set(team_info.team + 'CanDecode', true);
 		 }, 3000);
 		 	break; 
 		case "GADD-KAMEK-INTEGRAL-THEORY":
 		message.channel.send("Computing `Gadd-Kamek Integral Theory` on input...");
 		 	setTimeout(() => { 
 		 	if(args[1] == '567') {
 		 		client.onePieceVars.observe(team_info.team + 'Die')[1] = {val: 10, changed: true};
 		 		setTimeout(() => {
 		 			message.channel.send("SUCCESS: Die face set to final output `10`.");
 		 		}, 5000);
 		 	}
 		 	else {
 		 		setTimeout(() => {
 		 			message.channel.send("ERROR: Invalid input for algorithm. This one only takes integers.");
 		 		}, 10000);
 		 	}
 		 		
 		 	client.onePieceVars.set(team_info.team + 'CanDecode', true);
 		 }, 10000);
 		 	break;
 		case "FRANKIES-PERFECT-PLAN":
 		 	message.channel.send("Computing `Frankie's Perfect Plan` on input...");
 		 	if(args.slice(1).join(" ") == "I love you." || args.slice(1).join(" ") == "I love you!") {
 		 		let die = client.onePieceVars.observe(team_info.team + 'Die');
 		 		if (die[2].val < 8)
 		 			die[2].val += .05;
 		 		if(Math.abs(die[2].val - 8) < .04) {
 		 			die[2] = {val: 8, changed: true};
 		 			message.channel.send(`SUCCESS: Die face set to FINAL value \`8\`.`);
 		 		}
 		 		else
 		 			message.channel.send(`SUCCESS: Die face set to \`${Math.round(die[2].val * 100) / 100}\`.`);

 		 	}
 		 	else {
 		 			message.channel.send("ERROR: Invalid input for algorithm.");
 		 	}
 		 		
 		 	client.onePieceVars.set(team_info.team + 'CanDecode', true);
 		 	break;
 		case "ALLY-SUM-REDUCTION":
 		message.channel.send("Computing `Ally Sum Reduction` on input...");
 		 	setTimeout(() => { 
 		 	if(args[1] == '205') {
 		 		client.onePieceVars.observe(team_info.team + 'Die')[3] = {val: 9, changed: true};
 		 			message.channel.send("SUCCESS: Die face set to final output `9`.");
 		 	}
 		 	else
 		 			message.channel.send("ERROR: Invalid input for algorithm.");
 		 		
 		 	client.onePieceVars.set(team_info.team + 'CanDecode', true);
 		 }, 3000);
 		 	break;
 		case "KAMEK-SPELL-NO":
 		case "KAMEKS-SPELL-NUMBER":
 		message.channel.send("Computing `Kamek's Spell Number` on input...");
 		 	setTimeout(() => { 
 		 	switch(args[1]){
 		 	case '8':
 		 	case '88':
 		 		message.channel.send("WARNING: That's a valid input, yes, but I don't think that'll help out here.");
 		 		break;
 		 	case '30':
 		 		message.channel.send("SUCCESS: Die face set t- [INPUT INTERRUPT DETECTED]");
 		 		setTimeout(() => {
 		 			message.channel.send("```HEY! You really think you can change the die face that easily?! How could a suit of the boss possibly be interesting when I've studied everything about him but his bones! Heh, I'd like to see a number in Kamek's spellbook that shows me THAT!```");
 		 		}, 5000);
 		 		break;
 		 	case '25':
 		 		client.onePieceVars.observe(team_info.team + 'Die')[4] = {val: 10, changed: true};
 		 		message.channel.send("SUCCESS: Die face set to final output `10`.");
 		 		break;
 		 	default:
 		 			message.channel.send("ERROR: Invalid input for algorithm.");
 		 }		
 		 	client.onePieceVars.set(team_info.team + 'CanDecode', true);
 		 }, 5000);
 		 	break;
 		case "ADD":
				 message.channel.send("ERROR: `ADD` function is not installed on this device.");		
				 client.onePieceVars.set(team_info.team + 'CanDecode', true);

 			break;
 		case "SUBTRACT":
 			message.channel.send("Computing `Subtract` on input...");
 				setTimeout(() => {
 					if(args[1] == '-2') {
 						client.onePieceVars.observe(team_info.team + 'Die')[5] = {val: 8, changed: true};
 						message.channel.send("SUCCESS: Die face set to final output `8`.");
 					}
 					else 
 						message.channel.send("ERROR: Invalid input for algorithm.");
 					client.onePieceVars.set(team_info.team + 'CanDecode', true);
 				}, 10000);
 		default:
 	coord_decode(client, message, args, team_info);
 }
 }, 3500);

};

function coord_decode(client, message, args, team_info) {
	setTimeout(() => { 
 		 	message.channel.send('Coordinates found... Commencing scouting process...');
 		 	setTimeout(() => { 
 		 		message.channel.send('I found something! Commencing excavation process...');
 		 		setTimeout(() => { 
 		 		switch (args[0].toUpperCase()) {	
 		 				case client.settings.get("oup_coords", "one"):
 		 					message.channel.send('WOW! This is the most insane thing I have ever seen. Give me a second to transmit it to you...');
 		 					setTimeout(() => { 
 		 						message.channel.send('It takes a long time because it is really big.');
 		 						setTimeout(() => { 
 		 							message.channel.send('Good luck! https://cdn.discordapp.com/attachments/357328011889999873/1228786890979672195/numbercodehintart.png');
 		 							if(team_info.team == 'mario') { client.onePieceVars.set('marioCanDecode', true);}
  									if(team_info.team == 'wario') { client.onePieceVars.set('warioCanDecode', true);}
 		 						}, 10000);
 		 					}, 10000);
 		 					break;
 		 				case client.settings.get("oup_coords", "two"):
 		 					message.channel.send('Oh wow, I think this is the real deal this time! Give me a second to transmit it to you...');
 		 					setTimeout(() => { 
 		 						message.channel.send('Sorry I lied. https://cdn.discordapp.com/attachments/584662689658306561/1231118712174809138/onemorehint.png');
 		 						if(team_info.team == 'mario') { client.onePieceVars.set('marioCanDecode', true);}
  								if(team_info.team == 'wario') { client.onePieceVars.set('warioCanDecode', true);}
 		 					}, 10000);
 		 					break;
 		 				case client.settings.get("oup_coords", "three"):
 		 					message.channel.send("This is definitely the spot where I found The Treasure of the Giants before! There's nothing new here, but good job reaching this point!");
 		 					if(team_info.team == 'mario') { client.onePieceVars.set('marioCanDecode', true);}
  							if(team_info.team == 'wario') { client.onePieceVars.set('warioCanDecode', true);}
 		 					break;
 		 				case "BAYONETTA":
 		 					message.channel.send('Nevermind, just a rock. The key you provided must not have been correct.');
 		 					setTimeout(() => { 
 		 						message.channel.send('Wait a second...');
 		 						setTimeout(() => { 
 		 							message.channel.send(`Wow! This rock actually has something hidden inside it! Seems like you found a **P-Wing Token** ${client.emojis.cache.get('1239730304865013792')}!`);
									client.onePieceVars.set(team_info.team + 'CanDecode', true); 		 							
 		 							}, 10000);
 		 					}, 5000);
 		 					break;
 		 				case "AX8YOM":
 		 					message.channel.send('Oh I found some type of weird chest, with a die next to i--\n```Root installation activated... Downloading "IMPROVED_DECODE_V_08".```');
 		 					setTimeout(() => { 
 		 						message.channel.send("```YOU HAVE A MESSAGE: Heheheh, I've got you now! We're going to play a little game. If you can roll a 8, 9, or 10 on this die 3 times in a row, I'll let you have whatever junk is inside. Roll it as muuuuch as you like. Be warned though, I've done some research on how many sides a die has, and the results may not look good for you! Heheheh!```");
 		 						setTimeout(() => { 
 		 							message.channel.send("```New features downloaded...\n\n- Decode using specific math functions and theorems with the format .decode [function] [value]\n- NOTE: Functions are called with no spaces between words and removing any other special characters (i.e. apostrophes)\n- Utilize the .roll command to roll the die```");
									client.onePieceVars.set(team_info.team + 'CanDecode', true);
								}, 20000); 		 					
 		 					}, 20000);
 		 					break;
 		 				default:
 		 					message.channel.send('Nevermind, just a rock. The key you provided must not have been correct.');
 		 					if(team_info.team == 'mario') { client.onePieceVars.set('marioCanDecode', true);}
  							if(team_info.team == 'wario') { client.onePieceVars.set('warioCanDecode', true);}
 		 			}
				}, 10000);
			}, 10000);
	}, 10000);
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  args: 1,
};

module.exports.help = {
  name: 'decode',
  category: 'misc',
  minidesc: 'For finding the location of treasure',
  description: 'Input a key to help decode the location of the legendary 1-Up Piece!',
  usage: 'decode <key>',
};
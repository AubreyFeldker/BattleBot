module.exports.run = async (client, message, args, level, Discord) => {
	
  let team_info = client.marioOrWario(message);
  if(team_info.team == 'mario' && client.onePieceVars.get('marioCanDecode'))
  		client.onePieceVars.set('marioCanDecode', false);
  else if(team_info.team == 'wario' && client.onePieceVars.get('warioCanDecode'))
  		client.onePieceVars.set('warioCanDecode', false);
  else 
  		return  message.channel.send('I can only run one decoding process at a time.');
  	
  message.channel.send(`I will try using the key \`${args[0]}\`! Commencing decoding process...`);
  
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
 		 					message.channel.send("Is this it?! One of the great treasures of 1-Up World?! It seems to be... **The Treasure of the Giants**! I don't think it's the *Legendary Treasure* we're after... but it's certainly a step on the way to finding it!");
 		 					if(team_info.team == 'mario') { client.onePieceVars.set('marioCanDecode', true);}
  							if(team_info.team == 'wario') { client.onePieceVars.set('warioCanDecode', true);}
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
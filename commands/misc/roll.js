// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  let teamInfo = client.marioOrWario(message);
  let die = client.onePieceVars.get(teamInfo.team + 'Die');
  let inval_die = die.filter((side) => side.changed == false);
  
  let phase =  client.onePieceVars.get(teamInfo.team + 'Phase');
  client.onePieceVars.inc(teamInfo.team + 'Rolls');
  
  let valid_roll = true;
  let item;
  
  if(inval_die.length != 0 && client.onePieceVars.get(teamInfo.team + 'Heads') >= 2) {
  		item = inval_die[Math.floor(Math.random()*inval_die.length)]; 		
  		valid_roll = false;
  }
  else {
  		item = die[Math.floor(Math.random()*die.length)]; 	
  		valid_roll = item.changed;
  }
  
  if (valid_roll) {
  		client.onePieceVars.inc(teamInfo.team + 'Heads');
  		message.channel.send(`Hey, you rolled a ${item.val}! That's ${client.onePieceVars.get(teamInfo.team + 'Heads')} correct roll(s) in a row!`); //'
  }
  else {
  		client.onePieceVars.set(teamInfo.team + 'Heads', 0);
  		message.channel.send(`You rolled... a ${item.val}... Darn, time to try again...`);
  }
  
  if(client.onePieceVars.get(teamInfo.team + 'Rolls') >= 15) {
		  client.onePieceVars.set(teamInfo.team + 'Rolls', 0);
		  if (client.onePieceVars.get(teamInfo.team + 'Phase') == 1) {
		  		message.channel.send('*You hear a voice calling from inside the chest... It seems to be calling out... a website link???*\n > https://koopa-kursed-dies.neocities.org/diefaceappearance');
		  		 client.onePieceVars.inc(teamInfo.team + 'Phase');
		  }
		  else if (client.onePieceVars.get(teamInfo.team + 'Phase') == 2 && die[1].changed == true) {
		  		message.channel.send('*The mysterious voice calls out again... with another website link. How peculiar.*\n > https://koopa-kursed-dies.neocities.org/youresostupid');
		  		client.onePieceVars.set(teamInfo.team + 'Die', [{val:1,changed:false},{val:10,changed:true},{val:3,changed:false},{val:'text',changed:false},{val:5,changed:false},{val:6,changed:false}]);
				client.onePieceVars.inc(teamInfo.team + 'Phase');			
			}		  
		  
  }
  
  if (client.onePieceVars.get(teamInfo.team + 'Heads') == 3)
  	message.channel.send("Gasp... With the third die face hit, the lock on the chest magically (or mathematically?) opens with a click, revealing... the treasure was already discovered!");
  
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  args: 0,
};

module.exports.help = {
  name: 'roll',
  category: 'misc',
  minidesc: 'Rolls a die you have found',
  description: 'Rolls a die you have found',
  usage: 'roll',
};

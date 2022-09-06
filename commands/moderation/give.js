// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
  
  const starbits = client.emojis.cache.get(client.emoji.starbits);
  const bluecoins = client.emojis.cache.get(client.emoji.bluecoins);
  
  //Makes sure each mentioned user has a user stats & userDB object
  message.mentions.users.each(user => {
  		client.userDB.ensure(user.id, { id: user.id, points: 0, rank: message.member.roles.cache.has('391877990277185556') ? 1 : 0 , prestige: 0, blue_coins: 0, starbits: 0, last_daily: 0, last_work: 0});
  		client.userStats.ensure(user.id, { id: user.id, usage: 0, blue_coins: 0, starbits: 0, emotes: 0, spotlights: 0, trivia_nights: 0, mario_karts: 0, achievements: 0});
  	});

  if(args[0] == 'starbit' || args[0] == 'starbits') {
  		if (args[2] == 'everyone') {
  			if (isNaN(parseInt(args[1]))) { return message.error('Integer parsing error!', `Please input a real number for the number of starbits ${starbits}.`); }
			client.userDB.forEach(user => { user.starbits += parseInt(args[1]); });
			client.userStats.forEach(user => { user.starbits += parseInt(args[1]); });
			return message.success('Starbits added successfully!', `Every user who has utilized the bot gained ${args[1]} starbits ${starbits}!`)
  		}
  		else {
  			if (isNaN(parseInt(args[1]))) { return message.error('Integer parsing error!', `Please input a real number for the number of starbits ${starbits}.`); }
  			let i = 0;
  			let user = '';
  			
  			message.mentions.users.each(user => {
  				client.userDB.observe(user.id).starbits += parseInt(args[1]);
				client.userStats.observe(user.id).starbits += parseInt(args[1]);
			});
			
			return message.success('Starbits added successfully!', `The mentioned ${message.mentions.users.size} user${message.mentions.users.size == 1 ? '' : 's'} all gained **${args[1]} starbits ${starbits}!**`)
  		}
  }
  else if(args[0] == 'coin' || args[0] == 'coins') {
		  if (args[2] == 'everyone') {
  			if (isNaN(parseInt(args[1]))) { return message.error('Integer parsing error!', `Please input a real number for the number of Blue Coins ${bluecoins}.`); }
			client.userDB.forEach(user => { user.blue_coins += parseInt(args[1]); });
			client.userStats.forEach(user => { user.blue_coins += parseInt(args[1]); });
			return message.success('Blue Coins added successfully!', `Every user who has utilized the bot gained **${args[1]} Blue Coins ${bluecoins}!**`);
  		}
  		else {
  			if (isNaN(parseInt(args[1]))) { return message.error('Integer parsing error!', `Please input a real number for the number of Blue Coins ${bluecoins}.`); }
  			let i = 0;
  			let user = '';
  			
  			message.mentions.users.each(user => {	
				client.userDB.observe(user.id).blue_coins += parseInt(args[1]);
				client.userStats.observe(user.id).blue_coins += parseInt(args[1]);
			});
			
			return message.success('Blue Coins added successfully!', `The mentioned ${message.mentions.users.size} user${message.mentions.users.size == 1 ? '' : 's'} all gained **${args[1]} Blue Coins ${bluecoins}!**`);
  		}
  }
 	else if(args[0] == 'emote') {
 		const emote_id = client.stripEmote(args[1]);
 		if (! client.emotes.has(emote_id)) { return message.error('Emote not found!', 'Please insure that both you are trying to add an emote that has been added to the bot before.'); }
		console.log(emote_id);
		if (args[2] == 'everyone') {
			client.userEmotes.forEach((user,key) => {
				if (user.find(emote => emote.id === emote_id) === undefined) 
					user.push({id: emote_id, copies: 1, goldified: false});
				else 
					user.find(emote => emote.id === emote_id).copies++;
			});
			client.userStats.observe(user.id).emotes++;
			return message.success('Emote added successfully!', `Every user who has utilized the bot gained the **${client.emotes.get(emote_id).name} ${client.emojis.cache.get(emote_id)} emote**!`);
		}
		else {
			message.mentions.users.each((usera) => {
  				client.userEmotes.ensure(usera.id, []);
  				let user = client.userEmotes.observe(usera.id);
				if (user.find(emote => emote.id === emote_id) === undefined) 
					user.push({id: emote_id, copies: 1, goldified: false});
				else 
					user.find(emote => emote.id === emote_id).copies++;
			});
			client.userStats.observe(user.id).emotes++;
			return message.success('Emote added successfully!', `The mentioned ${message.mentions.users.size} user${message.mentions.users.size == 1 ? '' : 's'} all gained the **${client.emotes.get(emote_id).name} ${client.emojis.cache.get(emote_id)} emote**!`);
		}
	}
	else 
		return message.error('Incorrect giving type!', 'The second argument of the command must be either "starbit", "coin", or "emote".');
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod',
  args: 3,
};

module.exports.help = {
  name: 'give',
  category: 'moderation',
  minidesc: 'Gives items to users',
  description: 'Give Blue Coins, emotes, or Starbits to users',
  usage: '.give <starbits/coins/emote> <number/emote> <list-of-users/everyone>',
};

// Require the items.json file
const Enmap = require('enmap');

const pull_price = 5;
const emote_rarities = new Map([
  		[1, "Common"],
  		[2, "Uncommon"],
  		[3, "Super"],
  		[4, "Ultra"],
  		[5, "Special"]
  ]);
  
 function pull_rarities (val) {
 	if (val < .4)
 		return 1;
 	else if (val < .7)
 		return 2;
 	else if (val < .85)
 		return 3;
 	else if (val < .9)
 		return 4;
 	else 
 		return "spotlight";
 ;}
 
 
 
// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
	const bluecoins = client.emojis.cache.get(client.emoji.bluecoins);
	let num_pulls = args[0] ? (! ! parseInt(args[0]) ? parseInt(args[0]) : 1) : 1; // if the first argument is a number, make it the num of pulls
	if (num_pulls > 10) { num_pulls = 10; }
	
	client.userDB.ensure(message.author.id, { points: 0, rank: message.member.roles.cache.has('391877990277185556') ? 1 : 0 , prestige: 0, blue_coins: 0, starbits: 0, last_daily: 0, last_work: 0});
	let user = client.userDB.observe(message.author.id);
	let stats = client.userStats.observe(message.author.id);
	
	if (user.blue_coins < pull_price * num_pulls) { return message.error('Not enough Blue Coins!', `You need ${pull_price * num_pulls} Blue Coins ${bluecoins} for this pull, but you only have ${user.blue_coins}. Try using the \`.daily\`command to get more!`);}

	let msg = "";
	
	for (let i = 0; i < num_pulls; i++) {
		let pulled_emote = 0;
		let rar = pull_rarities(Math.random());
		
		if (rar == "spotlight") {
			stats.spotlights++;
			pulled_emote = client.emotes.filter(emote => emote.is_spotlight).random();
		}
		else {
			pulled_emote = client.emotes.filter(emote => emote.rarity == rar && ! emote.is_spotlight).random();
		}
			console.log(pulled_emote);
			client.userEmotes.ensure(message.author.id, []);
			if (client.userEmotes.get(message.author.id).find(emote => emote.id === pulled_emote.id) === undefined) {
				client.userEmotes.push(message.author.id, {id: pulled_emote.id, copies: 1, goldified: false});
				msg += `• **${pulled_emote.alt_name != [] ? pulled_emote.alt_name[0] : pulled_emote.name}** ${client.emojis.cache.get(pulled_emote.id)} - Rarity: ${emote_rarities.get(parseInt(pulled_emote.rarity))} [**NEW!!**]\n`;
			}
			else {
				let copies = client.userEmotes.observe(message.author.id).find(emote => emote.id === pulled_emote.id).copies++;
				msg += `• **${pulled_emote.alt_name != [] ? pulled_emote.alt_name[0] : pulled_emote.name}** ${client.emojis.cache.get(pulled_emote.id)} - Rarity: ${emote_rarities.get(parseInt(pulled_emote.rarity))} [Lv. ${copies}]\n`;
			}
	}
	user.blue_coins -= pull_price * num_pulls;
	stats.emotes += num_pulls;
	msg += `\nThis pull cost you ${pull_price * num_pulls} Blue Coins ${bluecoins}, leaving you with **${user.blue_coins} Blue Coins** ${bluecoins}!`;
	return message.success("Here's the emotes you pulled!", msg);
  
};

module.exports.conf = {
	guildOnly: true,
	aliases: ['gacha'],
	permLevel: 'Mod',
};

module.exports.help = {
	name: 'pull',
	category: 'emotes',
	minidesc: 'Pull for emotes with Poochybot',
	description: 'Obtain new emotes randomly for your Poochybot collection!',
	usage: 'pull [1-10]',
};
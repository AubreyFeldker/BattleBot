module.exports.run = async (client, message, args, level, Discord, eco) => {
  // Get the starbits emoji
  const starbits = client.emojis.cache.get(client.emoji.starbits);
  const bluecoins = client.emojis.cache.get(client.emoji.bluecoins);
  
  let payloads = require('./payloads.json');
  console.log(payloads);
  
  const characters = ['Mario', 'Luigi', 'Bowser', 'Peach', 'Yoshi', 'E. Gadd', 'the Koopalings', 'Toad', 'Toadette', 'Cappy', 'Rosalina', 'Boo', 'Goomba', 'Koopa Troopa', 'Koopa the Quick', 'Donkey Kong', 'Daisy', 'Wario', 'Waluigi', 'Shy Guy', 'Chargin Chuck', 'Pyoro', 'Beaoro', 'Bayonetta', 'King K. Rool', 'Funky Kong', 'The Chimp', 'The Champ', 'Cranky Kong', 'Rabbid Peach', 'Judge Pianta', 'Plessie', 'King Augustus Septemberus Octoberus Koopa', 'Jr. Troopa', 'Wart', 'King Boo', 'Ninji', 'Pauline', 'Tiara', 'the Broodals', 'Jack Black', 'Foreman Spike', 'Diddy Kong', 'Dixie Kong', 'Whomp', 'Pidgit', 'Gooper Blooper', 'Scuttlebug', 'Nabbit\'s Ghost'];
  const jobs = ['Personal Chef', 'Minion', 'Bodyguard', 'Lawyer', 'Assistant', 'Babysitter', 'Personal Maid', 'Mailman', 'Driver', 'Gardener', 'Lawn-Mower', 'Consultant', 'Copyright Lawyer', 'Player 2', 'Trash Collector', 'Hair Stylist', 'Pet Sitter', 'Hitman', 'Therapist', 'Tour Guide', 'Photographer', 'Jester', 'Partner in Crime', 'DJ'];
  
  const location = client.locations.some(loc => loc.name == args.join(' ')) ? client.locations.find(loc => loc.name == args.join(' ')) : client.locations.get(Math.floor(Date.now() / (3600 * 1000 * 24)) % client.locations.count + 1); //The location for working changes each day
  console.log(location);
  
  let user = client.userDB.observe(message.author.id);
  
  if (Date.now() - user.last_work < 3600 * 6000) { //Not enough time has passed to do the new work
  		return message.error("Your next work shift isn't up yet!", `**${message.member.displayName}**, You can work again <t:${Math.round((user.last_work + (3600 * 6000)) / 1000)}:R>!`)
  }
  
  else {
  		let initial_val = 0;
  		payloads = payloads.filter(item => location.payload.some(v => v == item.id));
  		console.log(payloads);
  		let totalWeight = Math.round(Math.random() * payloads.reduce( (prev, curr) => prev + curr.weight, initial_val )); //Sums up the total weight of every object in the location's payload, then creates a random number from it
		let i = -1;
		console.log(totalWeight);
		
		while (totalWeight > 0) { //Gets the item in the list based on its weight - the heavier it is, the more likely it is selected statistically
			i++;
			totalWeight -= payloads.at(i).weight;
		}
		
		const won_item = payloads.at(i);
		let stats = client.userStats.observe(message.author.id);
		console.log(won_item); console.log(i);
		let amt = 0;
		let reward = '';
		
		switch (won_item.type) {
			case ('starbits'):
				amt = Math.round(won_item.amount * (1 - (.5 - Math.random()) * .4));
				user.starbits += amt; stats.starbits += amt;
				reward = `${amt} starbits ${starbits}`; break;
			case ('coins'):
				amt = Math.round(won_item.amount * (1 - (.5 - Math.random()) * .4));
				user.blue_coins += amt; stats.blue_coins += amt;
				reward = `${amt} Blue Coins ${bluecoins}`; break;
			case('emote'):
				client.userEmotes.ensure(message.author.id, []);
				amt = client.emotes.filter(emote => emote.rarity === won_item.rarity).random();
				console.log(amt);
				
				if (client.userEmotes.get(message.author.id).find(emote => emote.id === amt.id) === undefined) {
					client.userEmotes.push(message.author.id, {id: amt.id, copies: 1, goldified: false});
					}
				else {
					client.userEmotes.observe(message.author.id).find(emote => emote.id == client.emotes.find(e => e.name === amt.name).id).copies++;
					}
				i = client.emojis.cache.find(emote => emote.name === amt.name);
				stats.emotes++;
				reward = `the ${amt.alt_name.length > 0 ? amt.alt_name[0] : amt.name} emote ${i}`; break;
			case('emote-ex'):
				client.userEmotes.ensure(message.author.id, []);
				amt = location.emotes[Math.floor(Math.random() * location.emotes.length)];
				amt = client.emotes.find(emote => emote.name === amt);
				console.log(amt);
				
				if (client.userEmotes.get(message.author.id).find(emote => emote.id === amt.id) === undefined) {
					client.userEmotes.push(message.author.id, {id: amt.id, copies: 1, goldified: false});
					}
				else {
					client.userEmotes.observe(message.author.id).find(emote => emote.id === amt.id).copies++;
					}
				
				em = client.emojis.cache.find(emote => emote.name === amt.name);
				stats.emotes++;
				reward = `the ${amt.alt_name.length > 0 ? amt.alt_name[0] : amt.name} emote ${em}`; break;
			case('title'):
				amt = 'title thingy';
				break;
			
		}
		
		user.last_work = Date.now();
		return message.success(`Job in ${location.name} finished successfully!`, `You worked as ${characters[Math.floor(Math.random() * characters.length)]}'s ${jobs[Math.floor(Math.random() * jobs.length)]} in ${location.name} and earned **${reward}**!`) //'
		
  }
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['w', 'nuwork'],
  permLevel: 'Mod',
};

module.exports.help = {
  name: 'work',
  category: 'economy',
  minidesc: 'Get rewards every 6 hours',
  description: 'Gives you Starbits, Blue Coins, emotes, or other things every 6 hours',
  usage: 'work',
};
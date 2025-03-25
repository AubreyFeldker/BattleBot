// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level) => {
	let id = '';
	let user_emotes = client.userEmotes.get(message.author.id);
	let pos_emote = client.emojis.cache.get(client.stripEmote(args[0]));
	
	if (pos_emote !== undefined) {
		if (client.emotes.has(pos_emote.id) && user_emotes.some(emote => emote.id == pos_emote.id))
			id = pos_emote.id;
		else 
			return message.error("You haven't pulled such an emote!", "a")
	}
	else {
		pos_emote = client.emotes.find(emote => emote.name == args.join(' ') || emote.alt_name.has(args.join(' ')));
		if (pos_emote !== undefined) {
			if (user_emotes.some(emote => emote.id == pos_emote.id))
				id = pos_emote.id;
			else 
				return message.error("You haven't pulled such an emote!", "a")
		}
		else 
			return message.error("You haven't pulled such an emote!", "a")
	}
	
	const emotesEmbed = new Discord.MessageEmbed()
        .setColor('#FFFFFF')
        .setTitle(`${person.displayName} sent a ${client.emotes.get(id).alt_name[0]}!`)
        .setImage(`https://cdn.discordapp.com/emojis/${id}.${client.emojis.cache.get(id).animated ? 'gif' : 'png'}`);
        
   return message.channel.send({ embeds: [emotesEmbed]});
  
};

module.exports.conf = {
	guildOnly: true,
	aliases: ['mega', 'bigemote'],
	permLevel: 'Mod',
};

module.exports.help = {
	name: 'megamote',
	category: 'emotes',
	minidesc: "Post mega-sized emotes",
	description: "Post mega-sized versions of 1-Up World emotes you've obtained through Poochy's Emote Rally!",
	usage: 'megamote <emote name/emote itself>',
};
// eslint-disable-next-line no-unused-vars
module.exports.run = (client, message, args, level, Discord) => {	
	
	let user = client.userDB.get(message.author.id);
	const type = args[0].toLowerCase()
	
	if (args[0].toLowerCase() == 'emote') {
		if (args.length == 1) {
			client.userDB.update(message.author.id, {att_emote: ''});		
		}
		
		let user_emotes = client.userEmotes.get(message.author.id);
		let pos_emote = undefined;
		try { pos_emote = client.emojis.cache.get(client.stripEmote(args[1])); } catch(e) {}
	
		let emote_name = (pos_emote !== undefined ? pos_emote.name : args.slice(1).join(' ')).toLowerCase();
		
		if (client.emotes.some(emote => (emote.name.toLowerCase() === emote_name || emote.alt_name.some(element => element.toLowerCase() == emote_name)))) {
			let id = client.emotes.find(emote => (emote.name.toLowerCase() === emote_name || emote.alt_name.some(element => element.toLowerCase() == emote_name))).id;
			
			if (! user_emotes.some(emote => emote.id == id) ) {
				return message.error('You have not obtained this emote!', "You can only attach emotes you have obtained through Poochy's Emote Rally. You can check which ones you have currently with `.profile emotes`.");
			}
			
			client.userDB.update(message.author.id, {att_emote: id});	
			return message.success(`Attached the ${client.emotes.get(id).name} ${client.emojis.cache.get(id)} emote to you!`, "You'll now see it anywhere while using this bot!")
			
		}
		else 
			return message.error('Emote not found!', "You can only attach emotes you have obtained through Poochy's Emote Rally. Be sure to double check the correct name for misspellings.");
	}
  
};

module.exports.conf = {
	guildOnly: true,
	aliases: ['setmy'],
	permLevel: 'Mod',
};

module.exports.help = {
	name: 'attach',
	category: 'misc',
	minidesc: "Change your title/emote",
	description: "Post mega-sized versions of 1-Up World emotes you've obtained through Poochy's Emote Rally!",
	usage: 'attach <title/emote> <title/emote name>',
};
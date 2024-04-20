const Discord = require('discord.js');

    const levelUpEmojis = [
    	'891851922615701565', // Start
      '751523400681259110', // Shroom
      '751523400782053567', // Shell
      '751523400421474516', // Flower
      '751523400803024927', // Leaf
      '754054543238627389', // Bell
      '751523400173879486', // Feather
      '754044526166933654', // Egg
      '754129851245658112', // Starbit
      '751523400538783775', // Moon
      '754060026146193419', // Shine
      '754044526460665856', // Special
      '893392833925505075', // 1-Up
    ];
    
    const levelUpEmojis8Bit = [
        '891851922615701565', // Start
        '893516899550367804', // Mushroom
        '893516899315494912', // Shell
        '893516899378421771', // Flower
        '893516899428728862', // Leaf
        '893516899365826641', // Bell
        '893516899416154122', // Feather
        '893516899307122708', // Egg
        '893516899541975050', // Starbit
        '893516899315482674', // Moon
        '893516899449704518', // Shine
        '893516899323875338', // Special
        '893516899495866440', // Prestige
    ];

  

/* eslint-disable no-param-reassign */
module.exports = (client) => {
	
	client.fetchOwner = async () => {
    // Fetch the user object of the owner and return it
    const owner = client.users.cache.get(client.config.ownerID);
    return owner;
  };
  
  //Server wonderflower based functions
  client.wonderEffect = (effect_num, message) => {
		return 0;  
  }
  
	//Profile-based functions
	client.createProfEmbed = (person) => {
		const userFromDB = client.userDB.ensure(person.id, { points: 0, rank: person.roles.cache.has('391877990277185556') ? 1 : 0, prestige: 0});
   	 let runningEmote = client.emojis.cache.get('710519845124309394');
   	 const prestige = client.emojis.cache.get('894461229383450624');
    	let color = "#000000";
    	let role = "";
    	
    	const characters = client.characterRoleEmotes;

    // Gets emote of character if user has an applicable team role; uses Mario otherwise
    if (person.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)))) {
        role = person.roles.cache.find((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)));

	if (person.roles.cache.some((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))))
	    role = person.roles.cache.find((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)));

        runningEmote = client.emojis.cache.get(characters.get(role.name.substr(role.name.indexOf(' ')+1)).emote);
        color = role.color.toString(16);
    }
    else {
        runningEmote = client.emojis.cache.get('891878777376878637');
	
    }

    const owner = client.users.cache.get(client.config.ownerID);

    const profileEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${client.developName(person)}'s Profile`) //'
        .setThumbnail(person.user.displayAvatarURL());
        
	profileEmbed.addField(`SERVER STATUS`, `${role !== '' ? `${runningEmote} Joined Team ${role.name.substring(5)}!\n` : ''}${client.emojis.cache.get(levelUpEmojis[userFromDB.rank])} Advanced to Rank ${userFromDB.rank}!\n${userFromDB.prestige >= 1 ? `${prestige} Prestiged ${userFromDB.prestige} time${userFromDB.prestige > 1 ? 's' : ''}!\n` : ''}`);
	profileEmbed.addField(`COLLECTABLES`, `${client.emojis.cache.get(client.emoji.bluecoins)} ${userFromDB.blue_coins} Blue Coins collected!\n ${client.emojis.cache.get(client.emoji.starbits)} ${userFromDB.starbits} Starbits earned!\n${client.emojis.cache.get(client.emoji.itembox_ok)} ${client.items.ensure(person.id, []).length} items obtained!`)
	profileEmbed.addField(`OTHER INFO`, `🕐 Joined the server <t:${Math.floor(person.joinedTimestamp / 1000)}:R>!\n ${person.roles.cache.has('585533364489158666') ? `${client.emojis.cache.get(client.emoji.boost_star)} Valued server Boost Star!` : ''}`);


	return profileEmbed;
}

client.createProgEmbed = (person) => {
	 const dot = client.emojis.cache.get('891851922196287529');
    const prestige = client.emojis.cache.get('894461229383450624');

    const levelPoints = [ 0, 10, 150, 500, 1000, 2500, 5000, 7000, 9999, 13000, 17000, 22000, 27000 ];
    const motivationalQuotes = ["Everyone starts somewhere.", "You're making progress already!", "Keep on keeping on.", "That's roughly a third!", "You're doing a great job!", "*Living on a prayer!*", "It's all downhill from here.", "The end is nearly in sight!", "Don't give up now!!!", "You could rank up any time now! Exciting!"]
	
	 const characters = client.characterRoleEmotes;
    const userFromDB = client.userDB.ensure(person.id, { points: 0, rank: person.roles.cache.has('391877990277185556') ? 1 : 0, prestige: 0});
    let runningEmote = client.emojis.cache.get('710519845124309394');
    let color = "#000000";

    if (person.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)))) {
        let role = person.roles.cache.find((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)));

	if (person.roles.cache.some((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))))
	    role = person.roles.cache.find((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)));

	//console.log(role.name + " goated");
        runningEmote = client.emojis.cache.get(characters.get(role.name.substr(role.name.indexOf(' ')+1)).emote);
        color = role.color.toString(16);
    }
    else {
        runningEmote = client.emojis.cache.get('891878777376878637');
	//runningEmote = client.emojis.cache.get('887166752872624138');
	console.log(" woated");
    }

    // Determines how far to their next levelup the user has gotten, from 0-9, rounded down
    let roughProgress = Math.floor(((userFromDB.points - levelPoints[userFromDB.rank]) / (levelPoints[userFromDB.rank + 1] - levelPoints[userFromDB.rank])) * 10);
    console.log(roughProgress);

    // Creates "path" of walking emote, start and end destinations, and the rough position they are at
    let progressPath = `${client.emojis.cache.get(levelUpEmojis8Bit[userFromDB.rank])}`;
    if (roughProgress === 0)
	progressPath = `${runningEmote}`;
    for (let i = 1; i <= 9; i++) {
        if (i === roughProgress)
            progressPath += `${runningEmote}`;
        else
            progressPath += `${dot}`;
    }
    progressPath += `${client.emojis.cache.get(levelUpEmojis8Bit[userFromDB.rank + 1])}`;
    progressPath += '⠀';

    const owner = client.users.cache.get(client.config.ownerID);

    const rankEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${client.developName(person)}'s Level Journey!`) //'
        .setThumbnail(person.user.displayAvatarURL({ dynamic: true }))
        .addField(`On the way to level ${userFromDB.rank + 1} | ${prestige} **x ${userFromDB.prestige}**`,`${progressPath}`);
        
    if(roughProgress === 5)
        rankEmbed.addField(`You're halfway there!`, motivationalQuotes[roughProgress]); //'
    else
        rankEmbed.addField(`You're ${roughProgress * 10}% of the way there!`, motivationalQuotes[roughProgress]); //'

        return rankEmbed;
};

	client.createItemsEmbed = (person, page) => {
		let color = "#000000";
		const check = client.emoji.checkMark;
		const ex = client.emoji.redX;

		const owner = client.users.cache.get(client.config.ownerID);
		
		const items = require('../commands/economy/items.json');
		const page_size = 12;
		const userCollection = client.items.ensure(person.id, []);
		
		let cont = "";
		
		for (let i = (page - 1) * page_size; i < ((page - 1) * page_size) + page_size; i++) {
			cont += `${userCollection.includes(`${items[i].name} - ID: ${items[i].id}`) ? check : ex} \`${items[i].id.toString().padStart(3 , '0')}\` : ${items[i].name} \n`;
		}
		
		const itemsEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${client.developName(person)}'s Items — Page ${page} / ${items.length / page_size}`) //'
        .setThumbnail(person.user.displayAvatarURL());
        
   	itemsEmbed.addField(userCollection.length >= 120 ? "You've collected all the items! Impressive!" : `There's still ${120 - userCollection.length} items for you to get!`, cont != '' ? cont: 'fuck');
   //'
   	return itemsEmbed;
	};
	
	client.createEmotesEmbed = (person, page) => {
		let color = "#000000";

		const owner = client.users.cache.get(client.config.ownerID);
		const u_emotes = client.userEmotes.ensure(person.id, []).sort((a,b) => b.copies - a.copies).splice((page - 1) * 12, page * 12);
		
		const emotesEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${client.developName(person)}'s Emotes — Page ${page} / ${Math.ceil(client.userEmotes.ensure(person.id, []).length / 12)}`) //'
        .setThumbnail(person.user.displayAvatarURL());
      
      let line1 = "";
      let line2 = "";
      for (let i = 0; i < u_emotes.length; i++) {
      	let emote = client.emotes.get(u_emotes[i].id);
      	if (i % 2 == 0)
      		line1 += `• **${emote.alt_name != [] ? emote.alt_name[0] : emote.name}**  ${client.emojis.cache.get(emote.id)} [Lv. ${u_emotes[i].copies}]\n`
      	else 
      		line2 += `• **${emote.alt_name != [] ? emote.alt_name[0] : emote.name}**  ${client.emojis.cache.get(emote.id)} [Lv. ${u_emotes[i].copies}]\n`
   	}
   	
   	if (u_emotes.length == 0) {
   		emotesEmbed.addField('\u200b', "You haven't collected any emotes yet. Use the `.pull` command and start collecting!");
   	}
   	else {
   		emotesEmbed.addField('\u200b', line1 + " ", true);
   		if (line2 != "")
   			emotesEmbed.addField('\u200b', line2 + " ", true);
   	}
   
   	return emotesEmbed;
	};
	
	//Returns the name of the supplied person with their title and attached emote, if they exist
  client.developName = (person) => {
  		try {
  		let title = client.userDB.has(person.id, "att_title") ? `${client.userDB.get(person.id).att_title} ` : '';
  		let emote = client.userDB.has(person.id, "att_emote") ? ` ${client.emojis.cache.get(client.userDB.get(person.id).att_emote)}` : '';
  		
  		return `${title}${person.displayName}${emote}`; }
  		catch(e) { return ('User left the server.'); }
  }

  client.getSettings = (guild) => {
    // Ensure the default settings exist
    client.settings.ensure('default', client.config.defaultSettings);

    // If no guild is provided, get the default settings
    if (!guild) {
      return client.settings.get('default');
    }

    // Get the settings for the provided guild
    // If a guild is not provided, an empty object is used
    const guildConf = client.settings.get(guild.id) || {};
    // Return the default settings joined by the guild settings
    return ({ ...client.settings.get('default'), ...guildConf });
  };
  
  client.stripEmote = (emote) => {
  		return emote.split(':')[2].slice(0,-1);
  }

  client.permLevel = (message) => {
    // Set the initial perm name and perm level to User and 0 respectively
    let permName = 'User';
    let permlvl = 0;
    // Find the order of the permLevels
    const permOrder = client.config.permLevels.slice(0)
      .sort((p, c) => (p.level < c.level ? 1 : -1));

    // While permOrder exists
    while (permOrder.length) {
      // Remove the first element from the permOrder array and return it
      const currentlvl = permOrder.shift();

      // If the user passes the check for that level, set the permName and permLevel to the level passed
      if (currentlvl.check(client, message)) {
        permName = currentlvl.name;
        permlvl = currentlvl.level;
        break;
      }
    }
    // Return an array of the perm name and perm level
    return [permName, permlvl];
  };

  client.clean = async (clientParam, text) => {
    // If the text provided is of type Promise, await it
    // This negates the 'Pending<Promise>' text returned when a promise is provided
    if (text && text.constructor.name === 'Promise') {
      text = await text;
    }
    // If the text is not a string, convert it to one
    if (typeof text !== 'string') {
      // eslint-disable-next-line global-require
      text = require('util').inspect(text, { depth: 1 });
    }

    // Replace elements in the text string that could interfere with Discord markdown, @ing unnecessarily, or protecting the token
    text = text
      .replace(/`/g, `\`${String.fromCharCode(8203)}`)
      .replace(/@/g, `@${String.fromCharCode(8203)}`)
      .replace(clientParam.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0');

    // Return the text
    return text;
  };

  

  //Sends out the Question of the Day from THE LIST
  client.sendOutQuestion = async () => {
	const role = client.guilds.cache.get('355119082808541184').roles.cache.find((r) => r.name === 'Question of the Day');
	
	const ms_in_day = (3600 * 1000 * 24)
	const today = Math.floor(Date.now() / ms_in_day);
	let q;
	let q_id = '';
	
	if (client.datedQuestions.has(today)) {
		q = client.datedQuestions.get(today);
	}
	else if (client.questions.count > 0) {
		q_id = client.questions.keyArray()[0];
		q = client.questions.get(q_id);
		client.questions.delete(q_id)
		client.datedQuestions.set(today.toString(), q)
	}
	else {
		client.question_sent = 2;
		return client.guilds.cache.get('355119082808541184').channels.cache.get('357328011889999873').send(" @Moderator There is no question for today. Add one using the .editquestions command, then use the command `.eval client.sendOutQuestion();`.");
	}

	console.log(q);
	const channel = client.guilds.cache.get('355119082808541184').channels.cache.get(q.channel);
	channel.send(`Hey <@&${role.id}>!\n${q.question}`);
	client.question_sent = 1;
  }; //'

  //Ends all current timeout/interval functions
  client.clearAllTimers = async () => {
	  for (var i = setTimeout(function() {}, 0); i > 0; i--) {
	  	clearInterval(i);
	   	clearTimeout(i);
	  }
  };
  
  // Returns whether the member has either the mario or wario team role (or neither)
  client.marioOrWario = (message) => {
  		let mario_role_id = client.onePieceVars.get('marioRoleID');
  		let wario_role_id = client.onePieceVars.get('warioRoleID');
  		let mario_channel_id = client.onePieceVars.get('marioChannelID');
  		let wario_channel_id = client.onePieceVars.get('warioChannelID');
  		if(message.member.roles.cache.has(mario_role_id))
  			return {team: 'mario', role_id: mario_role_id, channel_id: mario_channel_id, other_channel_id: wario_channel_id};
  		else if(message.member.roles.cache.has(wario_role_id))
  			return {team: 'mario', role_id: wario_role_id, channel_id: wario_channel_id, other_channel_id: mario_channel_id};
  		else 
  			return {team: 'none'};
  };



  // Extend the String prototype to provide String.toProperCase() to make formatting easier
  // Basically sets stuff like 'donkey kong' to 'Donkey Kong'
  Object.defineProperty(String.prototype, 'toProperCase', { // eslint-disable-line no-extend-native
    value() {
      return this.replace(/([^\W_]+[^\s-]*) */g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    },
  });
};

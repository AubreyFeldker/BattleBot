const { e } = require("../../src/emoji");

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level, Discord) => {

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
    const dot = client.emojis.cache.get('891851922196287529');
    const prestige = client.emojis.cache.get('894461229383450624');

    const levelPoints = [ 0, 10, 150, 500, 1000, 2500, 5000, 7000, 9999, 13000, 17000, 22000, 27000 ];
    const motivationalQuotes = ["Everyone starts somewhere.", "You're making progress already!", "Keep on keeping on.", "That's roughly a third!", "You're doing a great job!", "*Living on a prayer!*", "It's all downhill from here.", "The end is nearly in sight!", "Don't give up now!!!", "You could rank up any time now! Exciting!"]

	 const characters = client.characterRoleEmotes;
    const userFromDB = client.userDB.ensure(message.author.id, { points: 0, rank: message.member.roles.cache.has('391877990277185556') ? 1 : 0, prestige: 0});
    let runningEmote = client.emojis.cache.get('710519845124309394');
    let color = "#000000";

    // Gets emote of character if user has an applicable team role; uses Mario otherwise
    if (message.member.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)))) {
        let role = message.member.roles.cache.find((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)));

	if (message.member.roles.cache.some((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))))
	    role = message.member.roles.cache.find((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)));

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

    const owner = await client.fetchOwner();

    const rankEmbed = new Discord.MessageEmbed()
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${message.member.displayName}'s Level Journey!`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField(`On the way to level ${userFromDB.rank + 1} | ${prestige} **x ${userFromDB.prestige}**`,`${progressPath}`);
        
    if(roughProgress === 5)
        rankEmbed.addField(`You're halfway there!`, motivationalQuotes[roughProgress]);
    else
        rankEmbed.addField(`You're ${roughProgress * 10}% of the way there!`, motivationalQuotes[roughProgress]);

        return message.channel.send({ embeds: [rankEmbed] });


};

module.exports.conf = {
guildOnly: true,
aliases: ['progress', 'rank'],
permLevel: 'User',
args: 0,
};

module.exports.help = {
name: 'myprogress',
category: 'misc',
minidesc: 'See your journey to the next level',
description: 'Checks your progress to the next rank-up',
usage: 'myprogress',
};
  
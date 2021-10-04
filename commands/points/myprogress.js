const { e } = require("../../src/emoji");

// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
    let charEmotes = new Map([
        ['Mario', '891878777376878637'],
        ['Luigi', '891878779931226152'],
        ['Peach', '891878777448185956'],
        ['Daisy', '891878777389449267'],
        ['Toad', '891878777553059882'],
        ['Yoshi', '891878777544646707'],
        ['Bowser', '891878777280405564'],
        ['DK', '891878777318178836'],
        ['Wario', '891878777381093386'],
        ['Waluigi', '891878777016172565'],
        ['Goomba', '891878777313980436'],
        ['Koopa', '891878777284612156'],
        ['Bowser Jr.', '891878777255231519'],
        ['Diddy', '891878777066508411'],
        ['Dixie', '891878777146200075'],
        ['Cranky', '891878777255235614'],
        ['Toadette', '891878777632747601'],
        ['Toadsworth', '891878777070698537'],
        ['Petey', '891878779893448744'],
        ['Bobomb', '891878777238487040'],
        ['Boo', '891878777255239750'],
        ['E. Gadd', '891878777259454524'],
        ['Kamek', '891878776957468683'],
        ['Luma', '891878777276207125'],
        ['Funky', '891878777305583616'],
        ['Rosalina', '891878777410441216'],
        ['King Boo', '891878777355923496'],
        ['K. Rool', '891878777494323200'],
        ['Metal Mario', '891878777469157377'],
        ['Pink Gold Peach', '891878777305595904'],
        ['Vampire Wario', '891878777473343488'],
        ['Dry Bowser', '891878777292996619'],
        ['Pyoro', '891878777389461504'],
        ['Pianta', '891878777087467581'],
        ['BROS', '891878776957456445'],
        ['Marty', '891883508254007317'],
        ['Bayonetta', '891888190284247060'],
    ]);

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

    const excessiveCharacterArray = ['Mario', 'Luigi', 'Peach', 'Daisy', 'Toad', 'Yoshi', 'Bowser', 'DK', 'Wario', 'Waluigi', 'Goomba', 'Koopa', 'Bowser Jr.', 'Diddy', 'Dixie', 'Cranky', 'Toadette', 'Toadsworth', 'Petey', 'Bobomb', 'Boo', 'E. Gadd', 'Kamek', 'Luma', 'Funky', 'Rosalina', 'King Boo', 'King K. Rool', 'Metal Mario', 'Pink Gold Peach', 'Dry Bowser', 'Vampire Wario', 'Pyoro', 'Pianta', 'BROS', 'Bayonetta', 'Marty'];
    const levelPoints = [ 0, 10, 150, 500, 1000, 5000, 7000, 9999, 13000, 17000, 22000, 27000 ];
    const motivationalQuotes = ["Everyone starts somewhere.", "You're making progress already!", "Keep on keeping on.", "That's roughly a third!", "You're doing a great job!", "*Living on a prayer!*", "It's all downhill from here.", "The end is nearly in sight!", "Don't give up now!!!", "You could rank up any time now! Exciting!"]

    const userFromDB = client.userDB.ensure(message.author.id, { points: 0, rank: message.member.roles.cache.has('391877990277185556') ? 1 : 0, prestige: 0});

    // Gets emote of character if user has an applicable team role; uses Mario otherwise
    if (message.member.roles.cache.some((r) => r.name.includes('Team') && excessiveCharacterArray.includes(r.name.substr(r.name.indexOf(' ')+1)))) {
        let runningEmote = client.emojis.cache.get(charEmotes.get(r.name.substr(r.name.indexOf(' ')+1)));
        let color = message.member.roles.cache.find((r) => r.name.includes('Team') && excessiveCharacterArray.includes(r.name.substr(r.name.indexOf(' ')+1))).color().toString(16);
    }
    else {
        let runningEmote = client.emojis.cache.get('891878777376878637');
        let color "#000000";
    }

    // Determines how far to their next levelup the user has gotten, from 0-9, rounded down
    let roughProgress = Math.floor(((levelPoints[userFromDB.rank + 1] - levelPoints[userFromDB.rank]) / levelPoints[userFromDB.rank + 1]) * 10);

    // Creates "path" of walking emote, start and end destinations, and the rough position they are at
    let progressPath = `${client.emojis.cache.get(levelUpEmojis8Bit[userFromDB.rank])}`;
    for (let i = 0; i <= 9; i++) {
        if (i === roughProgress)
            progressPath += `${runningEmote}`;
        else
            progressPath += `${dot}`;
    }
    progressPath += `${client.emojis.cache.get(levelUpEmojis8Bit[userFromDB.rank + 1])}`;

    const rankEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.tag)
        .setColor(color)
        .setFooter(`Created and Maintained by ${owner.tag} | ${client.version}`, client.user.displayAvatarURL())
        .setTimestamp()
        .setTitle(`${message.author.name}'s Level Journey!`)
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField(`On the way to level ${userFromDB.rank + 1} | 1-UPS: ${userFromDB.prestige}`,`${progressPath}`);
        
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
category: 'points',
description: 'Checks your progress to the next rank-up',
usage: 'myprogress',
};
  
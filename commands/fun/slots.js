module.exports = {
    name: "slots",
    description: "Plays a quick game of slots",
    usage: " ",
    async run(client, message, args, Discord) {

    // Setting up results with randomness
    let slots = ["🍎", "🍌", "🍒", "🍓", "🍈"];
    let result1 = Math.floor((Math.random() * slots.length));
    let result2 = Math.floor((Math.random() * slots.length));
    let result3 = Math.floor((Math.random() * slots.length));

    function winLossThing(winLoss) {
        let embed = new Discord.RichEmbed()
        .setTimestamp()
        .setAuthor(message.member.user.tag, message.author.avatarURL)
        .setFooter(`Created and Maintained by Phoenix#0408 | ${client.version}`, client.user.displayAvatarURL)
        .setTitle("🎰 Slots 🎰")
        .setColor("#4199c2")
        .addField("Result:", slots[result1] + slots[result2] + slots[result3], true)
        .addField(`You ${(winLoss)}!`, "Play again real soon!");
        message.channel.send(embed);
    }

    if (slots[result1] === slots[result2] && slots[result3]) {
        // If you win
        winLossThing("Won");
    } else {
        // If you lose
        winLossThing("Lost");
    }

}};
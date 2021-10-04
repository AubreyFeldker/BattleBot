module.exports.run = async (client, message, args, level, Discord) => {
  // Ensure the factionSettings exists in the Enmap
  message.channel.send('Voting has started! You have 30 seconds to type in a space to hit using the format `[A-J][0-9]`.');

  const re = new RegExp('[A-Ja-j][0-9]');
  const filter = post => re.test(post.content.toUpperCase());

  const collector = message.channel.createMessageCollector({ filter, time: 30000 });

  collector.on('collect', post => {
	console.log(post.content);
	post.delete();
  });

  let values = new Array(100).fill(0);

  collector.on('end', posts => {
	posts.forEach((value) => {
	console.log(value.content);
        values[((value.content.toUpperCase().charCodeAt(0) - 65) * 10 + parseInt(value.content.substring(1,2).toUpperCase()))]++;
    })
  

    let biggestVals = [];
    let biggestNum = 0;

    for(let i = 0; i < values.length; i++) {
      if (values[i] > biggestNum) {
        biggestNum = values[i];
        biggestVals = [i];
      }
      else if (values[i] == biggestNum)
        biggestVals.push(i);
    }

    let chosenVal = biggestVals[Math.trunc(Math.random() * biggestVals.length)];

    message.channel.send(`Voting is over! The space most voted on was ${String.fromCharCode(Math.trunc(chosenVal / 10) + 65)}${chosenVal % 10} with ${biggestNum} votes.`);
  });
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod',
  args: 0,
};

module.exports.help = {
  name: 'coordinates',
  category: 'misc',
  description: '...',
  usage: 'coordinates',
};

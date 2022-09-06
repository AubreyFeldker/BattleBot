module.exports.run = async (client, message, args, level, Discord) => {
  // Ensure the factionSettings exists in the Enmap
  message.channel.send('Voting has started! You have 30 seconds to type in a space to hit using the format `[A-J][0-9]`.');

  //Filter for collector: all posts with format [a-j (case independent)][0-9]
  const re = new RegExp('[A-Ja-j][0-9]');
  const filter = post => re.test(post.content.toUpperCase());

  //Collector collects posts that fit filter for 30 seconds
  const collector = message.channel.createMessageCollector({ filter, time: 30000 });

  collector.on('collect', post => {
	console.log(post.content);
	post.delete(); //Deletes post after collection
  });

  let values = new Array(100).fill(0);

  collector.on('end', posts => {
	posts.forEach((value) => {
	console.log(value.content);
        // Each value of the array contains the values for a coordinate starting with A0
        // Increments the cooresponding section by one for each "vote" from the collector
        values[((value.content.toUpperCase().charCodeAt(0) - 65) * 10 + parseInt(value.content.substring(1,2).toUpperCase()))]++;
    })
  

    // Simple algorithm for finding all the largest values in an array
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

    // If more than 1 coordinate space has the same # of votes, randomly chooses one of them as the selected space
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
  minidesc: 'For Battlebeans',
  description: '...',
  usage: 'coordinates',
};

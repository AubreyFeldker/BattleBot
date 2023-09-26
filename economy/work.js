module.exports.run = async (client, message, args, level, Discord, eco) => {
  // Get the starbits emoji
  const starbits = client.emojis.cache.get(client.emoji.starbits);
  // Define characters and jobs arrays
  const characters = ['Mario', 'Luigi', 'Bowser', 'Peach', 'Yoshi', 'E. Gadd', 'the Koopalings', 'Toad', 'Toadette', 'Cappy', 'Rosalina', 'Boo', 'Goomba', 'Koopa Troopa', 'Koopa the Quick', 'Donkey Kong', 'Daisy', 'Wario', 'Waluigi', 'Shy Guy', 'Chargin Chuck', 'Pyoro', 'Beaoro', 'Bayonetta', 'King K. Rool', 'Funky Kong', 'The Chimp', 'The Champ', 'Cranky Kong', 'Rabbid Peach', 'Judge Pianta', 'Plessie', 'King Augustus Septemberus Octoberus Koopa', 'Jr. Troopa', 'Wart', 'King Boo', 'Ninji', 'Pauline', 'Tiara', 'the Broodals', 'Jack Black', 'Foreman Spike', 'Diddy Kong', 'Dixie Kong', 'Whomp', 'Pidgit', 'Gooper Blooper', 'Scuttlebug', 'Nabbit\'s Ghost', 'King Penguin', 'Crisp Rat', 'Miyamoto', 'Boshi', 'Cloud from Final Fantasy VII', 'Amazin\' Flying Hammer Bro', 'Moogle', 'ROB', 'Baby Wario', 'Baby DK', 'Baby Waluigi', 'Edge', 'Marty', 'BROS', 'Metal Mario', 'Pink Gold Peach', 'Dry Bowser', 'Vampire Wario', 'Uncle amiibo', 'Lubba', 'Topmaniac', 'Funky Kong', 'King K. Rool', 'Gooigi', 'The Coach', 'a mysterious voice', 'Bowser Jr.', 'King Bob-omb', 'Rawk Hawk', 'Vivian', 'Toadette', 'Pauline', 'Luma', 'Petey Piranha', 'Professor Toad', 'MC Ballyhoo', 'Slim Bankshot', 'Mega Mushroom', 'Count Bleck', 'Fawful', 'Cackletta', 'Starshroom', 'Poochybot', 'Elder Princess Shroob', 'Spawny', 'Purple Pikmin', 'Lakitu', 'Birdo', 'Whimp', 'Master Hand', 'Crazy Hand', 'Rudy the Clown'];
  const jobs = ['Personal Chef', 'Minion', 'Bodyguard', 'Lawyer', 'Assistant', 'Babysitter', 'Personal Maid', 'Mailman', 'Driver', 'Gardener', 'Lawn-Mower', 'Consultant', 'Copyright Lawyer', 'Player 2', 'Trash Collector', 'Hair Stylist', 'Pet Sitter', 'Hitman', 'Therapist', 'Tour Guide', 'Photographer', 'Jester', 'Partner in Crime', 'DJ', 'Dentist', 'Personal Trainer', 'Life Coach', '#1 Hater', 'Body Double', 'Stunt Double', 'Janitor', 'Plumber', 'Medic', 'IT Guy', 'Chemist', 'Pilot', 'Tailor', 'Video Editor', 'Secretary', 'Teacher', 'Electrician', 'Journalist', 'Scientist', 'Painter', 'Artist', 'Hunter', 'Surgeon', 'Priest', 'Blacksmith', 'Exorcist', 'Bard', 'Mage', 'Paladin', 'Cleric', 'Monk', 'Sorcerer', 'Mercenary', 'Underground Boxer', 'Security Guard', 'Translator', 'Commentator', 'Surgeon', 'Spotter', 'Biographer', 'Personal Pianist', 'Samurai', 'Scab', 'Sniper', 'Toy Manufacturer', 'Graphic Designer', 'Food Critic', 'Ghost Writer', 'Golf Caddy', 'Secretary of Absolute Defense', 'Trucker', 'Operations Manager', 'Shill', 'Bouncer', 'Second-in-Command', 'Spy', 'Vice President', 'Giant Foam Novelty Check Writer', 'Bounty Hunter', 'Generally Cool Person'];

  // Get a random character and job
  const rChar = Math.floor(Math.random() * characters.length);
  const rJob = Math.floor(Math.random() * jobs.length);

  // Create final string and get output from pre-built work function
  const final = `${characters[rChar]}'s ${jobs[rJob]}`; //'
  const output = await eco.ecoWork(message.author.id, {
    failurerate: 20, // Failure rate of 20%
    money: Math.floor(Math.random() * 4996) + 5, // Random money output between 5 and 5000
    jobs: [],
  });

  // If work failed, error on failed
  if (output.earned === 0) {
    return message.error(`You Failed as ${final}!`, `**${message.member.displayName}**, You failed as \`${final}\` and earned nothing!`);
  }

  // Display success message with appropriate strings and calculations
  return message.success(`You Successfully Worked as ${final}!`, `**${message.member.displayName}**, You worked as \`${final}\` and earned ${starbits} \`${output.earned} starbits\`! \nYou now own ${starbits} \`${output.newBalance} starbits\`!`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['w'],
  permLevel: 'User',
  cooldown: 3600,
};

module.exports.help = {
  name: 'work',
  category: 'economy',
  minidesc: 'Earn more starbits by working an hourly job',
  description: 'Earns you starbits by working various jobs, once per hour. Gives you 5-5000 starbits randomly. Has a failure rate of 20%',
  usage: 'work',
};

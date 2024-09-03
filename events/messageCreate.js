const Discord = require('discord.js');
const Events = Discord.Events;

// Collections for command cooldowns, point cooldowns, and level up delays
const cooldowns = new Discord.Collection();
const pointCooldowns = new Discord.Collection();
const memberLevelUpDelays = new Discord.Collection();

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
    const client = message.client;
    const member = message.member;

    const lvlRoles = client.lvlRoles;
    const levelUpPoints = client.levelUpPoints;

    // Ignore all bots
    try {
      if (member.user.bot) {
        return;
      }
    } catch (error) {
      console.log(message);
      return;
    }

    // If the message is in a guild but the member object is not cached, fetch the member object
    if (message.guild && !message.member) {
      await message.guild.members.fetch(message.author);
    }

    const userFromDB = await client.configureUser(member);
    const protectedChannels = client.settings.get('protectedChannels');

    if ((pointCooldowns.has(member.id) ? (Date.now() - pointCooldowns.get(member.id)) > 120000 : true) && !(protectedChannels.includes(message.channel.id) || protectedChannels.includes(message.channel.parentId))) {
      client.userDB.inc(member.id, 'points');
      pointCooldowns.set(member.id, Date.now());
    }

    // Pre-define leveledUp and newRank to be false and 0 respectively as a starting point
    let leveledUp = false;
    let newRank = userFromDB.rank + 1;

    const userRank = userFromDB.rank;
    // If they have enough points, rank up!
    if (userFromDB.points >= levelUpPoints[userRank]) {
      await member.roles.add(lvlRoles[userRank]);
      if (userRank != 0) { await message.member.roles.remove(lvlRoles[userRank - 1]); }

      client.userDB.inc(member.id, 'rank');
      leveledUp = true;
      newRank = userRank + 1;
      // If they have enough points, prestige up!!!
      if (userRank === 11) { 
	      client.userDB.set(member.id, { points: userFromDB.points - 27000, rank: 0, prestige: userFromDB.prestige + 1});
      }
    }
	}
};
const Discord = require('discord.js');
const Events = Discord.Events;

// Collections for command cooldowns, point cooldowns, and level up delays
const cooldowns = new Discord.Collection();
const pointCooldowns = new Discord.Collection();
const memberLevelUpDelays = new Discord.Collection();

// Array if emotes tied to each level-up
const levelUpEmojis = [
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

const lvlRoles = [
  '391877990277185556', // Shroom
  '751118834206769293', // Shell
  '751118889869377656', // Flower
  '751616251759165440', // Leaf
  '754394768473194607', // Bell
  '751616457430925342', // Feather
  '754395250042208336', // Egg
  '754395466598187148', // Starbit
  '751616582307807323', // Moon
  '751616793092817038', // Shine
  '754395863597711360', // Special
  '893381701659656202', // 1-Up
];
// Points at which each rankup is obtained at
const levelUpPoints = [ 10, 150, 500, 1000, 2500, 5000, 7000, 9999, 13000, 17000, 22000, 27000 ];

// Makeshift way to get everyone back to where they should roughly be
async function configureUser(member) {
  const client = member.client;
  //Check if user already exists in DB, if so just return
  let userFromDB = client.userDB.get(member.id);
  if (typeof client.userDB.get(member.id) != "undefined")
    return userFromDB;

  let mRoles = member.roles.cache;

  let rank, points = 0;
  const prestige = mRoles.find(r => r.id === lvlRoles[11]) ? 1 : 0;

  for(let i = 10; i>=0; i--) {
    if (mRoles.find(r => r.id === lvlRoles[i])) {
      rank = i+1;
      points = levelUpPoints[i] + Math.floor((levelUpPoints[i+1] - levelUpPoints[i]) /2);
      break;
    }
  }

  return client.userDB.ensure(member.id, { id: member.id, points: points, rank: rank , prestige: prestige, blue_coins: 0, starbits: 0, last_daily: 0, last_work: 0});
}

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
    const client = message.client;
    const member = message.member;
    const OUW = await client.oneUpWorld;

    // Ignore all bots
    if (member.bot) {
      return;
    }

    // If the message is in a guild but the member object is not cached, fetch the member object
    if (message.guild && !message.member) {
      await message.guild.members.fetch(message.author);
    }

    const userFromDB = await configureUser(member);
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
      await message.member.roles.add(userRoles[userRank]);
      if (userRank != 0) { await message.member.roles.remove(userRoles[userRank - 1]); }

      client.userDB.inc(message.author.id, 'rank');
      leveledUp = true;
      newRank = userRank + 1;
      // If they have enough points, prestige up!!!
      if (userRank === 11) { 
	      client.userDB.set(message.author.id, { points: userFromDB.points - 27000, rank: 0, prestige: userFromDB.prestige + 1});
      }
    }
	}
};
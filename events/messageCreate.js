const Discord = require('discord.js');
const Events = Discord.Events;

const { Servers, Channels } = require('../src/consts/channels');
const { User } = require('../src/consts/user');

// Get the UNIX timestamp day
const getDate = (timestamp) => { return Math.floor(timestamp / (86400000));};

module.exports = {
	name: Events.MessageCreate,
	async execute(message) {
        // Relegates the test client and main client to their own servers
        if (message.client.testClient != (message.guildId == Servers.TEST_SERVER || message.channel.id === Channels.TEST_BOT_TESTING)) {return;}
        // If interactions are disabled
        if (!message.client.interact) {return;}

        const client = message.client;
        const member = message.member;

        const lvlRoles = client.lvlRoles;
        const levelUpEmojis = client.levelUpEmojis;

        const messageTime = message.createdTimestamp;

        // Ignore all bots
        try {
            if (member.user.bot) {
                return;
            }
        } catch (error) {
            return;
        }

        // If the message is in a guild but the member object is not cached, fetch the member object
        if (message.guild && !message.member) {
        await message.guild.members.fetch(message.author);
        }

        const userData = new User(client, member.id)
        const protectedChannels = client.settings.get('protectedChannels');

        const oldRank = userData.rank();

        // If its been at least [point cooldown] since the user's last point gain and
        // the post is not in a channel where points are not gained, increment their points by 1
        if (messageTime - userData.lastPoint > client.pointCooldown &&
            protectedChannels &&
            !(protectedChannels.includes(message.channel.id) || protectedChannels.includes(message.channel.parentId))
        ) {
            // Give a lot of XP if this is their first post today and they are not a brand new user
            const msgXP = (!userData.newUser && getDate(messageTime) > getDate(userData.lastPoint)) ? client.dailyBonus : 1;
            userData.addXP(msgXP);
        }

        // Check if the user has ranked up or prestiged
        const newRank = userData.rank();

        if(oldRank !== newRank) {
            member.roles.add(lvlRoles[newRank]);
            // Don't ever remove the 1-Up lvl rank
            if (oldRank !== 0) { member.roles.remove(lvlRoles[oldRank]); }

            // Append emotes to commemerate user's levelup
            // if new rank = 0 at lvl up, they prestiged
            const upReact = (newRank === 0) ? client.emoji.prestige : client.emoji.levelUp;
            await message.react(client.emojis.cache.get(upReact));
            await message.react(client.emojis.cache.get(levelUpEmojis[newRank]));
        }
    }
};

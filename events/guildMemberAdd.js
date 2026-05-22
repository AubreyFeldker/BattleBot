const { Events } = require('discord.js');
const { Channels } = require('../src/consts/channels');

const minAccountAge = 1000*60*90;

// Bans newly joined users who's account saw created less than minimum account age
module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        if (Date.now() - member.user.createdTimestamp < minAccountAge) {
            message.member.ban( { deleteMessageSeconds: 60*60, reason: 'Below minimum account age'})
                .then(console.log)
                .catch(console.error);
            // Send a ban message to the moderation log
            message.guild.channels.fetch(Channels.LOGS)
                .then(channel => channel.send(`Banned <@${message.member.id}>, account age less than 90 minutes old.`));
        }
    },
};
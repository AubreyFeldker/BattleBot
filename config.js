/* eslint-disable max-len */
const config = {
  token: 'NTA5MTY1NzAxMzcwNDc4NjEy.DsqDPg.tqbMmnC4W4MMKz0nnaONBOM5ePc',

  // Settings
  defaultSettings: {
    prefix: '.',
    verifiedRole: 'Verified',
    modRole: 'Moderator',
  },

  factionSettings: {
    faction1: 'Mario',
    faction2: 'Luigi',
    faction1Role: 'faction1Role',
    faction2Role: 'faction2Role',
    faction1Emoji: 'faction1Emoji',
    faction2Emoji: 'faction2Emoji',
  },

  // Bot Perms and Stuff
  ownerID: '392398406552780800',

  admins: [],

  support: [],

  // Guild Perms and Stuff
  permLevels: [
    {
      level: 0,
      name: 'User',
      check: () => true,
    },
    {
      level: 1,
      name: 'Verified',
      check: (client, message) => {
        const verifiedRole = message.guild.roles.find((r) => r.name.toLowerCase() === client.getSettings(message.guild).verifiedRole.toLowerCase());

        if (verifiedRole && message.member.roles.has(verifiedRole.id)) {
          return true;
        }
        return false;
      },
    },
    {
      level: 2,
      name: 'Mod',
      check: (client, message) => {
        const modRole = message.guild.roles.find((r) => r.name.toLowerCase() === client.getSettings(message.guild).modRole.toLowerCase());

        if (modRole && message.member.roles.has(modRole.id)) {
          return true;
        }
        return false;
      },
    },
    {
      level: 3,
      name: 'Admin',
      check: (client, message) => {
        const adminRole = message.guild.roles.find((r) => r.name.toLowerCase() === client.getSettings(message.guild).adminRole.toLowerCase());

        if ((adminRole && message.member.roles.has(adminRole.id)) || message.member.hasPermission('ADMINISTRATOR')) {
          return true;
        }
        return false;
      },
    },
    {
      level: 4,
      name: 'Server Owner',
      // eslint-disable-next-line consistent-return
      check: (client, message) => {
        if (message.channel.type === 'text') {
          if (message.author.id === message.guild.ownerID) {
            return true;
          }
          return false;
        }
      },
    },
    {
      level: 8,
      name: 'Bot Support',
      check: (client, message) => config.support.includes(message.author.id),
    },
    {
      level: 9,
      name: 'Bot Admin',
      check: (client, message) => config.admins.includes(message.author.id),
    },
    {
      level: 10,
      name: 'Bot Owner',
      check: (client, message) => client.config.ownerID === message.author.id,
    },
  ],
};

module.exports = config;

// eslint-disable-next-line consistent-return
module.exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
    // Join the provided arguments and define the game variable to set it later
    const input = args.join(' ');
    let game;
  
    // Some fancy regex action
    // Basically find whether the user said he, him, she, her, they, or them and set the pronoun variable
    // If all user provided something different, error on invalid pronoun
    if (/(SUPER MARIO)? 3D WORLD|3DW/i.test(input.toUpperCase())) {
        game = '3D World';
    } else if (/(S)?MM2|(SUPER)? MARIO MAKER (2)?/i.test((input.toUpperCase()))) {
        game = 'Mario Maker 2';
    } else if (/MARIO PARTY|(S)?MP(SS)?/i.test((input.toUpperCase()))) {
        game = 'Mario Party';
    } else if (/(SUPER)? SMASH (BROS(\.)?)? (ULTIMATE)?|SSB(U)?/i.test((input.toUpperCase()))) {
        game = 'Smash Bros.';
    } else {
      return message.error('Invalid Game!', 'Please input a game with a LFG role! These games are \`Mario Kart\`, \`Super Smash Bros.\`, \`Super Mario 3D World\`, and \`Mario Party\`!');
    }
  
    // Find the role corresponding to the inputted game
    const role = message.guild.roles.cache.find((r) => r.name === game + " LFG");
  
    // If member has the LFG role, remove it, display a success message and delete the initial message
    // If an error is caught, error to the console
    if (message.member.roles.cache.has(role.id)) {
      message.member.roles.remove(role)
        .then(() => {
          message.success('Success!', `I've successfully removed the \`${role.name}\` role from you!`);
          message.delete().catch(console.error);
        }).catch(console.error);
    } else {
      // If member does not have the LFG role, add it, display a success message and the initial message
      // If an error is caught, error to the console
      message.member.roles.add(role)
        .then(() => {
          message.success('Success!', `I've successfully added the \`${role.name}\` role to you!`);
          message.delete().catch(console.error);
        }).catch(console.error);
    }
  };
  
  module.exports.conf = {
    guildOnly: true,
    aliases: ['lookingforgame', 'game'],
    permLevel: 'User',
    args: 1,
  };
  
  module.exports.help = {
    name: 'goesby',
    category: 'roles',
    description: 'Gives the user the specified pronoun role',
    usage: 'goesby <he|she|they>',
    details: 'goesby <he|she|they> => The pronoun role to add',
  };
// eslint-disable-next-line consistent-return
module.exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  // Obtains the happening space role from ID
  const role = message.guild.roles.cache.find((r) => r.name === 'Happening Space');

  // If member has the pronoun, remove it, display a success message and delete the initial message
  // If an error is caught, error to the console
  if (message.member.roles.cache.has(role.id)) {
    message.member.roles.remove(role)
      .then(() => {
        message.success('Success!', `I've successfully removed the \`${role.name}\` role from you!`);
        message.delete().catch(console.error);
      }).catch(console.error);
  } else {
    // If member does not have the pronoun, add it, display a success message and the initial message
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
  aliases: ['happening', 'tunedin'],
  permLevel: 'User',
  args: 0,
};

module.exports.help = {
  name: 'informed',
  category: 'roles',
  description: 'Gives the user the **Happening Space** role',
  usage: 'informed',
  details: 'Gives the user the Happening Space role: giving them notifications on more server events',
};
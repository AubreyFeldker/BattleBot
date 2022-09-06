// eslint-disable-next-line consistent-return
module.exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars

  // Obtains the happening space role from ID
  const role = message.guild.roles.cache.find((r) => r.name === 'Happening Space');

  // If member has the happening space role, remove it, display a success message and delete the initial message
  // If an error is caught, error to the console
  if (message.member.roles.cache.has(role.id)) {
    if (message.member.roles.cache.some((r) => (/\([1-5]\)/i.test(r.name)))) {
        await message.member.roles.remove(message.member.roles.cache.find((r) => (/\([1-5]\)/i.test(r.name))));
      }
    message.member.roles.remove(role)
      .then(() => {
        message.success('Success!', `I've successfully removed the \`${role.name}\` role from you!`);
        message.delete().catch(console.error);
      }).catch(console.error);
  } else {
    // First, selection of the (num) role based on how many people have obtained it
    let remainder = role.members.size % 5 + 1;
    const sub_role = message.guild.roles.cache.find((r) => r.name === `(${remainder})`);

    // If member does not have the happening space role, add it, display a success message and the initial message
    // If an error is caught, error to the console
    message.member.roles.add(sub_role)
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
  minidesc: 'Gives the Happening Space role',
  description: 'Gives the user the **Happening Space** role',
  usage: 'informed',
  details: 'Gives the user the Happening Space role: giving them notifications on more server events',
};
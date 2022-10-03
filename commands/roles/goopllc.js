// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  // Ensure the teamSettings object exists
  const teamSettings = client.teamSettings;
  //console.log(teamSettings);
  // Get the user from the userDB
  const user = client.userDB.get(message.author.id);
  // Pre-define validTeam to determine if the provided team exists and is unlocked
  let validTeam = false;

  
	const characters = client.characterRoleEmotes;
  const role = message.guild.roles.cache.get('972773318207893504'); //Team Gooigi role
    
    if (role.name != 'Team Gooigi')
    	role.setName('Team Gooigi');

    // If the member does not have this team role
    if (!message.member.roles.cache.has(role.id)) {
      // If the member has a different team role, find it and remove it
      if (message.member.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)))) {
        await message.member.roles.remove(message.member.roles.cache.find((r) => r.name.includes('Team')&& characters.has(r.name.substr(r.name.indexOf(' ')+1)) && ! client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))));
      }

      // Add the team role to the member, display a success message, and delete the message that initiated the command
      // If an error is caught, error to the console
      message.member.roles.add(role)
        .then(() => {
          message.channel.send('```THIS IS YOUR PERSONAL COPY OF THE [[REDACTED]] REVERSE-ENGINEERED GOOIGI FORM. HANDLE IT WITH CARE.```');
          message.delete().catch(console.error);
        })
        .catch(console.error);
    } else {
      message.channel.send('```MEMBERS MAY ONLY OBTAIN ONE PERSONAL COPY OF THE [[REDACTED]] REVERSE-ENGINEERED GOOIGI FORM.```');
      message.delete().catch(console.error);
    }
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'User',
  args: 0,
};

module.exports.help = {
  name: 'goopllc',
  show: false,
  category: 'roles',
  minidesc: '?',
  description: '??',
  usage: '???',
  details: '????',
};
// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  //First finding if character already exists in enmaps, then removes them to readd
  const emote_id = client.stripEmote(args[1]);
  const name = args.slice(2).join(' ');
  if (! (/^[0-9]*$/i.test(emote_id))) { return message.error("Emote not given", 'The third argument of the command must be a valid emote.'); }
  if (args[0] > 12 && args[0] != 999) { return message.error('Invalid level', 'The second argument of the command must be a number -1 to 11.'); }
  
  if(client.teamSettings.get('teams').includes(name))
		client.teamSettings.remove('teams', name);
		
  else if(client.teamSettings.get('unlockableTeams').find((c) => c.teams.includes(name))) {
  		let chars = client.teamSettings.observe('unlockableTeams');
  		chars.find((c) => c.teams.includes(name)).teams = chars.find((c) => c.teams.includes(name)).teams.slice(chars.teams.indexOf(name), 1);
  }
  else if(client.teamSettings.get('otherTeams').includes(name))
		client.teamSettings.remove('otherTeams', name);

  client.characterRoleEmotes.delete(name);
  
  //Add value to appropriate teamSettings array
  
  if(args[0] == 999) {return 0;} //Shorthand way to easily delete a team
  if(args[0] == 0)
  		client.teamSettings.push('teams', name);
  	else if(args[0] == 12)
  		client.teamSettings.push('otherTeams', name);
  	else {
		let t = client.teamSettings.observe('unlockableTeams');
		t.find((f) => f.rankNeeded == args[0]).teams.push(name);
  	}
  
  // Add to emotes array as well
  	
  	client.characterRoleEmotes.ensure(name, {name: name, emote: emote_id});
  	
  	return message.success(`Team ${name} ${args[1]} added!`, `They are unlockable at Rank ${args[0]}.`);
};

module.exports.conf = {
  guildOnly: true,
  aliases: [],
  permLevel: 'Mod',
  args: 1,
};

module.exports.help = {
  name: 'editteams',
  category: 'roles',
  minidesc: 'Change team info',
  description: 'Add or change characters that people can join with the `.team` command.',
  usage: 'editteams <rank> <emoji> <name>',
  details: '<rank> => 0 = no rank required, 1-11 = that rank, 12 = rank users cannot get themselves (i.e. Garfield & aerith), 999 = Delete the team from selection',
};
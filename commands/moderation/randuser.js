// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  // Setting member to first member memntioned
  
  
  let num2 = 0;

  if (message.mentions.channels.size > 0) {
	const channel = message.mentions.channels.first();
	  if (! channel.isThread()) {
		let num1 = Math.floor(Math.random() * channel.members.size);
		  channel.members.forEach(member => {
			if (num1 == num2) { message.channel.send({content: `<@${member.id}>`}); }
			num2++;
		  });
	  }
	  else {
		let num1 = Math.floor(Math.random() * channel.members.cache.size);
		channel.members.cache.forEach(member => {
			if (num1 == num2) { message.channel.send({content: `<@${member.id}>`}); }
			num2++;
		  });
	  }
  }
  else {
	const role = message.guild.roles.cache.find((r) => r.name === args.join(' '));
  	  let num1 = Math.floor(Math.random() * role.members.size);
	  role.members.forEach(member => {
		if (num1 == num2) { message.channel.send({content: `<@${member.id}>`}); }
		num2++;
	  });
  }



  
};

module.exports.conf = {
  guildOnly: true,
  aliases: ['randomuser', 'lottery'],
  permLevel: 'Mod',
  args: 1,
};

module.exports.help = {
  name: 'randuser',
  category: 'moderation',
  minidesc: 'Get a random user with access to a channel/thread',
  description: 'Bans the mentioned member. Can be used with or without a stated reason.',
  usage: 'randuser <channel-id>',
  details: '<@member> => Any valid member of the server that does not have a higher role and is not the owner.\n<reason> => The reason for the ban. Totally optional.',
};
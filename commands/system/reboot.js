// eslint-disable-next-line no-unused-vars
module.exports.run = async (client, message, args, level) => {
  // Send a message to the channel, logs the reboot, and exits the process
  // BOT MUST BE RUNNING UNDER PM2 FOR porcess.exit(0) TO RESTART THE PROCESS
	if (args[0] == "pull")  {
		const simpleGit = require('simple-git');
		simpleGit().pull();
	}
  
  await message.channel.send('Rebooting bot! Please allow at least 10 seconds for the bot to fully reboot!');
  console.log('Bot rebooting...');
  for (var i = setTimeout(function() {}, 0); i > 0; i--) {
	  	clearInterval(i);
	   	clearTimeout(i);
	  }
  process.exit(0);
};

module.exports.conf = {
  guildOnly: false,
  aliases: [],
  permLevel: 'Bot Admin',
};

module.exports.help = {
  name: 'reboot',
  category: 'system',
  minidesc: 'Reboots system',
  description: 'Reboots the bot',
  usage: 'reboot',
};

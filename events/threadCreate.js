const { Events } = require('discord.js');

module.exports = {
	name: Events.ThreadCreate,
	async execute(thread) {
		if (message.client.testClient)
			return;
		
		if (thread.joinable) {
			await thread.join();
			console.log(`Joined thread: ${thread.name}`);
		}
		else
			console.log(`Could not join thread: ${thread.name}`);
	},
};
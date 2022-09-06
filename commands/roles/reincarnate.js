module.exports.run = async (client, message, args, level) => {
	// Ensure the factionSettings object exists
	const factionSettings = client.factionSettings.ensure(message.guild.id, client.config.factionSettings);

	// Get the 'Bird' and 'Bean' roles from the server, as they will be referenced multiple times throughout
	const birdRole = message.guild.roles.cache.find(role => role.name === "Bird");
	const beanRole = message.guild.roles.cache.find(role => role.name === "Bean");


	// Randomly assigns either the bird or bean role unless one role has at least 5 more users, then it assigns the lesser role
	if (birdRole.members.size >= beanRole.members.size + 5) {
		var role = beanRole;
	}
	else if (beanRole.members.size >= birdRole.members.size + 5) {
		var role = birdRole;
	}
	else {
		if (Math.random() > .5) { var role = beanRole; }
		else { var role = birdRole; }
	}

	const character = role.name;
	const char = factionSettings.chars.indexOf(character);

	// If the author already has one of the roles, error on faction already chosen
	if (message.member.roles.cache.has(birdRole.id)) {
		message.error("You've Already Experienced Reincarnation!", `Reincarnation is a one-way street. You've already been reborn as a **Bird**!`);
		message.delete().catch(console.error);
	} else if (message.member.roles.cache.has(beanRole.id)) {
		message.error("You've Already Experienced Reincarnation!", `Reincarnation is a one-way street. You've already been reborn as a **Bean**!`);
		message.delete().catch(console.error);

	}  else {
		// Find the emoji of the character if one eixsts
		
		//const emoji = factionSettings.emoji[char] ? client.emojis.cache.find((e) => e.name === factionSettings.emoji[char]) : '';

		// Add the character role to the author, display a success message, and delete the initial message
		// If an error is caught, error to the console
		message.member.roles.add(role)
			.then(() => {
				message.success('Congratulations!', `${message.author} has started their new life as a **${character}**!`);
				message.delete().catch(console.error);
			})
			.catch(console.error);
	}
};

module.exports.conf = {
	guildOnly: true,
	aliases: [],
	permLevel: 'Verified',
	args: 0,
};

module.exports.help = {
	name: 'reincarnate',
	category: 'roles',
        minidesc: 'An arcane command from another time',
	description: 'Allows you to be reborn as either a bird or a bean',
	usage: 'reincarnate',
	details: '',
};
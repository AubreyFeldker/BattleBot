/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

// Require necessary dependencies
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

// Create the client instance, require config.json, emoji.js, and the version from package.json
const client = new Client({
  messageCacheMaxSize: 500,
  fetchAllMembers: true,
  disableMentions: 'everyone',
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessagePolls,
    ],
});
client.commands = new Collection();
const config = require('./config');
const { token, makerId } = require('./config.json');
const { version } = require('./package.json');
const emoji = require('./src/emoji');

// Bind the config object, the version, and the emoji object to the client so they can be used everywhere
client.config = config;
client.maker = makerId;
client.version = `v${version}`;
client.emoji = emoji;

const foldersPath = path.join(__dirname, 'slash-commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

//Level cache probably? no longer needed with slash cmds
// For each permLevel in config.js, set its value in the levelCache object
/*client.levelCache = {};
for (let i = 0; i < config.permLevels.length; i++) {
  const thislvl = config.permLevels[i];
  client.levelCache[thislvl.name] = thislvl.level;
}*/

/* Thanks muskrat for nuking twitter's API
// Twitter object for listening for tweets
client.twitter = new Twitter({
  consumer_key: client.config.twitterAPIKey,
  consumer_secret: client.config.twitterAPISecret,
  access_token_key: client.config.twitterAccessToken,
  access_token_secret: client.config.twitterAccessTokenSecret,
});


// Start up the twitter webhook listener
client.twitterHookAffiliate = new Discord.WebhookClient({ 
id: client.config.twitterHookAffiliateID,
token: client.config.twitterHookAffiliateToken
});
client.twitterHookOfficial = new Discord.WebhookClient({ 
id: client.config.twitterHookOfficialID,
token: client.config.twitterHookOfficialToken
});
client.monsterHunterTwitter = new Discord.WebhookClient({ 
id: client.config.monsterHunterOfficialID,
token: client.config.monsterHunterOfficialToken
});*/
//Object.assign(client, Enmap.multi({names: ['settings']}));

// Define multiple Enmaps and bind them to the client so they can be used everywhere (ie. client.settings, client.factionSettings, etc.)
const Enmap = (...args) => import('enmap').then(({default: Enmap}) => Enmap(...args)).then((n) => {
  Object.assign(client, Enmap.multi(['settings', 'factionSettings', 'blacklist', 'items', 'results', 'enabledCmds', 'teamSettings', 'characterRoleEmotes', 'userDB', 'userDBArchive', 'emotes', 'titles', 'userEmotes', 'userTitles', 'locations', 'userStats', 'consoleVars', 'questions', 'datedQuestions']));
});
client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Login to the Discord API using the token in config.js
client.login(token);

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction, client);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
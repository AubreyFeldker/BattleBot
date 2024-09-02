/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

// Require necessary dependencies
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');

// Create the client instance, require config.json, emoji.js, and the version from package.json
const client = new Client({
  messageCacheMaxSize: 500,
  fetchAllMembers: true,
  disableMentions: 'everyone',
  intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.GUILD_BANS,
      Discord.Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
      Discord.Intents.FLAGS.GUILD_WEBHOOKS,
      Discord.Intents.FLAGS.GUILD_PRESENCES,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
      Discord.Intents.FLAGS.DIRECT_MESSAGES,
      Discord.Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
});
const config = require('./config');
const { version } = require('./package.json');
const emoji = require('./src/emoji');

// Bind all functions in functions.js to the client
require('./src/functions')(client);
require('./src/console-handler')(client);

// Bind the config object, the version, and the emoji object to the client so they can be used everywhere
client.config = config;
client.version = `v${version}`;
client.emoji = emoji;

const foldersPath = path.join(__dirname, 'commands');
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


// Define multiple Enmaps and bind them to the client so they can be used everywhere (ie. client.settings, client.factionSettings, etc.)
Object.assign(client, Enmap.multi(['settings', 'factionSettings', 'blacklist', 'items', 'results', 'enabledCmds', 'teamSettings', 'characterRoleEmotes', 'userDB', 'userDBArchive', 'emotes', 'titles', 'userEmotes', 'userTitles', 'locations', 'userStats', 'consoleVars', 'questions', 'datedQuestions', 'onePieceVars'], { ensureProps: true }));

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Login to the Discord API using the token in config.js
client.login(token);

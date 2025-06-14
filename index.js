/* eslint-disable consistent-return */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

// Require necessary dependencies
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, Partials } = require('discord.js');
const Enmap = require('enmap');

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
    //Required for non-cached reaction events
  partials: [Partials.Message, Partials.Reaction],
});
client.commands = new Collection();
const config = require('./config');
const { token, makerId } = require('./config.json');
const { version } = require('./package.json');
const emoji = require('./src/consts/emoji');

// Bind the config object, the version, and the emoji object to the client so they can be used everywhere
client.config = config;
client.testClient = config.testClient;
client.maker = makerId;
client.version = `v${version}`;
client.emoji = emoji;
client.responseInTest = false;
client.interact = true;

client.pointCooldown = 120000;
client.dailyBonus = 30;
client.dailyStarbits = 5000;
client.dailyCoins = 5;

client.validChannels = ['355186664869724161'];

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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Define multiple Enmaps and bind them to the client so they can be used everywhere (ie. client.settings, client.factionSettings, etc.)
Object.assign(client, Enmap.multi(['settings', 'factionSettings', 'items', 'characterRoleEmotes',
    'enabledCmds', 'teamSettings', 'userStats', 'questions', 'datedQuestions', 'userInfo', 'userGameInfo', 'bannedWords']));

// Login to the Discord API using the token in config.js
client.login(token);
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
const emoji = require('./src/emoji');

// Bind the config object, the version, and the emoji object to the client so they can be used everywhere
client.config = config;
client.testClient = config.testClient;
client.maker = makerId;
client.version = `v${version}`;
client.emoji = emoji;
client.responseInTest = false;
client.interact = true;

require('./src/slash-functions')(client);

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
Object.assign(client, Enmap.multi(['settings', 'factionSettings', 'items',
    'enabledCmds', 'teamSettings', 'characterRoleEmotes', 'userDB', 'emotes',
    'titles', 'userEmotes', 'userTitles', 'locations', 'userStats', 'consoleVars',
    'questions', 'datedQuestions', 'luigiEmotes']));

// Array if emotes tied to each level-up
client.levelUpEmojis = [
  '893392833925505075', // 1-Up
  '751523400681259110', // Shroom
  '751523400782053567', // Shell
  '751523400421474516', // Flower
  '751523400803024927', // Leaf
  '754054543238627389', // Bell
  '751523400173879486', // Feather
  '754044526166933654', // Egg
  '754129851245658112', // Starbit
  '751523400538783775', // Moon
  '754060026146193419', // Shine
  '754044526460665856', // Special
];

client.levelUpEmojis8Bit = [
    '891851922615701565', // Start
    '893516899550367804', // Mushroom
    '893516899315494912', // Shell
    '893516899378421771', // Flower
    '893516899428728862', // Leaf
    '893516899365826641', // Bell
    '893516899416154122', // Feather
    '893516899307122708', // Egg
    '893516899541975050', // Starbit
    '893516899315482674', // Moon
    '893516899449704518', // Shine
    '893516899323875338', // Special
    '893516899495866440', // Prestige
];

client.lvlRoles = [
  '893381701659656202', // 1-Up
  '391877990277185556', // Shroom
  '751118834206769293', // Shell
  '751118889869377656', // Flower
  '751616251759165440', // Leaf
  '754394768473194607', // Bell
  '751616457430925342', // Feather
  '754395250042208336', // Egg
  '754395466598187148', // Starbit
  '751616582307807323', // Moon
  '751616793092817038', // Shine
  '754395863597711360', // Special
];

client.levelUpPoints = [ 0, 10, 150, 500, 1000, 2500, 5000, 7000, 9999, 13000, 17000, 22000, 27000 ];

// Login to the Discord API using the token in config.js
client.login(token);
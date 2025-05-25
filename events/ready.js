const { Events } = require('discord.js');
const { Servers } = require('../src/consts/channels');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
    client.oneUpWorld = client.guilds.fetch(Servers.ONE_UP_WORLD);
    if (client.testClient) {
      console.log(`Ready to follow orders as the test client ma'am, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
      return;
    }
    const activitiesList = [
      'with some code',
      `Mario Party Jamboree with ${client.users.cache.size} users`,
      "with the developer's console",
      "as the mods' puppet",
      `with my buddy HLTBot#8133`,
      "Super Mario Bros. Wonder: Expansion Pass",
      "on discord.gg/mario",
      'with my best friend Wario',
      "with the Chimp!",
      "'Death and Romance' on 'Imaginal Disc'",
      "wayyyy too many games at once",
      "deep in the depths of the Linux file system",
      "with my slash commands"
    ];

    setInterval(() => {
      const index = Math.floor(Math.random() * activitiesList.length);
      client.user.setActivity(activitiesList[index]);
    }, 30000);

    const now = new Date();
    let noon = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      12, 0, 0);

    if (noon.getTime() < now.getTime())
      noon.setDate(noon.getDate()+1);

        
    setTimeout(() => {
      client.sendOutQuestion();
      }, (noon.getTime() - now.getTime()));


    console.log(`Ready to follow orders ma'am, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
	},
};
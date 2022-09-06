module.exports = (client) => {
  // Defining an array of activities to shuffle through
  const activitiesList = [
    'with some code',
    `SMM2 with ${client.users.cache.size} users`,
    "with the developer's console",
    `with the ${client.config.defaultSettings.prefix}help command`,
    "as the mods' puppet",
    `with ${client.version}`,
    'SSBU with Phoenix#0408',
    'with my best friend Wario',
  ];

  // Set an interval that will run every 30 seconds and change the bot's activity to a random item for the activitiesLis array
    setInterval(() => {
    const index = Math.floor(Math.random() * activitiesList.length);
    client.user.setActivity(activitiesList[index]);
  }, 30000);

    var currStream = client.startTwitterFeed();

  // Every 12 hours, the bot will restart the twitter feed to ensure it doesn't break every time
    setTimeout(() => {
    client.clearAllTimers();
    process.exit(0);
  }, (3600000 * 12)); 

    const now = new Date();
    const noon = new Date(
	now.getFullYear(),
	now.getMonth(),
	now.getDate(),
	12, 0, 0);

    if (noon.getTime() > now.getTime()) {
	    setTimeout(() => {
		client.sendOutQuestion();
	    }, (noon.getTime() - now.getTime()));
    }
	console.log(`${noon.getTime() - now.getTime()}`);

  // Logging a ready message on first boot
  console.log(`Ready to follow orders ma'am, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
};

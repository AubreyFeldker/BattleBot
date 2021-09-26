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

  try {
    client.startTwitterFeed();
  } catch (err) {
    // The stream function returned an error
    console.error(err);
  }

  // Logging a ready message on first boot
  console.log(`Ready to follow orders sir, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
};

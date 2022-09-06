module.exports = (client) => {

	client.checkAchievements = (person) => {
  		client.userTitles.ensure(person.id, []);
  		
  		
  }
  
};
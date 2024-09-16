const Discord = require('discord.js');

module.exports = (client) => {

    // Makeshift way to get everyone back to where they should roughly be
    client.configureUser = async (member) => {
        const client = member.client;
        const lvlRoles = client.lvlRoles; const levelUpPoints = client.levelUpPoints;
        
        //Check if user already exists in DB, if so just return
        let userFromDB = client.userDB.get(member.id);
        if (typeof client.userDB.get(member.id) !== "undefined") {
          if (typeof userFromDB.rank === "undefined")
          return userFromDB;
        }
    
        let mRoles = member.roles.cache;
    
        let rank, points = 0;
        const prestige = mRoles.find(r => r.id === lvlRoles[11]) ? 1 : 0;
    
        for(let i = 10; i>=0; i--) {
        if (mRoles.find(r => r.id === lvlRoles[i])) {
            rank = i+1;
            points = levelUpPoints[i] + Math.floor((levelUpPoints[i+1] - levelUpPoints[i]) /2);
            break;
        }
        }
    
        client.userStats.ensure(member.id, { id: member.id, blue_coins: 0, starbits: 0});
        return client.userDB.ensure(member.id, { id: member.id, points: points, rank: rank ?? 0, prestige: prestige, blue_coins: 0, starbits: 0, last_daily: 0, last_work: 0});
    };

    //Sends out the Question of the Day from THE LIST
  client.sendOutQuestion = async () => {
    const oneUpWorld = client.guilds.cache.get('355119082808541184');
    const role = oneUpWorld.roles.cache.find((r) => r.name === 'Question of the Day');
    
    const ms_in_day = (3600 * 1000 * 24)
    const today = Math.floor(Date.now() / ms_in_day);
    let q, q_id;
    
    if (client.datedQuestions.has(today)) {
      q = client.datedQuestions.get(today);
    }
    else if (client.questions.count > 0) {
      q_id = client.questions.reduce((currMin, currVal, currKey) => (parseInt(currMin) < parseInt(currKey)) ? currMin : currKey, "99999"); //Gets the first added question
          q = client.questions.get(q_id);
      client.questions.delete(q_id);
      client.datedQuestions.set(today.toString(), q);
    }
    else {
      client.settings.set('questionSentToday', false);
      return await oneUpWorld.channels.cache.get('357328011889999873').send("<@&1103339257810124972> There is no question for today. Add one using the `/editquestions add` command. It will send out automatically.");
    }

    console.log(q);
    const channel = oneUpWorld.channels.cache.get(q.channel);
    const suggestion = (q.author) ? `\n-# Question suggested by <@${q.author}>. Members rank 3+ and boosters can suggest questions via the /submit command in <#355186664869724161>.` : "";
    channel.send(`Hey <@&${role.id}>!\n${q.question}${suggestion}`);
    client.settings.set('questionSentToday', true);

    //let's send a new question tomorrow!
    const now = new Date();
      let noon = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()+1,
        12, 0, 0);

      setTimeout(() => {
          client.sendOutQuestion();
      }, (noon.getTime() - now.getTime()));
  };
}
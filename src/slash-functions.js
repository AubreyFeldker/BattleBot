const Discord = require('discord.js');

module.exports = (client) => {
    // Makeshift way to get everyone back to where they should roughly be
    client.configureUser = async (member) => {
        const client = member.client;
        const lvlRoles = client.lvlRoles; const levelUpPoints = client.levelUpPoints;
        
        //Check if user already exists in DB, if so just return
        let userFromDB = client.userDB.get(member.id);
        if (typeof client.userDB.get(member.id) != "undefined")
        return userFromDB;
    
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
    
        return client.userDB.ensure(member.id, { id: member.id, points: points, rank: rank , prestige: prestige, blue_coins: 0, starbits: 0, last_daily: 0, last_work: 0});
    };
}
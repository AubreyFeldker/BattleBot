export class User {
    constructor(client, id) {
        const dbInfo = client.userDB.ensure(id,
            { id: id,
                points: 0,
                currency: { bluecoins: 0, starbits: 0},
                last_work: 0,
                last_daily: 0,
                last_questions: 0,
                lastPointAdd: 0,
                lastDailyBonus: 0,
                newUser: true
            }
        );

        this.id = id;

        this.lastWork = dbInfo.last_work;
        this.lastDaily = dbInfo.last_daily;
        this.lastQuestion = dbInfo.last_question;
        this.lastPoint = dbInfo.lastPointAdd;
        this.lastDailyBonus = dbInfo.lastDailyBonus;

        this.points = dbInfo.points;
        this.newUser = dbInfo.newUser;

        this.currency = {
            bluecoins: dbInfo.blue_coins,
            starbits: dbInfo.starbits
        }
    }

    static rankupPoints = 2000;
    static requiredPoints = [0,10,150,500];

    prestige() { return Math.floor(this.points / (rankupPoints * 12)) }
    rank() { 
        if (this.newUser) {
            let rank = 2;
            while(this.points > requiredPoints[rank])
                rank--;
            return rank;
        }

        return Math.floor(this.points / 30) % 12
    }

    addXP(value=1) {
        client.userDB.set(this.id, Date.now(), 'lastPointAdd');
        this.points += value;
        // Once they reach rank 3 for the first time,
        // proceed onto the linear 2000 point per rank track
        if (this.newUser && this.points > this.requiredPoints[3]) {
            this.points = rankupPoints * 3;
            this.newUser = false;
        }
        client.userDB.set(this.id, this.points, 'points');
    }

    setLast(type) {
        if(type === 'Work' || type === 'Daily' || type === 'Question')
            client.userDB.set(this.id, Date.now(), `last${type}`);
    }
}
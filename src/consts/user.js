export class User {
    #database

    constructor(client, id) {
        const dbInfo = client.userDB.ensure(id,
            { id: id,
                points: 0,
                currency: { bluecoins: 0, starbits: 0},
                lastWork: 0,
                lastDaily: 0,
                lastQuestion: 0,
                lastPointAdd: 0,
                newUser: true
            }
        );

        this.id = id;
        this.#database = client.userDB;

        this.lastWork = dbInfo.lastWork ?? 0;
        this.lastDaily = dbInfo.lastDaily ?? 0;
        this.lastQuestion = dbInfo.lastQuestion ?? 0;
        this.lastPoint = dbInfo.lastPointAdd ?? 0;

        this.points = dbInfo.points;
        this.newUser = dbInfo.newUser;

        this.currency = dbInfo.currency;

        this.boostRole = null;
    }

    static rankupPoints = 2000;
    static requiredPoints = [0,10,100,250];

    prestige() { return Math.floor(this.points / (User.rankupPoints * 12)) }
    rank() { 
        if (this.newUser) {
            let rank = 3;
            while(this.points < User.requiredPoints[rank])
                rank--;
            return rank;
        }

        return Math.floor(this.points / User.rankupPoints) % 12;
    }

    rankProgress() {
        if (this.newUser) {
            const rank = this.rank();
            return ((this.points - User.requiredPoints[rank]) / (User.requiredPoints[rank+1] - User.requiredPoints[rank]))
        }
        else { return (this.points % User.rankupPoints) / User.rankupPoints; }
    }

    addXP(value=1) {
        this.#database.set(this.id, Date.now(), 'lastPointAdd');
        this.points += value;
        // Once they reach rank 3 for the first time,
        // proceed onto the linear 2000 point per rank track
        if (this.newUser && this.points >= User.requiredPoints[3]) {
            this.points = User.rankupPoints * 3;
            this.newUser = false;
            this.#database.set(this.id, false, 'newUser');
        }
        this.#database.set(this.id, this.points, 'points');
    }

    addCurrency(type, value=1) {
        if(type === 'bluecoins' || type === 'starbits') {
            this.currency[type] += value;
            this.#database.set(this.id, this.currency[type], `currency.${type}`)
        }
    }

    setLast(type) {
        if(type === 'Work' || type === 'Daily' || type === 'Question')
            this[`last${type}`] = Date.now();
            this.#database.set(this.id, Date.now(), `last${type}`);
    }
}
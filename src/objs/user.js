import { Currencies, GameInfo, Lasts } from "../consts/user-params.js";
import { cleanToAlphaNumeric } from "../utils.js";

export class User {
    #userDatabase
    #gameDatabase

    constructor(client, id) {
        const dbInfo = client.userInfo.ensure(id,
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
        this.#userDatabase = client.userInfo;
        this.#gameDatabase = client.userGameInfo;

        this.lastWork = dbInfo.lastWork ?? 0;
        this.lastDaily = dbInfo.lastDaily ?? 0;
        this.lastQuestion = dbInfo.lastQuestion ?? 0;
        this.lastPoint = dbInfo.lastPointAdd ?? 0;

        this.points = dbInfo.points;
        this.newUser = dbInfo.newUser;

        this.currency = dbInfo.currency;

        this.boostRole = null;

        this.gameInfo = client.userGameInfo.get(id) ?? null;
    }

    static rankupPoints = 2000;
    static requiredPoints = [0,10,100,250];

    prestige() { return Math.floor(this.points / (User.rankupPoints * 12)) }
    rank(pointOffset=0) { 
        const points = this.points + pointOffset;
        if (this.newUser) {
            let rank = 3;
            while(points < User.requiredPoints[rank])
                rank--;
            return rank;
        }

        return Math.floor(points / User.rankupPoints) % 12;
    }

    rankProgress() {
        if (this.newUser) {
            const rank = this.rank();
            return ((this.points - User.requiredPoints[rank]) / (User.requiredPoints[rank+1] - User.requiredPoints[rank]))
        }
        else { return (this.points % User.rankupPoints) / User.rankupPoints; }
    }

    addXP(value=1) {
        this.#userDatabase.set(this.id, Date.now(), 'lastPointAdd');
        this.points += value;

        // Points must be a positive number
        this.points = Math.max(this.points, 0);
        
        // Once they reach rank 3 for the first time,
        // proceed onto the linear 2000 point per rank track
        if (this.newUser && this.points >= User.requiredPoints[3]) {
            this.points = User.rankupPoints * 3;
            this.newUser = false;
            this.#userDatabase.set(this.id, false, 'newUser');
        }
        this.#userDatabase.set(this.id, this.points, 'points');
    }

    addCurrency(type, value=1) {
        if(type in Currencies) {
            this.currency[type] += value;
            this.#userDatabase.set(this.id, this.currency[type], `currency.${type}`)
        }
    }

    setLast(type, date = Date.now()) {
        if(type in Lasts)
            this[`last${type}`] = date;
            this.#userDatabase.set(this.id, Date.now(), `last${type}`);
    }

    setGameInfo(type, value) {
        if(type === GameInfo.SW_FC) {
            // clean up friend code to just numerical value
            const cleanedFC = value.replaceAll(/[^0-9]/g, '');
            // Switch FCs are 12 chars long
            if (cleanedFC.length !== 12)
                return false;

            // Create empty object if not already existant
            this.gameInfo = this.gameInfo ?? {};
            this.gameInfo[type] = cleanedFC;
            this.#gameDatabase.set(this.id, cleanedFC, type);
        }
        else if(type === GameInfo.STM_NAME || type === GameInfo.SW_NAME) {
            // clean up just to alphanum
            const cleanedName = cleanToAlphaNumeric(value);

            this.gameInfo[type] = cleanedName;
            this.#gameDatabase.set(this.id, cleanedName, type)
        }
    }
}
const { Discord, EmbedBuilder } = require('discord.js');
const { Channels, Servers } = require('./consts/channels.js')

//Sends out the Question of the Day from THE LIST
const sendOutQuestion = async () => {
    const oneUpWorld = client.guilds.cache.get(Servers.ONE_UP_WORLD);
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
        return await oneUpWorld.channels.cache.get(Channels.GENERAL_PLANNING).send("<@&1103339257810124972> There is no question for today. Add one using the `/editquestions add` command. It will send out automatically.");
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
        now.getDate() + 1,
        12, 0, 0);

    setTimeout(() => {
        client.sendOutQuestion();
    }, (noon.getTime() - now.getTime()));
};

const sendOutTournament = async () => {
    const oneUpWorld = client.guilds.cache.get(Servers.ONE_UP_WORLD);
    const pollChannel = oneUpWorld.channels.cache.get(client.tournamentSettings.get('pollChannel'));
    const role = oneUpWorld.roles.cache.find((r) => r.name === 'Happening Space');
    //const role = '';

    const round = client.tournamentSettings.get('round');
    const match = client.tournamentSettings.get('match');

    if (!(round == 1 && match == 1)) {
        const message_id = client.tournamentSettings.get('lastPoll');
        const lastMatch = client.tournamentSettings.get('lastMatch');
        const lastRound = client.tournamentSettings.get('lastRound');
        if (message_id != '') {
            const last_poll = await pollChannel.messages.fetch(message_id);
            last_poll.poll.end();
            const answers = last_poll.poll.answers;

            let results = { round: lastRound, match: lastMatch, games: [] };

            answers.forEach((answer) => {
                results.games.push({ name: answer.text, votes: answer.voteCount });
            });

            const totalVotes = results.games[0].votes + results.games[1].votes;
            const voteDiff = results.games[0].votes - results.games[1].votes;
            let winner = "";

            if (voteDiff == 0)
                winner = Math.random() >= .5 ? results.games[0].name : results.games[1].name;
            else
                winner = voteDiff > 0 ? results.games[0].name : results.games[1].name;

            results.winner = winner;
            results.winPercent = Math.abs(voteDiff / totalVotes) + .5;

            client.tournamentSettings.push('results', results);
            if (round != 5) {
                client.tournamentSettings.push(`round${lastRound + 1}games`, winner);
            }
        }
    }

    const round_games = client.tournamentSettings.get(`round${round}games`);
    const games = [
        { text: round_games[(match - 1) * 2] },
        { text: round_games[(match - 1) * 2 + 1] }
    ];

    client.tournamentSettings.set('lastRound', round);
    client.tournamentSettings.set('lastMatch', match);

    if (match * 2 >= round_games.length) {
        client.tournamentSettings.inc('round');
        client.tournamentSettings.set('match', 1);
    }
    else
        client.tournamentSettings.inc('match');

    const roundInfo = (round == 5) ? '☆ GRAND FINALS ☆' : `ROUND ${round} | MATCH ${match}`;
    setTimeout(() => {
        pollChannel.send(`${role}\nIt's time to vote on the next round of the **Mario Switch Game Tournament**!`);
        client.sendOutPoll(pollChannel, `What's the best Mario Switch game? ${roundInfo}`, games);

        //let's send a new poll tomorrow!
        const now = new Date();
        let noon = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + 1,
            14, 0, 0);

        setTimeout(() => {
            client.sendOutTournament();
        }, (noon.getTime() - now.getTime()));
    }, 6000);
};

const sendOutPoll = async (channel, question, options) => {
    channel.send({
        poll: {
            question: { text: question },
            answers: options,
            duration: 24,
            allowMultiselect: false,
            layoutType: Discord.PollLayoutType.Default
        }
    }).then(sent => { client.tournamentSettings.set('lastPoll', sent.id) });
};

// Create an embed post based on the number of April
// Fools luigi reacts left to be found
const createLuigiEmbed = () => {
    const luigisLeft = client.luigiEmotes.filter((v) => v === false).size;
    const embed = new EmbedBuilder()
        .setColor(0x19A01)
        .setTitle(`Mario's Fate is Set <t:1743598800:R>`)
        .setImage('https://cdn.discordapp.com/attachments/584662689658306561/1355988672381587666/capturedMario.png')
        .setThumbnail('https://cdn.discordapp.com/attachments/584662689658306561/1355984013533122642/jigsawlogo2.png')
        .addFields({
            name: "Use the hints below to find the 64 Hidden Luigis. Each one is a reaction to a message on the server. Show mercy to one brother to save the other. It's all up to you.",
            value: `${luigisLeft} Luigi${(luigisLeft == 1) ? '' : 's'} ${client.emojis.cache.get('1355989613692588043')} remain.`
        });
    return embed;
};

module.exports = { sendOutQuestion, sendOutTournament, sendOutPoll, createLuigiEmbed }
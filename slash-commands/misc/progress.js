const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { User } = require('../../src/consts/user');
const { levelUpEmojis8Bit, miscCharacters } = require('../../src/consts/emoji');

module.exports = {
        category: 'misc',
        data: new SlashCommandBuilder()
            .setName('progress')
            .setDescription('Keep track of your journey through the server rank system.'),
        async execute(interaction, client) {
            const member = interaction.member;

            const dot = client.emojis.cache.get(miscCharacters.dot);
            const prestige = client.emojis.cache.get(miscCharacters.prestige);

            const motivationalQuotes = ["Everyone starts somewhere.", "You're making progress already!", "Keep on keeping on.", "That's roughly a third!", "Great job so far!", "*Living on a prayer!*", "It's all downhill from here.", "The end is nearly in sight!", "Don't give up now!!!", "You could rank up any time now! Exciting!"]

            const characters = client.characterRoleEmotes;
            const user = new User(client, member.id);
            let runningEmote;
            let color = "#000000";

            // Gets emote of character if user has an applicable team role; uses Mario otherwise
            if (member.roles.cache.some((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)))) {
                let role = member.roles.cache.find((r) => r.name.includes('Team') && characters.has(r.name.substr(r.name.indexOf(' ')+1)));

                if (member.roles.cache.some((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1))))
                    role = member.roles.cache.find((r) => r.name.includes('eam') && client.teamSettings.get('otherTeams').includes(r.name.substr(r.name.indexOf(' ')+1)));
                
                runningEmote = client.emojis.cache.get(characters.get(role.name.slice(5)));
                color = role.color.toString(16);
            }
            else
                runningEmote = client.emojis.cache.get(miscCharacters.runningMario);

            // Determines how far to their next levelup the user has gotten, from 0-9, rounded down
            let roughProgress = Math.floor(user.rankProgress() * 10);
            console.log(roughProgress)

            // Creates "path" of walking emote, start and end destinations, and the rough position they are at
            let progressPath = `${client.emojis.cache.get(levelUpEmojis8Bit[user.rank()])}`;
            if (roughProgress === 0)
            progressPath = `${runningEmote}`;
            for (let i = 1; i <= 9; i++) {
                if (i === roughProgress)
                    progressPath += `${runningEmote}`;
                else
                    progressPath += `${dot}`;
            }
            progressPath += `${client.emojis.cache.get(levelUpEmojis8Bit[user.rank()+1])}`;
            progressPath += '⠀';

            const rankEmbed = new EmbedBuilder()
                .setTitle(`${member.displayName}'s Level Journey!`)
                .setThumbnail(member.displayAvatarURL())
                .addFields({name: `On the way to level ${user.rank()+1} | ${prestige} **x ${user.prestige()}**`, value: `${progressPath}`});
                
            rankEmbed.addFields({
                name: ((roughProgress === 5) ? `You're halfway there!` : `You're ${roughProgress * 10}% of the way there!`),
                value: motivationalQuotes[roughProgress]
            });

            return interaction.reply({ embeds: [rankEmbed] });
        },
};
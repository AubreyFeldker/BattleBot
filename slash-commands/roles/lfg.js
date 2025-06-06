const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { Channels } = require('../../src/consts/channels');

const gameNames = new Map([
    ['Super Mario Bros. Wonder', 'Super Mario Bros. Wonder'],
    ['3D World', 'Super Mario 3D World'],
    ['Mario Maker 2', 'Super Mario Mario Maker 2'],
    ['Mario Kart', 'Mario Kart 8 Deluxe'],
    ['Mario Party', 'Mario Party'],
    ['Smash Bros.', 'Super Smash Bros. Ultimate'],
    ['Mario Kart World', 'Mario Kart World']
]);

module.exports = {
    category: 'roles',
    validChannels: [Channels.GAME_MATCHMAKING],
    data: new SlashCommandBuilder()
        .setName('lfg')
        .setDescription('Find other people to play a Mario game with.')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The game you want to play')
                .setRequired(true)
                .addChoices(
                    { name: 'Super Mario Bros. Wonder', value: 'Super Mario Bros. Wonder' },
                    { name: 'Super Mario 3D World', value: '3D World' },
                    { name: 'Super Mario Maker 2', value: 'Mario Maker 2' },
                    { name: 'Mario Kart 8 Deluxe', value: 'Mario Kart 8' },
                    { name: 'Mario Party series', value: 'Mario Party' },
                    { name: 'Super Smash Bros. Ultimate', value: 'Smash Bros.' },
                    { name: 'Mario Kart World', value: 'Mario Kart World'}
                ))
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('The lobby channel you will be playing in')
                .setRequired(true)
                .addChoices(
                    { name: '#red-lobby', value: 'red-lobby' },
                    { name: '#green-lobby', value: 'green-lobby' },
                    { name: '#pink-lobby', value: 'pink-lobby' },
                    { name: '#blue-lobby', value: 'blue-lobby' },
                ))
        .addStringOption(option =>
            option.setName('details')
                .setDescription('Include any details about game modes, etc you want to play')
        ),
    async execute(interaction, client) {
        const game = interaction.options.getString('game');
        const lastPing = client.settings.ensure(game + ' lastping', { user: null, time: 0 });
        const thisPing = Date.now();

        if (thisPing - lastPing.time < (30 * 60 * 1000))
            return interaction.reply({ content: `<@${lastPing.user}> just asked about playing ${gameNames.get(game)} recently. Try asking them if you can join!`, ephemeral: true });

        const gameRole = interaction.guild.roles.cache.find((r) => r.name === (game + ' LFG'));
        const channel = interaction.guild.channels.cache.find((c) => c.name === interaction.options.getString('channel'));
        const details = interaction.options.getString('details') ?? '';

        await interaction.channel.send(`# <@&${gameRole.id}>\n${interaction.user} is looking to play **${gameNames.get(game)}** in ${channel}${details === '' ? '!' : ' with the details:\n> '}${details}`);
        await interaction.reply({ content: "Have fun!", ephemeral: true });
        client.settings.set(game + ' lastping', { user: interaction.user.id, time: thisPing });
    },
};
const { SlashCommandBuilder } = require("discord.js");
const { User } = require('../../src/objs/user');
const { GameInfo } = require("../../src/consts/user-params");
const { Channels } = require("../../src/consts/channels");

function showInfo(client, interaction) {
    const user = new User(client, interaction.user.id);

    if (!user.gameInfo)
        return interaction.followUp(`No game account info has been added. Use \`/gameinfo add\` in <#${Channels.BOT_SPAM}> to do so.`);

    let msg = `<@${interaction.user.id}>'s Game Info\n`;

    for (let [key, value] of Object.entries(user.gameInfo)) {
        if (key === 'switchfc')
            value = `SW-${value.substring(0,4)}-${value.substring(4,8)}-${value.substring(8,12)}`
        msg += `* ${key.toUpperCase()}: \`${value}\`\n`
    };

    return interaction.followUp(msg);
}

function addInfo(client, interaction) {
    const user = new User(client, interaction.user.id);
    const gameInfo = interaction.options.data[0].options;
    let msg = "I've added the following to your server profile:\n";
    let success = true;

    if (gameInfo.length === 0)
        return interaction.followUp('You have to provide data for me to add, silly.')
    // Iterate the given options
    gameInfo.forEach((gameInfoOption) => {
        success = success && user.setGameInfo(gameInfoOption.name, gameInfoOption.value);
        msg += `* ${gameInfoOption.name.toUpperCase()}: \`${gameInfoOption.value}\`\n`
    });

    if (success)
        interaction.followUp(msg);
    else
        interaction.followUp("That's not a valid Switch friend code!");
}

module.exports = {
    category: 'user',
    localOnly: false,
    data: new SlashCommandBuilder()
        .setName('gameinfo')
        .setDescription('Show your game account info (Switch, Steam) easily on the server.')
        .addSubcommand(subcommand =>
            subcommand.setName('add')
            .setDescription('Add game account info.')
            .addStringOption(option =>
                option.setName(GameInfo.SW_NAME)
                .setDescription('Your username on Switch. Symbols will be removed from it.')
            )
            .addStringOption(option =>
                option.setName(GameInfo.SW_FC)
                .setDescription('Your Friend Code on Switch')
            )
            .addStringOption(option =>
                option.setName(GameInfo.STM_NAME)
                .setDescription('Your username on Steam')
            )
        )
        .addSubcommand(subcommand =>
            subcommand.setName('show')
            .setDescription('Shows your already-added game account info.')
            .addUserOption(option =>
                option.setName('member')
                .setDescription('The member to get game info for, if not yourself')
            )
        )
    ,
    async execute(interaction, client) {
        await interaction.deferReply();

        switch(interaction.options.getSubcommand()) {
            case('add'):
                addInfo(client, interaction);
                break;
            case('show'):
                showInfo(client, interaction);
                break;
            default:
                interaction.followUp({content: "Unrecognized subcommand.", ephemeral: true});
        }
    },
};
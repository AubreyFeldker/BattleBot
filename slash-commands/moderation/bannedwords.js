const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { BanRule } = require('../../src/objs/banrule');

module.exports = {
        category: 'moderation',
        data: new SlashCommandBuilder()
            .setName('bannedwords')
            .setDescription('description')
            .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
            .addSubcommand(subcommand =>
                subcommand.setName('add')
                .setDescription('Add a new rule, or add more specific rules to it.')
                .addStringOption(option =>
                    option.setName('name')
                    .setDescription('General category of the rule')
                    .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('rules')
                    .setDescription('Specific text to be banned. Each rule should be separated by verticle bars (|).')
                    .setRequired(true)
                )
            )
            .addSubcommand(subcommand =>
                subcommand.setName('show')
                .setDescription('Shows all available rules.')
            )
            .addSubcommand(subcommand =>
                subcommand.setName('delete')
                .setDescription('Delete a rule.')
                .addStringOption(option =>
                    option.setName('name')
                    .setDescription('General category of the rule')
                    .setRequired(true)
                )
            ),
        async execute(interaction, client) {
            await interaction.deferReply();

			switch(interaction.options.getSubcommand()) {
                case('add'):
                    const rule = new BanRule(client, interaction.options.getString('name'));
                    const ruleTerms = interaction.options.getString('rules').split('|');
                    ruleTerms.forEach(term => rule.addRule(term));

                    interaction.followUp(`Added rule \`${rule.name}\` with terms \`${ruleTerms.join(', ')}\``);
                    break;
                case('show'):
                    const rules = BanRule.getAllRules(client);
                    if (rules.length === 0)
                        return interaction.followUp('No banned word rules have been established.');
                    let msg = 'List of all rules:\n';
                    console.log(rules);
                    msg += rules.map(rule => `* **${rule.name}** (${rule.rules.join(', ')})
                        - Last offense <t:${rule.lastWarn}:R> ${rule.lastWarnUser === '' ? `by <@${rule.lastWarnUser}>` : ''}`)
                        .join('\n');
                    interaction.followUp(msg);
                    break;
                case('delete'):
                    const delRule = new BanRule(client, interaction.options.getString('name'));
                    delRule.delete();
                    interaction.followUp(`Deleted rule \`${delRule.name}\`.`);
                    break;
                default:
					interaction.followUp({content: "Unrecognized subcommand.", ephemeral: true});
            }
        },
};
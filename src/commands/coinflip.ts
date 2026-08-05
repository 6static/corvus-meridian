import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { playCoinflip, CoinSide } from '../games/coinflip.js'
import { spendCurrency, awardCurrency, InsufficientFundsError } from '../economy/currency.js'
import { GuildConfig } from '../db/models/index.js'

export const data = new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Bet currency on a coinflip')
    .addIntegerOption((opt) => opt.setName('bet').setDescription('Amount to bet').setRequired(true).setMinValue(1))
    .addStringOption((opt) =>
        opt
            .setName('choice')
            .setDescription('Heads or tails')
            .setRequired(true)
            .addChoices({ name: 'Heads', value: 'heads' }, { name: 'Tails', value: 'tails' })
    )

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const bet = interaction.options.getInteger('bet', true)
    const choice = interaction.options.getString('choice', true) as CoinSide

    try {
        await spendCurrency(interaction.guildId, interaction.user.id, bet, 'coinflip:bet')
    } catch (error) {
        if (error instanceof InsufficientFundsError) {
            await interaction.reply({ content: error.message, ephemeral: true })
            return
        }
        throw error
    }

    const outcome = playCoinflip(bet, choice)
    const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })

    if (outcome.won) {
        await awardCurrency(interaction.guildId, interaction.user.id, outcome.payout, 'coinflip:win')
        await interaction.reply(`The coin landed on **${outcome.result}**. You won **${outcome.payout}** ${config.currencyName}!`)
    } else {
        await interaction.reply(`The coin landed on **${outcome.result}**. You lost your bet of **${bet}** ${config.currencyName}.`)
    }
}
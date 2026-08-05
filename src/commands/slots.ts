import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { playSlots } from '../games/slots.js'
import { spendCurrency, awardCurrency, InsufficientFundsError } from '../economy/currency.js'
import { GuildConfig } from '../db/models/index.js'

export const data = new SlashCommandBuilder()
    .setName('slots')
    .setDescription('Bet currency on the slot machine')
    .addIntegerOption((opt) => opt.setName('bet').setDescription('Amount to bet').setRequired(true).setMinValue(1))

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const bet = interaction.options.getInteger('bet', true)

    try {
        await spendCurrency(interaction.guildId, interaction.user.id, bet, 'slots:bet')
    } catch (error) {
        if (error instanceof InsufficientFundsError) {
            await interaction.reply({ content: error.message, ephemeral: true })
            return
        }
        throw error
    }

    const outcome = playSlots(bet)
    const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })
    const reelsText = outcome.reels.join(' | ')

    if (outcome.payout > 0) {
        await awardCurrency(interaction.guildId, interaction.user.id, outcome.payout, 'slots:win')
        await interaction.reply(`${reelsText}\nYou won **${outcome.payout}** ${config.currencyName}!`)
    } else {
        await interaction.reply(`${reelsText}\nNo match. You lost your bet of **${bet}** ${config.currencyName}.`)
    }
}
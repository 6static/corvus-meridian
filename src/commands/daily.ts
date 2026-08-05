import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { claimDaily, DailyOnCooldownError } from '../economy/daily.js'
import { GuildConfig } from '../db/models/index.js'

export const data = new SlashCommandBuilder().setName('daily').setDescription('Claim your daily currency reward')

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })

    try {
        const result = await claimDaily(interaction.guildId, interaction.user.id)
        await interaction.reply(`You claimed **${result.amount}** ${config.currencyName}. Balance: **${result.balance}**.`)
    } catch (error) {
        if (error instanceof DailyOnCooldownError) {
            const unixSeconds = Math.floor(error.nextAvailableAt.getTime() / 1000)
            await interaction.reply({
                content: `You already claimed your daily reward. Try again <t:${unixSeconds}:R>.`,
                ephemeral: true
            })
            return
        }
        throw error
    }
}
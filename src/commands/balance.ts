import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { GuildConfig, MemberProfile } from '../db/models/index.js'

export const data = new SlashCommandBuilder()
    .setName('balance')
    .setDescription("Check your (or another member's) currency balance")
    .addUserOption((opt) => opt.setName('user').setDescription('Member to check').setRequired(false))

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const target = interaction.options.getUser('user') ?? interaction.user

    const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })
    const [profile] = await MemberProfile.findOrCreate({ where: { guildId: interaction.guildId, userId: target.id } })

    await interaction.reply(`${target.username} has **${profile.balance}** ${config.currencyName}.`)
}
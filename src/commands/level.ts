import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { MemberProfile } from '../db/models/index.js'
import { buildLevelEmbed } from '../discord/embeds.js'

export const data = new SlashCommandBuilder()
    .setName('level')
    .setDescription("Show your (or another member's) level and XP")
    .addUserOption((opt) => opt.setName('user').setDescription('Member to check').setRequired(false))

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const target = interaction.options.getUser('user') ?? interaction.user

    const [profile] = await MemberProfile.findOrCreate({ where: { guildId: interaction.guildId, userId: target.id } })
    await interaction.reply({ embeds: [buildLevelEmbed(target.username, profile)] })
}
import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { MemberProfile } from '../db/models/index.js'
import { buildLeaderboardEmbed } from '../discord/embeds.js'

export const data = new SlashCommandBuilder()
    .setName('leaderboard')
    .setDescription('Show the top members by XP in this server')

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return

    const top = await MemberProfile.findAll({
        where: { guildId: interaction.guildId },
        order: [['xp', 'DESC']],
        limit: 10
    })

    const entries = await Promise.all(
        top.map(async (profile) => {
            const member = await interaction.guild?.members.fetch(profile.userId).catch(() => null)
            return { username: member?.user.username ?? 'Unknown', xp: profile.xp, level: profile.level }
        })
    )

    await interaction.reply({ embeds: [buildLeaderboardEmbed(entries)] })
}
import { EmbedBuilder } from 'discord.js'
import { xpProgress } from '../leveling/xpCurve.js'

export function buildLevelEmbed(username: string, profile: { xp: number; level: number }): EmbedBuilder {
    const progress = xpProgress(profile.xp)
    return new EmbedBuilder()
        .setTitle(`${username}'s level`)
        .addFields(
            { name: 'Level', value: String(progress.level), inline: true },
            { name: 'XP', value: `${progress.currentLevelXp} / ${progress.xpForNextLevel}`, inline: true }
        )
}

export interface LeaderboardEntry {
    username: string
    xp: number
    level: number
}

export function buildLeaderboardEmbed(entries: LeaderboardEntry[]): EmbedBuilder {
    const lines = entries.map((e, i) => `**${i + 1}.** ${e.username} — Level ${e.level} (${e.xp} XP)`)
    return new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription(lines.length > 0 ? lines.join('\n') : 'No one has earned XP yet.')
}
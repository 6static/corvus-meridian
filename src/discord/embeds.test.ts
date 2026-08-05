import { describe, it, expect } from 'vitest'
import { buildLevelEmbed, buildLeaderboardEmbed } from './embeds.js'

describe('buildLevelEmbed', () => {
    it('shows level and progress within the current level', () => {
        const embed = buildLevelEmbed('Martin', { xp: 150, level: 1 }).data
        expect(embed.title).toBe("Martin's level")
        expect(embed.fields).toEqual([
            { name: 'Level', value: '1', inline: true },
            { name: 'XP', value: '50 / 155', inline: true }
        ])
    })
})

describe('buildLeaderboardEmbed', () => {
    it('shows a placeholder when no one has XP yet', () => {
        const embed = buildLeaderboardEmbed([]).data
        expect(embed.description).toBe('No one has earned XP yet.')
    })

    it('lists entries in rank order', () => {
        const embed = buildLeaderboardEmbed([
            { username: 'Martin', xp: 500, level: 3 },
            { username: 'Corva', xp: 200, level: 1 }
        ]).data
        expect(embed.description).toBe('**1.** Martin — Level 3 (500 XP)\n**2.** Corva — Level 1 (200 XP)')
    })
})
import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../db/sequelize.js'
import { initModels, GuildConfig } from '../db/models/index.js'
import { processMessageXp } from './messageXp.js'

describe('processMessageXp', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('does not award XP to bot messages', async () => {
        const result = await processMessageXp('guild-1', 'bot-1', true)
        expect(result.awarded).toBe(false)
    })

    it('awards XP on the first message', async () => {
        const result = await processMessageXp('guild-1', 'user-1', false)
        expect(result.awarded).toBe(true)
    })

    it('does not award XP again within the cooldown window', async () => {
        const now = new Date('2026-01-01T00:00:00Z')
        await processMessageXp('guild-1', 'user-1', false, now)
        const secondResult = await processMessageXp('guild-1', 'user-1', false, new Date(now.getTime() + 10_000))
        expect(secondResult.awarded).toBe(false)
    })

    it('awards XP again after the cooldown window passes', async () => {
        const now = new Date('2026-01-01T00:00:00Z')
        await processMessageXp('guild-1', 'user-1', false, now)
        const secondResult = await processMessageXp('guild-1', 'user-1', false, new Date(now.getTime() + 61_000))
        expect(secondResult.awarded).toBe(true)
    })

    it('reports leveledUp with the new level once enough XP accumulates', async () => {
        await GuildConfig.create({ guildId: 'guild-1', xpPerMessage: 50, xpCooldownSeconds: 0 })
        await processMessageXp('guild-1', 'user-1', false, new Date(0))
        const result = await processMessageXp('guild-1', 'user-1', false, new Date(1))
        expect(result.leveledUp).toBe(true)
        expect(result.newLevel).toBe(1)
    })
})

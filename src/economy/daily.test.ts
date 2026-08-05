import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../db/sequelize.js'
import { initModels } from '../db/models/index.js'
import { claimDaily, DailyOnCooldownError } from './daily.js'

describe('claimDaily', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('awards the configured daily amount on first claim', async () => {
        const result = await claimDaily('guild-1', 'user-1', new Date('2026-01-01T00:00:00Z'))
        expect(result).toEqual({ amount: 100, balance: 100 })
    })

    it('rejects a second claim on the same day', async () => {
        const now = new Date('2026-01-01T00:00:00Z')
        await claimDaily('guild-1', 'user-1', now)
        await expect(claimDaily('guild-1', 'user-1', new Date(now.getTime() + 60_000))).rejects.toThrow(DailyOnCooldownError)
    })

    it('allows a claim after 24 hours have passed', async () => {
        const now = new Date('2026-01-01T00:00:00Z')
        await claimDaily('guild-1', 'user-1', now)
        const result = await claimDaily('guild-1', 'user-1', new Date(now.getTime() + 24 * 60 * 60 * 1000 + 1000))
        expect(result.balance).toBe(200)
    })
})
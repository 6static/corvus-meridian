import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../sequelize.js'
import { initModels, MemberProfile } from './index.js'

describe('MemberProfile', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('applies default values when only guildId and userId are given', async () => {
        const profile = await MemberProfile.create({ guildId: 'guild-1', userId: 'user-1' })
        expect(profile.xp).toBe(0)
        expect(profile.level).toBe(0)
        expect(profile.balance).toBe(0)
        expect(profile.lastMessageAt).toBeNull()
    })

    it('enforces uniqueness on (guildId, userId)', async () => {
        await MemberProfile.create({ guildId: 'guild-1', userId: 'user-1' })
        await expect(MemberProfile.create({ guildId: 'guild-1', userId: 'user-1' })).rejects.toThrow()
    })

    it('allows the same userId across different guilds', async () => {
        await MemberProfile.create({ guildId: 'guild-1', userId: 'user-1' })
        await expect(MemberProfile.create({ guildId: 'guild-2', userId: 'user-1' })).resolves.toBeTruthy()
    })
})
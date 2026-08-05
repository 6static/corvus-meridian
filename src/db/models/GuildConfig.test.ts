import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../sequelize.js'
import { initModels, GuildConfig } from './index.js'

describe('GuildConfig', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('applies default values when only guildId is given', async () => {
        const config = await GuildConfig.create({ guildId: 'guild-1' })
        expect(config.xpPerMessage).toBe(15)
        expect(config.xpCooldownSeconds).toBe(60)
        expect(config.currencyName).toBe('Coins')
        expect(config.dailyAmount).toBe(100)
    })

    it('persists custom values', async () => {
        await GuildConfig.create({ guildId: 'guild-2', xpPerMessage: 25, currencyName: 'Shards' })
        const found = await GuildConfig.findByPk('guild-2')
        expect(found?.xpPerMessage).toBe(25)
        expect(found?.currencyName).toBe('Shards')
    })
})
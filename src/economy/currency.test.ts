import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../db/sequelize.js'
import { initModels, MemberProfile } from '../db/models/index.js'
import { Transaction } from '../db/models/Transaction.js'
import { awardCurrency, spendCurrency, InsufficientFundsError } from './currency.js'

describe('currency', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('awardCurrency increases balance and records a transaction', async () => {
        const profile = await awardCurrency('guild-1', 'user-1', 100, 'test')
        expect(profile.balance).toBe(100)
        const transactions = await Transaction.findAll({ where: { guildId: 'guild-1', userId: 'user-1' } })
        expect(transactions).toHaveLength(1)
        expect(transactions[0].amount).toBe(100)
    })

    it('spendCurrency decreases balance when funds are sufficient', async () => {
        await awardCurrency('guild-1', 'user-1', 100, 'seed')
        const profile = await spendCurrency('guild-1', 'user-1', 40, 'purchase')
        expect(profile.balance).toBe(60)
    })

    it('spendCurrency throws InsufficientFundsError and records no transaction when funds are too low', async () => {
        await awardCurrency('guild-1', 'user-1', 10, 'seed')
        await expect(spendCurrency('guild-1', 'user-1', 40, 'purchase')).rejects.toThrow(InsufficientFundsError)
        const profile = await MemberProfile.findOne({ where: { guildId: 'guild-1', userId: 'user-1' } })
        expect(profile?.balance).toBe(10)
        const transactions = await Transaction.findAll({ where: { guildId: 'guild-1', userId: 'user-1' } })
        expect(transactions).toHaveLength(1)
    })
})
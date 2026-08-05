import { describe, it, expect, beforeEach } from 'vitest'
import { createSequelize } from '../db/sequelize.js'
import { initModels } from '../db/models/index.js'
import { ShopItem } from '../db/models/ShopItem.js'
import { Inventory } from '../db/models/Inventory.js'
import { awardCurrency } from './currency.js'
import { InsufficientFundsError } from './currency.js'
import { buyItem, ItemNotFoundError } from './shop.js'

describe('buyItem', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('deducts balance and increments inventory for a consumable item', async () => {
        await ShopItem.create({ guildId: 'guild-1', name: 'XP Boost', price: 50, type: 'consumable', roleId: null })
        await awardCurrency('guild-1', 'user-1', 100, 'seed')

        const result = await buyItem('guild-1', 'user-1', 'XP Boost')

        expect(result.balance).toBe(50)
        const entry = await Inventory.findOne({ where: { guildId: 'guild-1', userId: 'user-1' } })
        expect(entry?.quantity).toBe(1)
    })

    it('does not touch inventory for a role item', async () => {
        await ShopItem.create({ guildId: 'guild-1', name: 'VIP', price: 50, type: 'role', roleId: 'role-vip' })
        await awardCurrency('guild-1', 'user-1', 100, 'seed')

        await buyItem('guild-1', 'user-1', 'VIP')

        const entry = await Inventory.findOne({ where: { guildId: 'guild-1', userId: 'user-1' } })
        expect(entry).toBeNull()
    })

    it('throws ItemNotFoundError for an unknown item name', async () => {
        await expect(buyItem('guild-1', 'user-1', 'Nonexistent')).rejects.toThrow(ItemNotFoundError)
    })

    it('throws InsufficientFundsError when balance is too low', async () => {
        await ShopItem.create({ guildId: 'guild-1', name: 'VIP', price: 50, type: 'role', roleId: 'role-vip' })
        await expect(buyItem('guild-1', 'user-1', 'VIP')).rejects.toThrow(InsufficientFundsError)
    })
})
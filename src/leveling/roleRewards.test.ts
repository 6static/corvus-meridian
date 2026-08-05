import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createSequelize } from '../db/sequelize.js'
import { initModels } from '../db/models/index.js'
import { RoleReward } from '../db/models/RoleReward.js'
import { applyRoleRewardsForLevel } from './roleRewards.js'

describe('applyRoleRewardsForLevel', () => {
    beforeEach(async () => {
        const sequelize = createSequelize(':memory:')
        initModels(sequelize)
        await sequelize.sync({ force: true })
    })

    it('grants only rewards at or below the reached level', async () => {
        await RoleReward.create({ guildId: 'guild-1', level: 5, roleId: 'role-a' })
        await RoleReward.create({ guildId: 'guild-1', level: 10, roleId: 'role-b' })
        const addRole = vi.fn()

        const granted = await applyRoleRewardsForLevel({ guildId: 'guild-1', addRole }, 7)

        expect(granted).toEqual(['role-a'])
        expect(addRole).toHaveBeenCalledWith('role-a')
        expect(addRole).toHaveBeenCalledTimes(1)
    })

    it('grants all rewards once the level clears the highest threshold', async () => {
        await RoleReward.create({ guildId: 'guild-1', level: 5, roleId: 'role-a' })
        await RoleReward.create({ guildId: 'guild-1', level: 10, roleId: 'role-b' })
        const addRole = vi.fn()

        const granted = await applyRoleRewardsForLevel({ guildId: 'guild-1', addRole }, 12)

        expect(granted.sort()).toEqual(['role-a', 'role-b'])
    })
})
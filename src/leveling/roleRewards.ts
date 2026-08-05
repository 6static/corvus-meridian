import { Op } from 'sequelize'
import { RoleReward } from '../db/models/RoleReward.js'

export async function getRoleRewardsUpToLevel(guildId: string, level: number): Promise<RoleReward[]> {
    return RoleReward.findAll({ where: { guildId, level: { [Op.lte]: level } } })
}

export interface RoleGrantTarget {
    guildId: string
    addRole: (roleId: string) => Promise<void>
}

export async function applyRoleRewardsForLevel(target: RoleGrantTarget, level: number): Promise<string[]> {
    const rewards = await getRoleRewardsUpToLevel(target.guildId, level)
    const roleIds = rewards.map((r) => r.roleId)
    for (const roleId of roleIds) {
        await target.addRole(roleId)
    }
    return roleIds
}
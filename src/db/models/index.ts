import { Sequelize } from 'sequelize'
import { GuildConfig, initGuildConfig } from './GuildConfig.js'
import { MemberProfile, initMemberProfile } from './MemberProfile.js'
import { Transaction, initTransaction } from './Transaction.js'
import { RoleReward, initRoleReward } from './RoleReward.js'

export { GuildConfig, MemberProfile, Transaction, RoleReward }

export function initModels(sequelize: Sequelize): void {
    initGuildConfig(sequelize)
    initMemberProfile(sequelize)
    initTransaction(sequelize)
    initRoleReward(sequelize)
}
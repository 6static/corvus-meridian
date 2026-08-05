import { Sequelize } from 'sequelize'
import { GuildConfig, initGuildConfig } from './GuildConfig.js'
import { MemberProfile, initMemberProfile } from './MemberProfile.js'
import { Transaction, initTransaction } from './Transaction.js'

export { GuildConfig, MemberProfile, Transaction }

export function initModels(sequelize: Sequelize): void {
    initGuildConfig(sequelize)
    initMemberProfile(sequelize)
    initTransaction(sequelize)
}
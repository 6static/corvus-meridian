import { Sequelize } from 'sequelize'
import { GuildConfig, initGuildConfig } from './GuildConfig.js'
import { MemberProfile, initMemberProfile } from './MemberProfile.js'

export { GuildConfig, MemberProfile }

export function initModels(sequelize: Sequelize): void {
    initGuildConfig(sequelize)
    initMemberProfile(sequelize)
}
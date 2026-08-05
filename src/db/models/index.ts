import { Sequelize } from 'sequelize'
import { GuildConfig, initGuildConfig } from './GuildConfig.js'
import { MemberProfile, initMemberProfile } from './MemberProfile.js'
import { Transaction, initTransaction } from './Transaction.js'
import { RoleReward, initRoleReward } from './RoleReward.js'
import { ShopItem, initShopItem } from './ShopItem.js'
import { Inventory, initInventory } from './Inventory.js'

export { GuildConfig, MemberProfile, Transaction, RoleReward, ShopItem, Inventory }

export function initModels(sequelize: Sequelize): void {
    initGuildConfig(sequelize)
    initMemberProfile(sequelize)
    initTransaction(sequelize)
    initRoleReward(sequelize)
    initShopItem(sequelize)
    initInventory(sequelize)
}
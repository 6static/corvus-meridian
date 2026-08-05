import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export type ShopItemType = 'role' | 'consumable'

export class ShopItem extends Model<InferAttributes<ShopItem>, InferCreationAttributes<ShopItem>> {
    declare id: CreationOptional<number>
    declare guildId: string
    declare name: string
    declare price: number
    declare type: ShopItemType
    declare roleId: CreationOptional<string | null>
}

export function initShopItem(sequelize: Sequelize): typeof ShopItem {
    ShopItem.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            guildId: { type: DataTypes.STRING, allowNull: false },
            name: { type: DataTypes.STRING, allowNull: false },
            price: { type: DataTypes.INTEGER, allowNull: false },
            type: { type: DataTypes.ENUM('role', 'consumable'), allowNull: false },
            roleId: { type: DataTypes.STRING, allowNull: true, defaultValue: null }
        },
        {
            sequelize,
            modelName: 'ShopItem',
            tableName: 'shop_items',
            indexes: [{ unique: true, fields: ['guildId', 'name'] }]
        }
    )
    return ShopItem
}
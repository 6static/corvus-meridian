import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export class Inventory extends Model<InferAttributes<Inventory>, InferCreationAttributes<Inventory>> {
    declare id: CreationOptional<number>
    declare guildId: string
    declare userId: string
    declare shopItemId: number
    declare quantity: CreationOptional<number>
}

export function initInventory(sequelize: Sequelize): typeof Inventory {
    Inventory.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            guildId: { type: DataTypes.STRING, allowNull: false },
            userId: { type: DataTypes.STRING, allowNull: false },
            shopItemId: { type: DataTypes.INTEGER, allowNull: false },
            quantity: { type: DataTypes.INTEGER, defaultValue: 0 }
        },
        {
            sequelize,
            modelName: 'Inventory',
            tableName: 'inventory',
            indexes: [{ unique: true, fields: ['guildId', 'userId', 'shopItemId'] }]
        }
    )
    return Inventory
}
import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export class Transaction extends Model<InferAttributes<Transaction>, InferCreationAttributes<Transaction>> {
    declare id: CreationOptional<number>
    declare guildId: string
    declare userId: string
    declare amount: number
    declare reason: string
    declare createdAt: CreationOptional<Date>
}

export function initTransaction(sequelize: Sequelize): typeof Transaction {
    Transaction.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            guildId: { type: DataTypes.STRING, allowNull: false },
            userId: { type: DataTypes.STRING, allowNull: false },
            amount: { type: DataTypes.INTEGER, allowNull: false },
            reason: { type: DataTypes.STRING, allowNull: false },
            createdAt: DataTypes.DATE
        },
        { sequelize, modelName: 'Transaction', tableName: 'transactions', updatedAt: false }
    )
    return Transaction
}
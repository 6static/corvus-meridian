import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export class RoleReward extends Model<InferAttributes<RoleReward>, InferCreationAttributes<RoleReward>> {
    declare id: CreationOptional<number>
    declare guildId: string
    declare level: number
    declare roleId: string
}

export function initRoleReward(sequelize: Sequelize): typeof RoleReward {
    RoleReward.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            guildId: { type: DataTypes.STRING, allowNull: false },
            level: { type: DataTypes.INTEGER, allowNull: false },
            roleId: { type: DataTypes.STRING, allowNull: false }
        },
        { sequelize, modelName: 'RoleReward', tableName: 'role_rewards' }
    )
    return RoleReward
}
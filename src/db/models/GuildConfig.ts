import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export class GuildConfig extends Model<InferAttributes<GuildConfig>, InferCreationAttributes<GuildConfig>> {
    declare guildId: string
    declare xpPerMessage: CreationOptional<number>
    declare xpCooldownSeconds: CreationOptional<number>
    declare currencyName: CreationOptional<string>
    declare dailyAmount: CreationOptional<number>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export function initGuildConfig(sequelize: Sequelize): typeof GuildConfig {
    GuildConfig.init(
        {
            guildId: { type: DataTypes.STRING, primaryKey: true },
            xpPerMessage: { type: DataTypes.INTEGER, defaultValue: 15 },
            xpCooldownSeconds: { type: DataTypes.INTEGER, defaultValue: 60 },
            currencyName: { type: DataTypes.STRING, defaultValue: 'Coins' },
            dailyAmount: { type: DataTypes.INTEGER, defaultValue: 100 },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        { sequelize, modelName: 'GuildConfig', tableName: 'guild_configs' }
    )
    return GuildConfig
}
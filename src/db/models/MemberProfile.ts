import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from 'sequelize'

export class MemberProfile extends Model<InferAttributes<MemberProfile>, InferCreationAttributes<MemberProfile>> {
    declare id: CreationOptional<number>
    declare guildId: string
    declare userId: string
    declare xp: CreationOptional<number>
    declare level: CreationOptional<number>
    declare balance: CreationOptional<number>
    declare lastMessageAt: CreationOptional<Date | null>
    declare lastDailyAt: CreationOptional<Date | null>
    declare createdAt: CreationOptional<Date>
    declare updatedAt: CreationOptional<Date>
}

export function initMemberProfile(sequelize: Sequelize): typeof MemberProfile {
    MemberProfile.init(
        {
            id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
            guildId: { type: DataTypes.STRING, allowNull: false },
            userId: { type: DataTypes.STRING, allowNull: false },
            xp: { type: DataTypes.INTEGER, defaultValue: 0 },
            level: { type: DataTypes.INTEGER, defaultValue: 0 },
            balance: { type: DataTypes.INTEGER, defaultValue: 0 },
            lastMessageAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
            lastDailyAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'MemberProfile',
            tableName: 'member_profiles',
            indexes: [{ unique: true, fields: ['guildId', 'userId'] }]
        }
    )
    return MemberProfile
}
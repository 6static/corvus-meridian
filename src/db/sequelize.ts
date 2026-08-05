import { Sequelize } from 'sequelize'

export function createSequelize(storage: string): Sequelize {
    return new Sequelize({
        dialect: 'sqlite',
        storage,
        logging: false
    })
}
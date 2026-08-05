import { Client, GatewayIntentBits } from 'discord.js'
import { loadEnv } from './config/env.js'
import { createSequelize } from './db/sequelize.js'
import { initModels } from './db/models/index.js'
import { registerMessageCreateHandler } from './events/messageCreate.js'
import { registerInteractionCreateHandler } from './events/interactionCreate.js'

async function main(): Promise<void> {
    const env = loadEnv()

    const sequelize = createSequelize('corvus-meridian.sqlite')
    initModels(sequelize)
    await sequelize.sync()

    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            // GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers
        ]
    })

    registerMessageCreateHandler(client)
    registerInteractionCreateHandler(client)

    client.once('clientReady', () => {
        console.log(`Corva is online as ${client.user?.tag}`)
    })

    await client.login(env.discordToken)
}

main().catch((error) => {
    console.error('Fatal startup error:', error)
    process.exit(1)
})
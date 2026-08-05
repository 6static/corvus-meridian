import { REST, Routes } from 'discord.js'
import { loadEnv } from '../config/env.js'
import { allCommandData } from '../commands/index.js'

async function main(): Promise<void> {
    const env = loadEnv()
    const rest = new REST().setToken(env.discordToken)
    const body = allCommandData().map((cmd) => cmd.toJSON())

    await rest.put(Routes.applicationCommands(env.clientId), { body })
    console.log(`Registered ${body.length} slash commands.`)
}

main().catch((error) => {
    console.error('Failed to register commands:', error)
    process.exit(1)
})
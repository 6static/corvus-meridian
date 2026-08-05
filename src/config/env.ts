import 'dotenv/config'

export interface AppEnv {
    discordToken: string
    clientId: string
    nodeEnv: 'development' | 'production'
}

export function loadEnv(): AppEnv {
    const discordToken = process.env.DISCORD_TOKEN
    const clientId = process.env.DISCORD_CLIENT_ID

    if (!discordToken) {
        throw new Error('Missing required env var: DISCORD_TOKEN')
    }
    if (!clientId) {
        throw new Error('Missing required env var: DISCORD_CLIENT_ID')
    }

    return {
        discordToken,
        clientId,
        nodeEnv:
            process.env.NODE_ENV === 'production' ? 'production' : 'development'
    }
}

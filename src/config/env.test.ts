import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { loadEnv } from './env.js'

describe('loadEnv', () => {
    const ORIGINAL_ENV = process.env

    beforeEach(() => {
        process.env = { ...ORIGINAL_ENV }
    })

    afterEach(() => {
        process.env = ORIGINAL_ENV
    })

    it('throws when DISCORD_TOKEN is missing', () => {
        delete process.env.DISCORD_TOKEN
        process.env.DISCORD_CLIENT_ID = 'abc'
        expect(() => loadEnv()).toThrow('DISCORD_TOKEN')
    })

    it('throws when DISCORD_CLIENT_ID is missing', () => {
        process.env.DISCORD_TOKEN = 'token'
        delete process.env.DISCORD_CLIENT_ID
        expect(() => loadEnv()).toThrow('DISCORD_CLIENT_ID')
    })

    it('returns parsed env when both vars are present', () => {
        process.env.DISCORD_TOKEN = 'token'
        process.env.DISCORD_CLIENT_ID = 'abc'
        process.env.NODE_ENV = 'production'
        expect(loadEnv()).toEqual({
            discordToken: 'token',
            clientId: 'abc',
            nodeEnv: 'production'
        })
    })
})

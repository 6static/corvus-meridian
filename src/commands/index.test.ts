import { describe, it, expect } from 'vitest'
import { buildCommandMap } from './index.js'

describe('buildCommandMap', () => {
    it('registers every command by its slash command name, with no duplicates', () => {
        const map = buildCommandMap()
        const names = [...map.keys()]
        expect(new Set(names).size).toBe(names.length)
        for (const expected of ['level', 'leaderboard', 'balance', 'daily', 'shop', 'coinflip', 'slots', 'config']) {
            expect(names).toContain(expected)
        }
    })
})
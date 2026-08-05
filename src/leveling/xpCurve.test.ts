import { describe, it, expect } from 'vitest'
import { xpRequiredForLevel, totalXpForLevel, levelForTotalXp, xpProgress, didLevelUp } from './xpCurve.js'

describe('xpCurve', () => {
    it('computes XP required to advance from a given level', () => {
        expect(xpRequiredForLevel(0)).toBe(100)
        expect(xpRequiredForLevel(1)).toBe(155)
    })

    it('computes cumulative XP required to reach a level', () => {
        expect(totalXpForLevel(0)).toBe(0)
        expect(totalXpForLevel(1)).toBe(100)
        expect(totalXpForLevel(2)).toBe(255)
    })

    it('computes the level for a given total XP', () => {
        expect(levelForTotalXp(0)).toBe(0)
        expect(levelForTotalXp(99)).toBe(0)
        expect(levelForTotalXp(100)).toBe(1)
        expect(levelForTotalXp(254)).toBe(1)
        expect(levelForTotalXp(255)).toBe(2)
    })

    it('reports progress within the current level', () => {
        expect(xpProgress(150)).toEqual({ level: 1, currentLevelXp: 50, xpForNextLevel: 155 })
    })

    it('detects a level-up between two XP totals', () => {
        expect(didLevelUp(90, 100)).toBe(true)
        expect(didLevelUp(90, 99)).toBe(false)
        expect(didLevelUp(100, 100)).toBe(false)
    })
})
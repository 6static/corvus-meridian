import { describe, it, expect } from 'vitest'
import { playSlots } from './slots.js'

function fixedSequence(values: number[]): () => number {
    let i = 0
    return () => values[i++ % values.length]
}

describe('playSlots', () => {
    it('pays 20x for triple diamond', () => {
        const result = playSlots(10, fixedSequence([0.9, 0.9, 0.9]))
        expect(result.reels).toEqual(['💎', '💎', '💎'])
        expect(result.multiplier).toBe(20)
        expect(result.payout).toBe(200)
    })

    it('pays 10x for triple non-diamond match', () => {
        const result = playSlots(10, fixedSequence([0, 0, 0]))
        expect(result.reels).toEqual(['🍒', '🍒', '🍒'])
        expect(result.multiplier).toBe(10)
        expect(result.payout).toBe(100)
    })

    it('pays 2x for a partial match', () => {
        const result = playSlots(10, fixedSequence([0.9, 0.9, 0]))
        expect(result.reels).toEqual(['💎', '💎', '🍒'])
        expect(result.multiplier).toBe(2)
        expect(result.payout).toBe(20)
    })

    it('pays nothing when no reels match', () => {
        const result = playSlots(10, fixedSequence([0, 0.3, 0.9]))
        expect(result.reels).toEqual(['🍒', '🍋', '💎'])
        expect(result.multiplier).toBe(0)
        expect(result.payout).toBe(0)
    })
})
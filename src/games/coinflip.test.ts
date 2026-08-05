import { describe, it, expect } from 'vitest'
import { playCoinflip } from './coinflip.js'

describe('playCoinflip', () => {
    it('doubles the bet on a win', () => {
        const result = playCoinflip(100, 'heads', () => 0)
        expect(result).toEqual({ result: 'heads', won: true, payout: 200 })
    })

    it('pays nothing on a loss', () => {
        const result = playCoinflip(100, 'heads', () => 0.9)
        expect(result).toEqual({ result: 'tails', won: false, payout: 0 })
    })
})
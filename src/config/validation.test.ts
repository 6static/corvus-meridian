import { describe, it, expect } from 'vitest'
import { validatePositiveInteger, validateCurrencyName, InvalidConfigValueError } from './validation.js'

describe('validatePositiveInteger', () => {
    it('returns the value when it is a positive integer', () => {
        expect(validatePositiveInteger(5, 'XP rate')).toBe(5)
    })

    it('throws for zero or negative values', () => {
        expect(() => validatePositiveInteger(0, 'XP rate')).toThrow(InvalidConfigValueError)
        expect(() => validatePositiveInteger(-1, 'XP rate')).toThrow(InvalidConfigValueError)
    })

    it('throws for non-integer values', () => {
        expect(() => validatePositiveInteger(1.5, 'XP rate')).toThrow(InvalidConfigValueError)
    })
})

describe('validateCurrencyName', () => {
    it('trims and returns a valid name', () => {
        expect(validateCurrencyName('  Shards  ')).toBe('Shards')
    })

    it('throws for an empty name', () => {
        expect(() => validateCurrencyName('   ')).toThrow(InvalidConfigValueError)
    })

    it('throws for a name longer than 32 characters', () => {
        expect(() => validateCurrencyName('a'.repeat(33))).toThrow(InvalidConfigValueError)
    })
})
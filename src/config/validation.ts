export class InvalidConfigValueError extends Error {}

export function validatePositiveInteger(value: number, fieldName: string): number {
    if (!Number.isInteger(value) || value <= 0) {
        throw new InvalidConfigValueError(`${fieldName} must be a positive whole number`)
    }
    return value
}

export function validateCurrencyName(name: string): string {
    const trimmed = name.trim()
    if (trimmed.length < 1 || trimmed.length > 32) {
        throw new InvalidConfigValueError('Currency name must be 1-32 characters')
    }
    return trimmed
}
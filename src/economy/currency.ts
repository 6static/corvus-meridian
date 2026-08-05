import { MemberProfile } from '../db/models/index.js'
import { Transaction } from '../db/models/Transaction.js'

export class InsufficientFundsError extends Error {
    constructor(required: number, available: number) {
        super(`Insufficient funds: need ${required}, have ${available}`)
        this.name = 'InsufficientFundsError'
    }
}

async function getOrCreateProfile(guildId: string, userId: string): Promise<MemberProfile> {
    const [profile] = await MemberProfile.findOrCreate({ where: { guildId, userId } })
    return profile
}

export async function awardCurrency(guildId: string, userId: string, amount: number, reason: string): Promise<MemberProfile> {
    const profile = await getOrCreateProfile(guildId, userId)
    profile.balance += amount
    await profile.save()
    await Transaction.create({ guildId, userId, amount, reason })
    return profile
}

export async function spendCurrency(guildId: string, userId: string, amount: number, reason: string): Promise<MemberProfile> {
    const profile = await getOrCreateProfile(guildId, userId)
    if (profile.balance < amount) {
        throw new InsufficientFundsError(amount, profile.balance)
    }
    profile.balance -= amount
    await profile.save()
    await Transaction.create({ guildId, userId, amount: -amount, reason })
    return profile
}
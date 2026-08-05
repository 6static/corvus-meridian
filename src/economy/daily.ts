import { GuildConfig, MemberProfile } from '../db/models/index.js'
import { awardCurrency } from './currency.js'

export class DailyOnCooldownError extends Error {
    constructor(public readonly nextAvailableAt: Date) {
        super(`Daily reward already claimed. Next available at ${nextAvailableAt.toISOString()}`)
        this.name = 'DailyOnCooldownError'
    }
}

const DAY_MS = 24 * 60 * 60 * 1000

export async function claimDaily(
    guildId: string,
    userId: string,
    now: Date = new Date()
): Promise<{ amount: number; balance: number }> {
    const [config] = await GuildConfig.findOrCreate({ where: { guildId } })
    const [profile] = await MemberProfile.findOrCreate({ where: { guildId, userId } })

    if (profile.lastDailyAt) {
        const elapsed = now.getTime() - profile.lastDailyAt.getTime()
        if (elapsed < DAY_MS) {
            throw new DailyOnCooldownError(new Date(profile.lastDailyAt.getTime() + DAY_MS))
        }
    }

    profile.lastDailyAt = now
    await profile.save()

    const updated = await awardCurrency(guildId, userId, config.dailyAmount, 'daily')
    return { amount: config.dailyAmount, balance: updated.balance }
}
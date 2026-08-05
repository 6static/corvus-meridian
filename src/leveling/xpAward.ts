import { MemberProfile } from '../db/models/index.js'
import { levelForTotalXp } from './xpCurve.js'

export interface AwardXpResult {
    profile: MemberProfile
    leveledUp: boolean
    newLevel: number
}

export async function awardXp(guildId: string, userId: string, amount: number): Promise<AwardXpResult> {
    const [profile] = await MemberProfile.findOrCreate({ where: { guildId, userId } })
    profile.xp += amount
    const newLevel = levelForTotalXp(profile.xp)
    const leveledUp = newLevel > profile.level
    profile.level = newLevel
    await profile.save()
    return { profile, leveledUp, newLevel }
}
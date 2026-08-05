import { GuildConfig, MemberProfile } from '../db/models/index.js'
import { awardXp } from './xpAward.js'

export interface MessageXpResult {
    awarded: boolean
    leveledUp: boolean
    newLevel?: number
}

function isOnCooldown(lastMessageAt: Date | null, cooldownSeconds: number, now: Date): boolean {
    if (!lastMessageAt) return false
    return (now.getTime() - lastMessageAt.getTime()) / 1000 < cooldownSeconds
}

export async function processMessageXp(
    guildId: string,
    userId: string,
    isBot: boolean,
    now: Date = new Date()
): Promise<MessageXpResult> {
    if (isBot) {
        return { awarded: false, leveledUp: false }
    }

    const [config] = await GuildConfig.findOrCreate({ where: { guildId } })
    const [profile] = await MemberProfile.findOrCreate({ where: { guildId, userId } })

    if (isOnCooldown(profile.lastMessageAt, config.xpCooldownSeconds, now)) {
        return { awarded: false, leveledUp: false }
    }

    profile.lastMessageAt = now
    await profile.save()

    const { leveledUp, newLevel } = await awardXp(guildId, userId, config.xpPerMessage)

    return { awarded: true, leveledUp, newLevel: leveledUp ? newLevel : undefined }
}
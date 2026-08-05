export const SLOT_SYMBOLS = ['🍒', '🍋', '🔔', '⭐', '💎'] as const
export type SlotSymbol = (typeof SLOT_SYMBOLS)[number]

export interface SlotsResult {
    reels: [SlotSymbol, SlotSymbol, SlotSymbol]
    multiplier: number
    payout: number
}

function spinReel(random: () => number): SlotSymbol {
    return SLOT_SYMBOLS[Math.floor(random() * SLOT_SYMBOLS.length)]
}

export function playSlots(bet: number, random: () => number = Math.random): SlotsResult {
    const reels: [SlotSymbol, SlotSymbol, SlotSymbol] = [spinReel(random), spinReel(random), spinReel(random)]

    let multiplier = 0
    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        multiplier = reels[0] === '💎' ? 20 : 10
    } else if (reels[0] === reels[1] || reels[1] === reels[2] || reels[0] === reels[2]) {
        multiplier = 2
    }

    return { reels, multiplier, payout: bet * multiplier }
}
export function xpRequiredForLevel(level: number): number {
    return 5 * level * level + 50 * level + 100
}

export function totalXpForLevel(level: number): number {
    let total = 0
    for (let l = 0; l < level; l++) {
        total += xpRequiredForLevel(l)
    }
    return total
}

export function levelForTotalXp(totalXp: number): number {
    let level = 0
    while (totalXp >= totalXpForLevel(level + 1)) {
        level++
    }
    return level
}

export interface XpProgress {
    level: number
    currentLevelXp: number
    xpForNextLevel: number
}

export function xpProgress(totalXp: number): XpProgress {
    const level = levelForTotalXp(totalXp)
    return {
        level,
        currentLevelXp: totalXp - totalXpForLevel(level),
        xpForNextLevel: xpRequiredForLevel(level)
    }
}

export function didLevelUp(oldTotalXp: number, newTotalXp: number): boolean {
    return levelForTotalXp(newTotalXp) > levelForTotalXp(oldTotalXp)
}
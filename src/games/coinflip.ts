export type CoinSide = 'heads' | 'tails'

export interface CoinflipResult {
    result: CoinSide
    won: boolean
    payout: number
}

export function playCoinflip(bet: number, choice: CoinSide, random: () => number = Math.random): CoinflipResult {
    const result: CoinSide = random() < 0.5 ? 'heads' : 'tails'
    const won = result === choice
    return { result, won, payout: won ? bet * 2 : 0 }
}
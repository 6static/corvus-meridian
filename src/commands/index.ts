import type { CommandModule } from '../types/command.js'
import * as level from './level.js'
import * as leaderboard from './leaderboard.js'
import * as balance from './balance.js'
import * as daily from './daily.js'
import * as shop from './shop.js'
import * as coinflip from './coinflip.js'
import * as slots from './slots.js'
import * as config from './config.js'

const modules: CommandModule[] = [level, leaderboard, balance, daily, shop, coinflip, slots, config]

export function buildCommandMap(): Map<string, CommandModule> {
    const map = new Map<string, CommandModule>()
    for (const mod of modules) {
        map.set(mod.data.name, mod)
    }
    return map
}

export function allCommandData(): CommandModule['data'][] {
    return modules.map((mod) => mod.data)
}
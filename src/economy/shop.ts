import { ShopItem } from '../db/models/ShopItem.js'
import { Inventory } from '../db/models/Inventory.js'
import { spendCurrency } from './currency.js'

export class ItemNotFoundError extends Error {
    constructor(name: string) {
        super(`No shop item named "${name}" in this server`)
        this.name = 'ItemNotFoundError'
    }
}

export interface PurchaseResult {
    item: ShopItem
    balance: number
}

export async function listShopItems(guildId: string): Promise<ShopItem[]> {
    return ShopItem.findAll({ where: { guildId }, order: [['price', 'ASC']] })
}

export async function buyItem(guildId: string, userId: string, itemName: string): Promise<PurchaseResult> {
    const item = await ShopItem.findOne({ where: { guildId, name: itemName } })
    if (!item) {
        throw new ItemNotFoundError(itemName)
    }

    const profile = await spendCurrency(guildId, userId, item.price, `shop:${item.name}`)

    if (item.type === 'consumable') {
        const [entry] = await Inventory.findOrCreate({
            where: { guildId, userId, shopItemId: item.id },
            defaults: { guildId, userId, shopItemId: item.id, quantity: 0 }
        })
        entry.quantity += 1
        await entry.save()
    }

    return { item, balance: profile.balance }
}
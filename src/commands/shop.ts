import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js'
import { listShopItems, buyItem, ItemNotFoundError } from '../economy/shop.js'
import { InsufficientFundsError } from '../economy/currency.js'
import { GuildConfig } from '../db/models/index.js'

export const data = new SlashCommandBuilder()
    .setName('shop')
    .setDescription('Browse or buy from the server shop')
    .addSubcommand((sub) => sub.setName('list').setDescription('List items for sale'))
    .addSubcommand((sub) =>
        sub
            .setName('buy')
            .setDescription('Buy an item')
            .addStringOption((opt) => opt.setName('item').setDescription('Item name').setRequired(true))
    )

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const sub = interaction.options.getSubcommand()

    if (sub === 'list') {
        const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })
        const items = await listShopItems(interaction.guildId)
        if (items.length === 0) {
            await interaction.reply('This server has no shop items yet.')
            return
        }
        await interaction.reply(items.map((i) => `**${i.name}** — ${i.price} ${config.currencyName}`).join('\n'))
        return
    }

    const itemName = interaction.options.getString('item', true)
    try {
        const result = await buyItem(interaction.guildId, interaction.user.id, itemName)
        if (result.item.type === 'role' && result.item.roleId) {
            const member = await interaction.guild?.members.fetch(interaction.user.id)
            await member?.roles.add(result.item.roleId)
        }
        await interaction.reply(`Bought **${result.item.name}**. Balance: **${result.balance}**.`)
    } catch (error) {
        if (error instanceof ItemNotFoundError || error instanceof InsufficientFundsError) {
            await interaction.reply({ content: error.message, ephemeral: true })
            return
        }
        throw error
    }
}
import { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } from 'discord.js'
import { GuildConfig } from '../db/models/index.js'
import { RoleReward } from '../db/models/RoleReward.js'
import { ShopItem } from '../db/models/ShopItem.js'
import { validatePositiveInteger, validateCurrencyName, InvalidConfigValueError } from '../config/validation.js'

export const data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configure Corva for this server')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .addSubcommand((sub) =>
        sub
            .setName('xp-rate')
            .setDescription('Set XP awarded per message')
            .addIntegerOption((o) => o.setName('amount').setDescription('XP per message').setRequired(true))
    )
    .addSubcommand((sub) =>
        sub
            .setName('currency-name')
            .setDescription('Set the currency name')
            .addStringOption((o) => o.setName('name').setDescription('Currency name').setRequired(true))
    )
    .addSubcommand((sub) =>
        sub
            .setName('daily-amount')
            .setDescription('Set the /daily reward amount')
            .addIntegerOption((o) => o.setName('amount').setDescription('Daily reward').setRequired(true))
    )
    .addSubcommand((sub) =>
        sub
            .setName('add-role-reward')
            .setDescription('Grant a role automatically at a level')
            .addIntegerOption((o) => o.setName('level').setDescription('Level threshold').setRequired(true))
            .addRoleOption((o) => o.setName('role').setDescription('Role to grant').setRequired(true))
    )
    .addSubcommand((sub) =>
        sub
            .setName('add-shop-item')
            .setDescription('Add an item to the shop')
            .addStringOption((o) => o.setName('name').setDescription('Item name').setRequired(true))
            .addIntegerOption((o) => o.setName('price').setDescription('Price').setRequired(true))
            .addRoleOption((o) => o.setName('role').setDescription('Role to grant (omit for a consumable item)').setRequired(false))
    )

export async function execute(interaction: ChatInputCommandInteraction): Promise<void> {
    if (!interaction.guildId) return
    const sub = interaction.options.getSubcommand()

    try {
        const [config] = await GuildConfig.findOrCreate({ where: { guildId: interaction.guildId } })

        switch (sub) {
            case 'xp-rate': {
                config.xpPerMessage = validatePositiveInteger(interaction.options.getInteger('amount', true), 'XP rate')
                await config.save()
                await interaction.reply(`XP per message set to **${config.xpPerMessage}**.`)
                break
            }
            case 'currency-name': {
                config.currencyName = validateCurrencyName(interaction.options.getString('name', true))
                await config.save()
                await interaction.reply(`Currency name set to **${config.currencyName}**.`)
                break
            }
            case 'daily-amount': {
                config.dailyAmount = validatePositiveInteger(interaction.options.getInteger('amount', true), 'Daily amount')
                await config.save()
                await interaction.reply(`Daily reward set to **${config.dailyAmount}**.`)
                break
            }
            case 'add-role-reward': {
                const level = validatePositiveInteger(interaction.options.getInteger('level', true), 'Level')
                const role = interaction.options.getRole('role', true)
                await RoleReward.create({ guildId: interaction.guildId, level, roleId: role.id })
                await interaction.reply(`Members will now receive **${role.name}** at level **${level}**.`)
                break
            }
            case 'add-shop-item': {
                const name = interaction.options.getString('name', true)
                const price = validatePositiveInteger(interaction.options.getInteger('price', true), 'Price')
                const role = interaction.options.getRole('role', false)
                await ShopItem.create({
                    guildId: interaction.guildId,
                    name,
                    price,
                    type: role ? 'role' : 'consumable',
                    roleId: role?.id ?? null
                })
                await interaction.reply(`Added **${name}** to the shop for **${price}**.`)
                break
            }
        }
    } catch (error) {
        if (error instanceof InvalidConfigValueError) {
            await interaction.reply({ content: error.message, ephemeral: true })
            return
        }
        throw error
    }
}
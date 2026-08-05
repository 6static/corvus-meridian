import { Events, Message, Client } from 'discord.js'
import { processMessageXp } from '../leveling/messageXp.js'
import { applyRoleRewardsForLevel } from '../leveling/roleRewards.js'

export function registerMessageCreateHandler(client: Client): void {
    client.on(Events.MessageCreate, async (message: Message) => {
        if (!message.guild) return

        const result = await processMessageXp(message.guild.id, message.author.id, message.author.bot)

        if (result.leveledUp && result.newLevel !== undefined) {
            await message.channel.send(`🎉 <@${message.author.id}> reached level **${result.newLevel}**!`)

            const member = await message.guild.members.fetch(message.author.id)
            await applyRoleRewardsForLevel(
                {
                    guildId: message.guild.id,
                    addRole: async (roleId) => {
                        await member.roles.add(roleId)
                    }
                },
                result.newLevel
            )
        }
    })
}
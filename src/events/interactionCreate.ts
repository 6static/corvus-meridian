import { Events, Client } from 'discord.js'
import { buildCommandMap } from '../commands/index.js'

export function registerInteractionCreateHandler(client: Client): void {
    const commands = buildCommandMap()

    client.on(Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand()) return

        const command = commands.get(interaction.commandName)
        if (!command) return

        try {
            await command.execute(interaction)
        } catch (error) {
            console.error(`Error executing /${interaction.commandName}:`, error)
            const errorReply = { content: 'Something went wrong running that command.', ephemeral: true }
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorReply)
            } else {
                await interaction.reply(errorReply)
            }
        }
    })
}
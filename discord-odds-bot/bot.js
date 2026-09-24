import { Client, Events, GatewayIntentBits } from 'discord.js'
import { oddsMessage } from './odds.js'

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, (c) => console.log(`Logged in as ${c.user.tag}`))

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== 'odds') return
  await interaction.deferReply() // the odds call can take a second or two
  try {
    const text = await oddsMessage(interaction.options.getString('league'), interaction.options.getString('team'))
    await interaction.editReply(text)
  } catch (err) {
    console.error('odds command failed:', err)
    await interaction.editReply("Couldn't load odds right now. Try again in a minute.")
  }
})

client.login(process.env.DISCORD_TOKEN)

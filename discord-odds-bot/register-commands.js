// Run once (npm run register) to add /odds to Discord. Global commands can take up to an hour to appear.
import { REST, Routes, SlashCommandBuilder } from 'discord.js'
import { LEAGUES } from './odds.js'

const command = new SlashCommandBuilder()
  .setName('odds')
  .setDescription('Best moneyline across US sportsbooks for upcoming games')
  .addStringOption((o) => o.setName('league').setDescription('League').setRequired(true)
    .addChoices(...Object.entries(LEAGUES).map(([value, name]) => ({ name, value }))))
  .addStringOption((o) => o.setName('team').setDescription('Only games for this team, e.g. Packers'))

const rest = new REST().setToken(process.env.DISCORD_TOKEN)
await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: [command.toJSON()] })
console.log('Registered /odds')

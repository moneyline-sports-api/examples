# Sports betting Discord bot

A Discord bot with an `/odds` slash command that posts the best moneyline across US sportsbooks for upcoming games, optionally for one team.

Tutorial: [Build a sports betting Discord bot](https://www.moneylineapp.com/examples/sports-betting-discord-bot)

## Set up

1. Create an application and a bot in the [Discord Developer Portal](https://discord.com/developers/applications), and copy its token and application ID.
2. Invite the bot to your server with the `applications.commands` and `bot` scopes.
3. Install and register the command:

   ```bash
   npm install
   export DISCORD_TOKEN=your-bot-token DISCORD_CLIENT_ID=your-application-id MONEYLINE_API_KEY=your-key
   npm run register
   npm start
   ```

Then type `/odds league:NFL team:Packers` in your server.

Each league costs 1 credit per lookup. The bot reuses results for 5 minutes, so a busy server doesn't spend more.

## Sample reply

```
Best NFL moneylines

Thu 8:15 PM
Atlanta Falcons +210 (Bally Bet) at Green Bay Packers -245 (BetAnything)
```

# Player prop hit-rate dashboard (Next.js)

Shows each player's main sportsbook line for a stat, and how often they went over it in their last 5, 10 and 25 games and this season.

Tutorial: [Build a player props hit-rate dashboard](https://www.moneylineapp.com/examples/player-props-hit-rate-dashboard)

## Run it

```bash
npm install
export MONEYLINE_API_KEY=your-key
npm run dev
```

Open http://localhost:3000. Boards cover NFL receptions and rushing yards, NBA points and MLB hits.

Each board costs about 75 credits: one props call (25) plus one hit-rate call per player (4 each, for 12 players). The page caches each board for an hour.

# Live sports scoreboard (React)

Today's games and scores for each league. It refreshes every minute while a game is in progress and every 10 minutes otherwise.

Tutorial: [Build a live sports scoreboard with React](https://www.moneylineapp.com/examples/live-sports-scores-react)

## Run it

```bash
npm install
echo "MONEYLINE_API_KEY=your-key" > .env.local
npm run dev
```

The Vite dev server forwards `/api` requests to MoneyLine and adds your key there, so the browser never sees it. In production, do the same from your own backend or an edge function.

Each refresh costs 2 credits.

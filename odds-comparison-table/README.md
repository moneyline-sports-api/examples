# Odds comparison table (Next.js)

A page that shows every sportsbook's moneyline for upcoming games, with the best price for each team highlighted.

Tutorial: [Build an odds comparison site with Next.js](https://www.moneylineapp.com/examples/odds-comparison-site-nextjs)

## Run it

```bash
npm install
export MONEYLINE_API_KEY=your-key
npm run dev
```

Open http://localhost:3000 and switch leagues with the buttons.

The page renders on the server, so your key never reaches the browser. It fetches each league at most once every 5 minutes, at 18 credits a call. Raise `revalidate` in `app/page.tsx` to spend less.

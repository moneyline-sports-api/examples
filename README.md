# MoneyLine Sports API examples

Ten small, working projects built on [MoneyLine Sports API](https://www.moneylineapp.com): live odds, player props, hit rates, +EV and arbitrage signals, and scores for NFL, NBA, MLB, NHL, college football and basketball, EPL, MLS and the World Cup.

Each folder runs on its own and has a step-by-step tutorial on moneylineapp.com.

| Example | What it builds | Stack | Credits per run | Tutorial |
|---|---|---|---|---|
| [ev-finder](ev-finder) | Lists positive expected value bets across US sportsbooks | Python | 1 | [Find +EV bets](https://www.moneylineapp.com/examples/positive-ev-betting-finder) |
| [arbitrage-finder](arbitrage-finder) | Finds guaranteed-profit bets and sizes both stakes | Python | 1 | [Sports arbitrage finder](https://www.moneylineapp.com/examples/sports-arbitrage-finder) |
| [line-movement-tracker](line-movement-tracker) | Charts how a game's moneyline moved from open to now | Python | 3 | [Track line movement](https://www.moneylineapp.com/examples/betting-line-movement-tracker) |
| [fantasy-lineup-helper](fantasy-lineup-helper) | Projects fantasy points from sportsbook prop lines | Python | 75 to 150 | [Fantasy projections from props](https://www.moneylineapp.com/examples/fantasy-projections-from-prop-lines) |
| [game-prediction-notebook](game-prediction-notebook) | Builds an NFL Elo model and compares it with the market | Jupyter | about 40 | [NFL prediction model](https://www.moneylineapp.com/examples/nfl-prediction-model-with-odds) |
| [discord-odds-bot](discord-odds-bot) | A `/odds` slash command with the best line per team | Node | 18 per league, cached 5 min | [Discord odds bot](https://www.moneylineapp.com/examples/sports-betting-discord-bot) |
| [odds-comparison-table](odds-comparison-table) | An odds comparison page with the best price highlighted | Next.js | 18 per league, cached 5 min | [Odds comparison site](https://www.moneylineapp.com/examples/odds-comparison-site-nextjs) |
| [hit-rate-dashboard](hit-rate-dashboard) | How often players cleared their prop line | Next.js | about 75 per board, cached 1 hour | [Hit-rate dashboard](https://www.moneylineapp.com/examples/player-props-hit-rate-dashboard) |
| [live-scoreboard](live-scoreboard) | Today's scores, refreshing while games are live | React + Vite | 2 per refresh | [Live scoreboard](https://www.moneylineapp.com/examples/live-sports-scores-react) |
| [mobile-odds-app](mobile-odds-app) | A phone app with the best moneyline per game | Expo (React Native) | 18 per league | [Mobile odds app](https://www.moneylineapp.com/examples/sports-odds-app-react-native) |

## Before you start

1. [Get a free API key](https://www.moneylineapp.com/signup). The free plan includes 1,000 credits a month.
2. Put it in your environment:

   ```bash
   export MONEYLINE_API_KEY=your-key
   ```

3. Open an example's folder and follow its README.

The Python examples need Python 3.9 or later and the Node examples need Node 18 or later. They use the official SDKs, [`moneyline-sports-api`](https://www.npmjs.com/package/moneyline-sports-api) on npm and [`moneyline-sports-api`](https://pypi.org/project/moneyline-sports-api/) on PyPI.

## Keep your key on a server

Anything shipped to a browser or a phone can be read by the people using it. The web and mobile examples show how to keep the key server-side, and the mobile app says clearly where it takes a shortcut for prototyping.

## Coverage and docs

- What's covered right now: [moneylineapp.com/coverage](https://www.moneylineapp.com/coverage)
- API reference: [moneylineapp.com/docs](https://www.moneylineapp.com/docs)

Found a problem or want another example? [Open an issue](https://github.com/moneyline-sports-api/examples/issues).

MIT licensed.

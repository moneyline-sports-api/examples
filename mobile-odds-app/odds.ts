import { MoneyLine } from 'moneyline-sports-api'

// Prototype only: anything in an app bundle can be read by the people who install it.
// Before you ship, call your own backend and keep the key there.
const ml = new MoneyLine({ apiKey: process.env.EXPO_PUBLIC_MONEYLINE_API_KEY })

type Outcome = { name: string; price: number }
type Game = {
  eventId: string; startTime: string; homeTeamName: string; awayTeamName: string
  bookmakers: { bookmakerName: string; sourceType: string; markets: { outcomes: Outcome[] }[] }[]
}
type Side = { team: string; price: number | null; book: string | null }
export type GameLine = { eventId: string; startTime: string; books: number; away: Side; home: Side }

function best(game: Game, team: string): Side {
  let side: Side = { team, price: null, book: null }
  for (const book of game.bookmakers) {
    const price = book.markets.flatMap((m) => m.outcomes).find((o) => o.name === team)?.price
    if (price != null && (side.price == null || price > side.price)) side = { team, price, book: book.bookmakerName }
  }
  return side
}

// Best moneyline for each side of the next 20 games (one call, 1 credit).
export async function bestMoneylines(league: string): Promise<GameLine[]> {
  const games = (await ml.odds({ league, market: 'moneyline', sourceType: 'sportsbook' })) as Game[]
  const now = Date.now()
  return games
    .filter((g) => new Date(g.startTime).getTime() > now)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 20)
    .map((g) => ({ eventId: g.eventId, startTime: g.startTime, books: g.bookmakers.length, away: best(g, g.awayTeamName), home: best(g, g.homeTeamName) }))
}

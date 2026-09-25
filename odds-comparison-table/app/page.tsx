import { MoneyLine } from 'moneyline-sports-api'

// The key stays on the server: this page renders on the server and the browser never sees it.
const ml = new MoneyLine() // reads MONEYLINE_API_KEY
export const revalidate = 300 // one odds call (1 credit) per league every 5 minutes at most

const LEAGUES = { nfl: 'NFL', nba: 'NBA', mlb: 'MLB', nhl: 'NHL', ncaa_football: 'College Football' } as const
type League = keyof typeof LEAGUES

type Outcome = { name: string; price: number }
type Book = { bookmakerId: string; bookmakerName: string; markets: { outcomes: Outcome[] }[] }
type Game = { eventId: string; startTime: string; homeTeamName: string; awayTeamName: string; bookmakers: Book[] }

const fmt = (p?: number) => (p == null ? '' : p > 0 ? `+${p}` : String(p))

function priceAt(book: Book, team: string) {
  return book.markets.flatMap((m) => m.outcomes).find((o) => o.name === team)?.price
}

export default async function Page({ searchParams }: { searchParams: Promise<{ league?: string }> }) {
  const requested = (await searchParams).league
  const league: League = requested && requested in LEAGUES ? (requested as League) : 'nfl'
  const games = ((await ml.odds({ league, market: 'moneyline', sourceType: 'sportsbook' })) as Game[])
    .filter((g) => new Date(g.startTime) > new Date())
    .sort((a, b) => a.startTime.localeCompare(b.startTime))
    .slice(0, 15)

  // One column per sportsbook, busiest books first.
  const counts = new Map<string, number>()
  for (const g of games) for (const b of g.bookmakers) counts.set(b.bookmakerName, (counts.get(b.bookmakerName) ?? 0) + 1)
  const books = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([name]) => name)

  return (
    <main>
      <h1>{LEAGUES[league]} moneyline odds comparison</h1>
      <p>Every sportsbook&apos;s price for the next {games.length} games. The best price for each team is highlighted.</p>
      <nav>
        {Object.entries(LEAGUES).map(([id, name]) => (
          <a key={id} href={`/?league=${id}`} aria-current={id === league ? 'page' : undefined}>{name}</a>
        ))}
      </nav>
      <div className="scroll">
        <table>
          <thead>
            <tr><th>Team</th>{books.map((b) => <th key={b}>{b}</th>)}</tr>
          </thead>
          <tbody>
            {games.flatMap((g) => [g.awayTeamName, g.homeTeamName].map((team, i) => {
              const prices = books.map((name) => {
                const book = g.bookmakers.find((b) => b.bookmakerName === name)
                return book ? priceAt(book, team) : undefined
              })
              const best = Math.max(...prices.filter((p): p is number => p != null))
              return (
                <tr key={`${g.eventId}-${team}`}>
                  <td>
                    {team}
                    {i === 0 && <div className="time">{new Date(g.startTime).toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</div>}
                  </td>
                  {prices.map((p, j) => <td key={books[j]} className={p === best ? 'best' : undefined}>{fmt(p)}</td>)}
                </tr>
              )
            }))}
          </tbody>
        </table>
      </div>
      <p className="time">Odds from <a href="https://www.moneylineapp.com">MoneyLine Sports API</a>.</p>
    </main>
  )
}

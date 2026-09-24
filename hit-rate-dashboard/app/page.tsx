import { MoneyLine } from 'moneyline-sports-api'

const ml = new MoneyLine() // reads MONEYLINE_API_KEY; stays on the server
// One props call (25 credits) plus one hit-rate call per player (4 credits each), cached for an hour.
export const revalidate = 3600
const PLAYERS = 12

const BOARDS = {
  'nfl-receptions': { league: 'nfl', market: 'player_receptions', label: 'NFL receptions' },
  'nfl-rush-yds': { league: 'nfl', market: 'player_rush_yds', label: 'NFL rushing yards' },
  'nba-points': { league: 'nba', market: 'player_points', label: 'NBA points' },
  'mlb-hits': { league: 'mlb', market: 'batter_hits', label: 'MLB hits' },
} as const
type BoardId = keyof typeof BOARDS

type Offer = { bookmakerId: string; sourceType: string; selection: string; price: number }
type Line = { point: number; offers: Offer[] }
type PropGame = { homeTeamName: string; awayTeamName: string; players: { playerId: string; playerName: string; markets: { marketType: string; isAlternate?: boolean; lines: Line[] }[] }[] }
type Window = { games: number; hits: number; rate: number } | null
type HitRates = { hitRates: { L5: Window; L10: Window; L25: Window; season: Window } }

// The player's main line: the one the most sportsbooks quote.
function mainLine(lines: Line[]) {
  const books = (l: Line) => new Set(l.offers.filter((o) => o.sourceType === 'sportsbook').map((o) => o.bookmakerId)).size
  return [...lines].sort((a, b) => books(b) - books(a))[0]
}

async function board(id: BoardId) {
  const { league, market } = BOARDS[id]
  const games = (await ml.playerProps({ league, market })) as PropGame[]
  const players = games.flatMap((g) => g.players.flatMap((p) => {
    const m = p.markets.find((x) => x.marketType === market && !x.isAlternate)
    const line = m && mainLine(m.lines)
    if (!line) return []
    const books = new Set(line.offers.map((o) => o.bookmakerId)).size
    return [{ ...p, line: line.point, books, game: `${g.awayTeamName} at ${g.homeTeamName}` }]
  }))
  // The most widely priced players first; each one costs a hit-rate call.
  const top = players.sort((a, b) => b.books - a.books).slice(0, PLAYERS)
  return Promise.all(top.map(async (p) => ({
    ...p,
    rates: ((await ml.hitRates(p.playerId, { market, line: p.line })) as HitRates).hitRates,
  })))
}

function Rate({ label, w }: { label: string; w: Window }) {
  if (!w || !w.games) return <div><div className="muted">{label}</div>—</div>
  return (
    <div className={w.rate >= 0.6 ? 'hot' : undefined}>
      <div className="muted">{label}</div>
      <strong>{w.hits}/{w.games}</strong> <span className="muted">{Math.round(w.rate * 100)}%</span>
      <div className="bar"><span style={{ width: `${w.rate * 100}%` }} /></div>
    </div>
  )
}

export default async function Page({ searchParams }: { searchParams: Promise<{ board?: string }> }) {
  const requested = (await searchParams).board
  const id: BoardId = requested && requested in BOARDS ? (requested as BoardId) : 'nfl-receptions'
  const rows = await board(id)

  return (
    <main>
      <h1>{BOARDS[id].label}: how often players go over</h1>
      <p className="muted">Each player&apos;s main sportsbook line and how often they cleared it in their last 5, 10 and 25 games and this season.</p>
      <nav>
        {Object.entries(BOARDS).map(([key, b]) => (
          <a key={key} href={`/?board=${key}`} aria-current={key === id ? 'page' : undefined}>{b.label}</a>
        ))}
      </nav>
      {rows.length === 0 && <p>No lines posted for this market right now.</p>}
      {rows.map((p) => (
        <div className="card" key={p.playerId}>
          <div className="head">
            <strong>{p.playerName}: over {p.line}</strong>
            <span className="muted">{p.game} · {p.books} books</span>
          </div>
          <div className="windows">
            <Rate label="Last 5" w={p.rates.L5} />
            <Rate label="Last 10" w={p.rates.L10} />
            <Rate label="Last 25" w={p.rates.L25} />
            <Rate label="Season" w={p.rates.season} />
          </div>
        </div>
      ))}
      <p className="muted">Data from <a href="https://www.moneylineapp.com">MoneyLine Sports API</a>.</p>
    </main>
  )
}

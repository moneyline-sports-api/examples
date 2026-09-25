import { useEffect, useState } from 'react'

const LEAGUES = { nfl: 'NFL', mlb: 'MLB', nba: 'NBA', nhl: 'NHL', ncaa_football: 'College Football', soccer_mls: 'MLS' }
// Each refresh costs 1 credit: check every minute while a game is live, every 10 minutes otherwise.
const LIVE_MS = 60 * 1000
const IDLE_MS = 10 * 60 * 1000

async function todaysGames(league) {
  const res = await fetch(`/api/v1/events/today?league=${league}`)
  const body = await res.json()
  if (!body.success) throw new Error(body.error?.message || `HTTP ${res.status}`)
  return body.data.sort((a, b) => a.startTime.localeCompare(b.startTime))
}

function useScores(league) {
  const [state, setState] = useState({ games: [], error: null, updatedAt: null })
  useEffect(() => {
    let timer
    let cancelled = false
    const load = async () => {
      try {
        const games = await todaysGames(league)
        if (cancelled) return
        setState({ games, error: null, updatedAt: new Date() })
        timer = setTimeout(load, games.some((g) => g.status === 'in_progress') ? LIVE_MS : IDLE_MS)
      } catch (err) {
        if (cancelled) return
        setState((s) => ({ ...s, error: err.message }))
        timer = setTimeout(load, IDLE_MS)
      }
    }
    load()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [league])
  return state
}

function status(game) {
  if (game.status === 'in_progress') return [game.period, game.clock].filter(Boolean).join(' · ') || 'Live'
  if (game.status === 'final') return 'Final'
  return new Date(game.startTime).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
}

function Game({ game }) {
  const started = game.status !== 'scheduled'
  const row = (team, score, won) => (
    <div className={`team${won ? ' won' : ''}`}>
      <span>{team}</span>
      <span className="score">{started ? score : ''}</span>
    </div>
  )
  const { home, away } = game.scores ?? {}
  return (
    <div className={`game ${game.status}`}>
      <div className="status">{status(game)}</div>
      {row(game.awayTeamName, away, game.status === 'final' && away > home)}
      {row(game.homeTeamName, home, game.status === 'final' && home > away)}
    </div>
  )
}

export default function App() {
  const [league, setLeague] = useState('mlb')
  const { games, error, updatedAt } = useScores(league)
  return (
    <main>
      <h1>Today&apos;s scores</h1>
      <nav>
        {Object.entries(LEAGUES).map(([id, name]) => (
          <button key={id} onClick={() => setLeague(id)} aria-pressed={id === league}>{name}</button>
        ))}
      </nav>
      {error && <p className="error">Couldn&apos;t load scores: {error}</p>}
      {!error && updatedAt && games.length === 0 && <p>No {LEAGUES[league]} games today.</p>}
      <div className="grid">{games.map((g) => <Game key={g.eventId} game={g} />)}</div>
      {updatedAt && <p className="muted">Updated {updatedAt.toLocaleTimeString()} · Scores from MoneyLine Sports API</p>}
    </main>
  )
}

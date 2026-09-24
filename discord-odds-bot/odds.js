import { MoneyLine } from 'moneyline-sports-api'

const ml = new MoneyLine() // reads MONEYLINE_API_KEY
const CACHE_MS = 5 * 60 * 1000 // one odds call costs 18 credits, so share results for 5 minutes
const cache = new Map()

export const LEAGUES = { nfl: 'NFL', nba: 'NBA', mlb: 'MLB', nhl: 'NHL', ncaa_football: 'College Football', ncaa_basketball: 'College Basketball', soccer_epl: 'Premier League', soccer_mls: 'MLS' }

async function moneylines(league) {
  const hit = cache.get(league)
  if (hit && Date.now() - hit.at < CACHE_MS) return hit.games
  const games = await ml.odds({ league, market: 'moneyline', sourceType: 'sportsbook' })
  cache.set(league, { at: Date.now(), games })
  return games
}

// Best price for one team across every sportsbook.
function bestPrice(game, team) {
  let best = null
  for (const book of game.bookmakers) {
    for (const market of book.markets) {
      const outcome = market.outcomes.find((o) => o.name === team)
      if (outcome && (!best || outcome.price > best.price)) best = { price: outcome.price, book: book.bookmakerName }
    }
  }
  return best
}

const fmt = (p) => (p > 0 ? `+${p}` : String(p))
const side = (game, team) => {
  const best = bestPrice(game, team)
  return best ? `**${team}** ${fmt(best.price)} (${best.book})` : `**${team}** no price yet`
}

// Returns the message text for /odds: the next few games, optionally for one team.
export async function oddsMessage(league, team, limit = 5) {
  const now = Date.now()
  const games = (await moneylines(league))
    .filter((g) => new Date(g.startTime).getTime() > now)
    .filter((g) => !team || `${g.homeTeamName} ${g.awayTeamName}`.toLowerCase().includes(team.toLowerCase()))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, limit)
  if (!games.length) return team ? `No upcoming ${LEAGUES[league]} games found for "${team}".` : `No upcoming ${LEAGUES[league]} games are priced right now.`

  const lines = games.map((g) => {
    const when = `<t:${Math.floor(new Date(g.startTime).getTime() / 1000)}:f>` // Discord shows it in each reader's time zone
    return `${when}\n${side(g, g.awayTeamName)} at ${side(g, g.homeTeamName)}`
  })
  return `**Best ${LEAGUES[league]} moneylines**\n\n${lines.join('\n\n')}\n\n-# Odds from MoneyLine Sports API`
}

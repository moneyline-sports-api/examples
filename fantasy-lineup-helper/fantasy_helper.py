"""Project fantasy points from sportsbook player-prop lines with MoneyLine Sports API.

Sportsbook prop lines are the market's median guess for each stat, so they make a quick,
well-informed fantasy projection.

Usage:
    export MONEYLINE_API_KEY=your-key
    python fantasy_helper.py --league nfl --top 25
    python fantasy_helper.py --league nba
"""
import argparse
from collections import Counter, defaultdict

from moneyline_sports_api import MoneyLine

# Points per unit of each stat. NFL is full-PPR; NBA follows common daily-fantasy scoring.
SCORING = {
    "nfl": {
        "player_pass_yds": 0.04,
        "player_pass_tds": 4,
        "player_rush_yds": 0.1,
        "player_reception_yds": 0.1,
        "player_receptions": 1,
        "player_anytime_td": 6,  # scored as the chance of at least one rushing or receiving TD
    },
    "nba": {
        "player_points": 1,
        "player_rebounds": 1.25,
        "player_assists": 1.5,
    },
}


def main_line(lines):
    """The line most sportsbooks quote for this player and stat."""
    counts = Counter()
    for line in lines:
        books = {o["bookmakerId"] for o in line["offers"] if o["sourceType"] == "sportsbook"}
        counts[line["point"]] += len(books)
    return counts.most_common(1)[0][0] if counts else None


def yes_probability(lines):
    """Average implied chance of 'Yes' across sportsbooks, for yes/no props like anytime TD."""
    probs = [o["impliedProbability"] for line in lines for o in line["offers"]
             if o["sourceType"] == "sportsbook" and o["selection"] == "Yes"]
    return sum(probs) / len(probs) if probs else None


def project(ml, league):
    """Return {player: {stat: value}} from one props call per stat (25 credits each)."""
    stats = defaultdict(dict)
    for market in SCORING[league]:
        for game in ml.player_props(league=league, market=market, limit=50):
            for player in game["players"]:
                for m in player["markets"]:
                    if m["marketType"] != market or m.get("isAlternate"):
                        continue
                    value = yes_probability(m["lines"]) if m["format"] == "yes_no" else main_line(m["lines"])
                    if value is not None:
                        stats[player["playerName"]][market] = value
    return stats


def label(market):
    return market.split("_", 1)[1].replace("_", " ")  # player_pass_yds -> pass yds


def fantasy_points(player_stats, scoring):
    return sum(value * scoring[market] for market, value in player_stats.items())


def main():
    parser = argparse.ArgumentParser(description="Rank players by fantasy points projected from prop lines.")
    parser.add_argument("--league", choices=sorted(SCORING), default="nfl")
    parser.add_argument("--top", type=int, default=25, help="how many players to show (default: 25)")
    args = parser.parse_args()

    ml = MoneyLine()  # reads MONEYLINE_API_KEY
    scoring = SCORING[args.league]
    stats = project(ml, args.league)
    ranked = sorted(stats.items(), key=lambda kv: fantasy_points(kv[1], scoring), reverse=True)

    print(f"{'Proj':>6}  Player                     Based on")
    for name, player_stats in ranked[: args.top]:
        parts = ", ".join(f"{label(m)} {v:.2f}" if m.endswith("anytime_td") else f"{label(m)} {v:g}" for m, v in player_stats.items())
        print(f"{fantasy_points(player_stats, scoring):>6.1f}  {name:<26} {parts}")
    print("\nMissing props count as zero, so players whose books haven't posted every line rank lower.")


if __name__ == "__main__":
    main()

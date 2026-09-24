"""Track how a game's betting line moved, from open to now, with MoneyLine Sports API.

Usage:
    export MONEYLINE_API_KEY=your-key
    python line_tracker.py --league nfl            # next upcoming game
    python line_tracker.py --event <eventId>       # a specific game
"""
import argparse
from datetime import date, datetime, timedelta

import matplotlib

matplotlib.use("Agg")  # write the chart to a file, no window needed
import matplotlib.pyplot as plt
from moneyline_sports_api import MoneyLine


def next_game(ml, league):
    """The soonest scheduled game in the coming week (2 credits). Events come back newest first, so bound the window."""
    today = date.today()
    window = {"from": today.isoformat(), "to": (today + timedelta(days=7)).isoformat()}
    games = ml.events(league=league, status="scheduled", limit=100, **window)
    if not games:
        raise SystemExit(f"No upcoming {league} games right now.")
    return min(games, key=lambda g: g["startTime"])


def moneyline_history(ml, event_id):
    """Snapshots of the market's average win probability per side over time (1 credit)."""
    history = ml.get(f"/v1/events/{event_id}/odds-history", market="moneyline")
    series = {}
    for snap in history["snapshots"]:
        at = datetime.fromisoformat(snap["snapshotAt"].replace("Z", "+00:00"))
        for row in snap["markets"]:
            series.setdefault(row["outcome"], []).append((at, row["avgImpliedProb"], row["avgPrice"]))
    return series


def fmt_odds(price):
    price = round(price)
    return f"+{price}" if price > 0 else str(price)


def main():
    parser = argparse.ArgumentParser(description="Chart how a game's moneyline moved.")
    parser.add_argument("--league", default="nfl", help="league to take the next game from (default: nfl)")
    parser.add_argument("--event", help="a specific eventId instead of the next game")
    args = parser.parse_args()

    ml = MoneyLine()  # reads MONEYLINE_API_KEY
    game = ml.event(args.event) if args.event else next_game(ml, args.league)
    title = f"{game['awayTeamName']} at {game['homeTeamName']}"
    series = moneyline_history(ml, game["eventId"])
    if not series:
        raise SystemExit(f"No line history yet for {title}. Lines are recorded once books post odds.")

    print(title)
    for team, points in series.items():
        (_, open_prob, open_price), (_, now_prob, now_price) = points[0], points[-1]
        move = (now_prob - open_prob) * 100
        print(f"  {team:<28} opened {fmt_odds(open_price):>6} ({open_prob:.0%})  now {fmt_odds(now_price):>6} ({now_prob:.0%})  moved {move:+.1f} pts")

    fig, ax = plt.subplots(figsize=(9, 4.5))
    for team, points in series.items():
        ax.plot([p[0] for p in points], [p[1] * 100 for p in points], label=team)
    ax.set_title(f"Moneyline movement: {title}")
    ax.set_ylabel("Market win probability (%)")
    ax.legend()
    fig.autofmt_xdate()
    out = f"line-movement-{game['eventId']}.png"
    fig.savefig(out, dpi=120, bbox_inches="tight")
    print(f"Chart saved to {out}")


if __name__ == "__main__":
    main()

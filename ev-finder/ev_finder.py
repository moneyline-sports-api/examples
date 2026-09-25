"""Find positive expected value (+EV) bets across US sportsbooks with MoneyLine Sports API.

Usage:
    export MONEYLINE_API_KEY=your-key
    python ev_finder.py --league nfl --min-ev 2
"""
import argparse

from moneyline_sports_api import MoneyLine


def fmt_odds(price):
    return f"+{price}" if price > 0 else str(price)


def find_ev_bets(ml, league=None, min_ev=2.0, sportsbooks_only=False):
    """Return +EV bets at or above min_ev percent, best first."""
    source_type = "sportsbook" if sportsbooks_only else None
    bets = ml.ev_bets(league=league, sourceType=source_type, limit=50)  # 1 credit
    picks = [b for b in bets if b["evBet"]["evPct"] >= min_ev]
    return sorted(picks, key=lambda b: b["evBet"]["evPct"], reverse=True)


def main():
    parser = argparse.ArgumentParser(description="Find +EV bets across US sportsbooks.")
    parser.add_argument("--league", help="nfl, nba, mlb, nhl, ncaa_football, ncaa_basketball, soccer_epl, soccer_mls (default: all)")
    parser.add_argument("--min-ev", type=float, default=2.0, help="minimum expected value in percent (default: 2)")
    parser.add_argument("--sportsbooks-only", action="store_true", help="skip exchanges and prediction markets")
    args = parser.parse_args()

    ml = MoneyLine()  # reads MONEYLINE_API_KEY
    picks = find_ev_bets(ml, args.league, args.min_ev, args.sportsbooks_only)
    if not picks:
        print(f"No bets at {args.min_ev}% EV or better right now. Try a lower --min-ev.")
        return

    print(f"{'EV':>6}  {'Odds':>6}  {'Fair win %':>10}  {'Book':<16} {'League':<14} {'Market':<24} Bet")
    for b in picks:
        bet = b["evBet"]
        print(
            f"{bet['evPct']:>5.1f}%  {fmt_odds(bet['odds']):>6}  {bet['modelProb'] * 100:>9.1f}%  "
            f"{bet['bookmaker']:<16} {b['leagueId']:<14} {b['market']:<24} {bet['selection']}"
        )


if __name__ == "__main__":
    main()

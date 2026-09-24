"""Find sports betting arbitrage (guaranteed-profit) opportunities with MoneyLine Sports API.

Usage:
    export MONEYLINE_API_KEY=your-key
    python arbitrage_finder.py --bankroll 500 --min-profit 1
"""
import argparse

from moneyline_sports_api import MoneyLine


def fmt_odds(price):
    return f"+{price}" if price > 0 else str(price)


def find_arbs(ml, league=None, min_profit=0.5):
    """Return arbitrage opportunities at or above min_profit percent, best first."""
    arbs = ml.arbitrage(league=league, minProfit=min_profit, limit=50)  # 1 credit
    return sorted(arbs, key=lambda a: a["arbitrage"]["profitPct"], reverse=True)


def stakes_for(arb, bankroll):
    """Scale the API's per-$1,000 stakes to your bankroll."""
    scale = bankroll / arb["arbitrage"]["totalStake"]
    return [(leg, round(leg["stake"] * scale, 2)) for leg in arb["arbitrage"]["books"]]


def main():
    parser = argparse.ArgumentParser(description="Find arbitrage opportunities across US sportsbooks.")
    parser.add_argument("--league", help="nfl, nba, mlb, nhl, ncaa_football, ... (default: all)")
    parser.add_argument("--min-profit", type=float, default=0.5, help="minimum guaranteed profit in percent (default: 0.5)")
    parser.add_argument("--bankroll", type=float, default=100, help="total amount to split across both bets (default: 100)")
    args = parser.parse_args()

    ml = MoneyLine()  # reads MONEYLINE_API_KEY
    arbs = find_arbs(ml, args.league, args.min_profit)
    if not arbs:
        print(f"No arbitrage at {args.min_profit}% or better right now. Prices move fast; try again soon.")
        return

    for arb in arbs:
        profit = arb["arbitrage"]["profitPct"]
        print(f"\n{profit:.2f}% profit  {arb['leagueId']}  {arb['market']}  {arb['outcome']}")
        for leg, stake in stakes_for(arb, args.bankroll):
            print(f"    bet ${stake:>8.2f} on {leg['selection']:<40} at {fmt_odds(leg['odds']):>6}  {leg['bookmaker']}")
        print(f"    returns about ${args.bankroll * (1 + profit / 100):.2f} whichever side wins")
    print("\nCheck each price at the book before betting: arbitrage windows often close within minutes.")


if __name__ == "__main__":
    main()

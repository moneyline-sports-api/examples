# Sports arbitrage finder

Finds pairs of bets at different books where backing both sides locks in a profit, and splits your bankroll between them.

Tutorial: [How to build a sports arbitrage finder](https://www.moneylineapp.com/examples/sports-arbitrage-finder)

## Run it

```bash
pip install -r requirements.txt
export MONEYLINE_API_KEY=your-key
python arbitrage_finder.py --bankroll 500 --min-profit 1
```

Options:

- `--league`: one league, such as `nfl`. Leave it out for every league.
- `--min-profit`: the smallest guaranteed profit, in percent. The default is 0.5.
- `--bankroll`: the total to split across both bets. The default is 100.

Each run costs 1 credit.

## Sample output

```
2.75% profit  nfl  player_rush_yds  Bucky Irving Over 56.5 vs Bucky Irving Under 56.5
    bet $  273.68 on Bucky Irving Over 56.5                   at   -114  betPARX
    bet $  226.32 on Bucky Irving Under 56.5                  at   +127  BetOnline.ag
    returns about $513.75 whichever side wins
```

Arbitrage windows often close within minutes, and books can limit accounts that bet this way. Confirm both prices before you place either bet.

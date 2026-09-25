# +EV bet finder

Lists bets where a sportsbook's price beats the fair price implied by the rest of the market: positive expected value (+EV) bets.

Tutorial: [How to find positive EV bets with an API](https://www.moneylineapp.com/examples/positive-ev-betting-finder)

## Run it

```bash
pip install -r requirements.txt
export MONEYLINE_API_KEY=your-key
python ev_finder.py --league nfl --min-ev 2
```

Options:

- `--league`: `nfl`, `nba`, `mlb`, `nhl`, `ncaa_football`, `ncaa_basketball`, `soccer_epl` or `soccer_mls`. Leave it out for every league.
- `--min-ev`: the smallest edge to show, in percent. The default is 2.
- `--sportsbooks-only`: skip exchanges and prediction markets.

Each run costs 1 credit.

## Sample output

```
    EV    Odds  Fair win %  Book             League         Market                   Bet
  4.5%    +136       44.3%  DraftKings       nfl            moneyline                Jacksonville Jaguars
  4.3%    +136       44.2%  DraftKings       nfl            moneyline                Dallas Cowboys
  4.0%    +190       35.9%  FanDuel          nfl            moneyline                Washington Commanders
  3.0%    -110       54.0%  LowVig.ag        nfl            spread                   Cincinnati Bengals -2.5
```

"Fair win %" is the no-vig sportsbook consensus for that bet: each sportsbook's margin is removed, then the sportsbooks that price every side are averaged, leaving out the book being scored. The API only uses prices refreshed in the last 12 hours, and only when at least three other sportsbooks price the bet (five for prices of +400 or longer).

Prices move. Check the price at the book before you bet.

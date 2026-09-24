# Fantasy projections from prop lines

Ranks players by fantasy points projected from sportsbook player-prop lines. A prop line is the market's median guess for a stat, so it makes a quick, well-informed projection.

Tutorial: [Fantasy projections from sportsbook prop lines](https://www.moneylineapp.com/examples/fantasy-projections-from-prop-lines)

## Run it

```bash
pip install -r requirements.txt
export MONEYLINE_API_KEY=your-key
python fantasy_helper.py --league nfl --top 25
python fantasy_helper.py --league nba
```

Each stat is one props call at 25 credits. NFL uses six stats (150 credits) and NBA uses three (75 credits). Change the `SCORING` table to use your league's scoring or fewer stats.

## Sample output

```
  Proj  Player                     Based on
  22.3  Josh Allen                 pass yds 236.5, pass tds 1.5, rush yds 32.5, anytime td 0.60
  21.3  Jahmyr Gibbs               rush yds 87.5, reception yds 34.5, receptions 4.5, anytime td 0.77
  18.9  Amon-Ra St. Brown          reception yds 79.5, receptions 7.5, anytime td 0.57
```

Anytime touchdown counts as the chance of scoring at least once, so it slightly undercounts players who often score twice.

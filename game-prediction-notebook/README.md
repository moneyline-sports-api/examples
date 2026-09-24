# NFL game prediction model with odds data

A Jupyter notebook that builds an Elo rating model from every NFL result since 2023, measures how well it predicts, and compares its picks with the betting market for upcoming games.

Tutorial: [Build an NFL prediction model with odds data](https://www.moneylineapp.com/examples/nfl-prediction-model-with-odds)

## Run it

```bash
pip install -r requirements.txt
export MONEYLINE_API_KEY=your-key
jupyter notebook nfl_prediction_model.ipynb
```

A full run costs about 40 credits. The notebook in this folder is saved with the results of a real run, so you can read it on GitHub first.

On the 2025 season the model picked 64.6% of winners, with a Brier score of 0.222 (a coin flip scores 0.250).

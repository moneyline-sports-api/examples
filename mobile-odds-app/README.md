# Mobile odds app (Expo / React Native)

A phone app that lists upcoming games with the best moneyline for each team and the book offering it. Pull down to refresh.

Tutorial: [Build a sports odds app with React Native](https://www.moneylineapp.com/examples/sports-odds-app-react-native)

## Run it

```bash
npm install
EXPO_PUBLIC_MONEYLINE_API_KEY=your-key npx expo start
```

Open it in Expo Go on your phone, or press `i` or `a` for a simulator. Press `w` to try it in a browser.

Each league costs 1 credit per load.

## Before you ship

This prototype puts the API key in the app, and anything in an app can be read by the people who install it. Before you release it, move the call in `odds.ts` to your own backend and keep the key there.

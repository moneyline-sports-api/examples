import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// The dev server forwards /api to MoneyLine and adds your key there, so it never reaches the browser.
// In production, do the same from your own backend or an edge function.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: 'https://mlapi.bet',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: { 'x-api-key': env.MONEYLINE_API_KEY },
        },
      },
    },
  }
})

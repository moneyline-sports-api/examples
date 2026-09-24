import './globals.css'

export const metadata = { title: 'Odds comparison', description: 'Best odds across US sportsbooks' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

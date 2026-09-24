import './globals.css'

export const metadata = { title: 'Player prop hit rates', description: 'How often players cleared their prop line' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

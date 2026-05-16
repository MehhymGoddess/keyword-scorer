import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Keyword Opportunity Scorer',
  description: 'Score Google keywords for local franchise campaigns',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

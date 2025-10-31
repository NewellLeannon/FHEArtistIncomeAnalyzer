import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FHE Artist Income Analyzer',
  description: 'Privacy-preserving artist income analysis with FHE',
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

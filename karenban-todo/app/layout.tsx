import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Karenban',
  description: 'Personal task tracker',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

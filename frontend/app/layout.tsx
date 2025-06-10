import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Parents in the Loop',
  description: 'An AI-powered interface targeted towards school systems to bridge knowledge and language barriers for immigrant parents.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

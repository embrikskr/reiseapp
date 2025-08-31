import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export const metadata: Metadata = { title: 'Travelgram', description: 'Trip Recaps, digitalt pass og reisefeed.' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="no"><body className={inter.variable + ' min-h-screen bg-hero'}>{children}</body></html>)
}

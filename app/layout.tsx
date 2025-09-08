import type { Metadata } from 'next'
import './globals.css'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import ThemeLoader from '@/components/ThemeLoader'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })

export const metadata: Metadata = {
  title: 'Travelgram',
  description: 'Trip recaps, digital passport and travel feed.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body className={inter.variable + ' ' + jakarta.variable + ' min-h-screen bg-app'}>
        <ThemeLoader />
        {children}
      </body>
    </html>
  )
}

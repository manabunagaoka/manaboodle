import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { SearchProvider } from '../contexts/SearchContext'
import GoogleAnalytics from '../components/GoogleAnalytics'
import AuthProvider from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Manaboodle',
  description: 'Cultivating synchronicity through creative vibes and authentic human stories',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics - only loads in production */}
        {process.env.NODE_ENV === 'production' && (
          <GoogleAnalytics GA_MEASUREMENT_ID="G-014RS0SVMJ" />
        )}
        <AuthProvider>
          <SearchProvider>
            <Header />
            {children}
            <Footer />
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
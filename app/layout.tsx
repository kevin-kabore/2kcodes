import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import {CustomThemeProvider} from './theme'
import {AuthSessionProvider} from './components/auth/session-provider'
import './globals.css'

const inter = Inter({subsets: ['latin']})

export const metadata: Metadata = {
  title: 'Kevin Kaboré - Portfolio & Blog',
  description: 'Personal portfolio and Web3 blog by Kevin Kaboré',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthSessionProvider>
          <CustomThemeProvider>{children}</CustomThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  )
}

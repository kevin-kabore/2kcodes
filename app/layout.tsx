import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthSessionProvider } from './components/auth/session-provider';
import { ThemeProvider } from './contexts/theme-context';
import { DynamicProvider } from './components/providers/dynamic-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kevin Kaboré - Software Engineer & Web3 Builder',
  description: 'Personal portfolio and Web3 blog by Kevin Kaboré - Software Engineer at Datadog, building the future of developer experience and Web3 applications.',
  keywords: ['Kevin Kaboré', 'Software Engineer', 'Web3', 'Blog', 'Developer Experience', 'Frontend Engineering'],
  authors: [{ name: 'Kevin Kaboré' }],
  creator: 'Kevin Kaboré',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://2kcodes.com',
    title: 'Kevin Kaboré - Software Engineer & Web3 Builder',
    description: 'Personal portfolio and Web3 blog by Kevin Kaboré',
    siteName: '2kcodes',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kevin Kaboré - Software Engineer & Web3 Builder',
    description: 'Personal portfolio and Web3 blog by Kevin Kaboré',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-black text-gray-900 dark:text-gray-100`}>
        <AuthSessionProvider>
          <ThemeProvider>
            <DynamicProvider>
              {children}
            </DynamicProvider>
          </ThemeProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
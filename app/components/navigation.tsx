'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {useDynamicContext} from '@dynamic-labs/sdk-react-core'
import {motion, AnimatePresence} from 'framer-motion'
import {ThemeToggle} from './ui/theme-toggle'

export function Navigation() {
  const {user, primaryWallet, network, setShowAuthFlow, handleLogOut} = useDynamicContext()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getNetworkDisplayName = (networkName?: string) => {
    switch (networkName?.toLowerCase()) {
      case 'solana':
      case 'solana-mainnet':
        return 'Mainnet'
      case 'solana-devnet':
        return 'Devnet'
      case 'solana-testnet':
        return 'Testnet'
      default:
        return networkName || 'Unknown'
    }
  }

  const getNetworkIndicatorColor = (networkName?: string) => {
    switch (networkName?.toLowerCase()) {
      case 'solana':
      case 'solana-mainnet':
        return 'bg-green-500'
      case 'solana-devnet':
        return 'bg-orange-500'
      case 'solana-testnet':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const navLinks = [
    {href: '/', label: 'Home'},
    {href: '/blog', label: 'Blog'},
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 w-full">
          {/* Logo and Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              href="/"
              className={`text-xl font-bold transition-colors ${
                isScrolled
                  ? 'text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400'
                  : 'text-white hover:text-purple-300'
              }`}
            >
              kevindotk
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors font-medium ${
                    isScrolled
                      ? 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                      : 'text-white/90 hover:text-purple-300'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-3">
                {/* Wallet details when connected */}
                {primaryWallet && (
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full ${getNetworkIndicatorColor(String(network))}`} />
                    <span className={isScrolled ? 'text-muted-foreground' : 'text-white/70'}>
                      {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
                    </span>
                    <span className={`text-xs ${isScrolled ? 'text-muted-foreground' : 'text-white/60'}`}>
                      {getNetworkDisplayName(String(network))}
                    </span>
                  </div>
                )}
                <Link
                  href="/profile"
                  className={`px-3 py-2 text-sm transition-colors ${
                    isScrolled
                      ? 'text-primary hover:text-primary/80'
                      : 'text-white/90 hover:text-purple-300'
                  }`}
                >
                  Profile
                </Link>
                <span className={`text-sm ${
                  isScrolled ? 'text-muted-foreground' : 'text-white/70'
                }`}>
                  {user.alias || user.email || 'User'}
                </span>
                <button
                  onClick={handleLogOut}
                  className={`px-4 py-2 text-sm border rounded-md transition-colors ${
                    isScrolled
                      ? 'border-border hover:bg-muted text-foreground'
                      : 'border-white/30 hover:bg-white/10 text-white'
                  }`}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthFlow(true)}
                className={`hidden md:inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                  isScrolled
                    ? 'text-white bg-purple-600 hover:bg-purple-700'
                    : 'text-purple-600 bg-white hover:bg-gray-100'
                }`}
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden inline-flex items-center justify-center p-2 rounded-md transition-colors focus:outline-none ${
                isScrolled
                  ? 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
                  : 'text-white hover:text-purple-300'
              }`}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height: 'auto'}}
            exit={{opacity: 0, height: 0}}
            transition={{duration: 0.2}}
            className="md:hidden bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile Wallet Details */}
              {user && primaryWallet && (
                <div className="px-3 py-2 flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${getNetworkIndicatorColor(String(network))}`} />
                  <span className="text-muted-foreground">
                    {`${primaryWallet.address.slice(0, 6)}...${primaryWallet.address.slice(-4)}`}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {getNetworkDisplayName(String(network))}
                  </span>
                </div>
              )}
              {!user ? (
                <button
                  onClick={() => {
                    setShowAuthFlow(true)
                    setIsMobileMenuOpen(false)
                  }}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-purple-600 hover:bg-purple-700 transition-colors w-full text-left"
                >
                  Sign In
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogOut()
                      setIsMobileMenuOpen(false)
                    }}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors w-full text-left"
                  >
                    Sign Out ({user.alias || user.email || 'User'})
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

'use client'

import {useDynamicContext} from '@dynamic-labs/sdk-react-core'
import {useState, useEffect, useCallback} from 'react'

interface WalletButtonProps {
  showNetwork?: boolean
  showBalance?: boolean
  variant?: 'default' | 'compact' | 'icon'
}

export function WalletButton({ 
  showNetwork = false, 
  showBalance = false, 
  variant = 'default' 
}: WalletButtonProps) {
  const {primaryWallet, setShowAuthFlow, handleLogOut, network} = useDynamicContext()
  const [mounted, setMounted] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchBalance = useCallback(async () => {
    if (!primaryWallet) return
    
    setIsLoadingBalance(true)
    try {
      // Get SOL balance - Note: getBalance method may not be available on all wallet connectors
      // This is a placeholder - actual implementation depends on the wallet type
      if ('getBalance' in primaryWallet.connector && typeof primaryWallet.connector.getBalance === 'function') {
        const balanceResponse = await primaryWallet.connector.getBalance()
        setBalance(balanceResponse ? parseFloat(String(balanceResponse)) / 1e9 : 0) // Convert lamports to SOL
      } else {
        // Fallback - you would implement actual balance fetching using Solana RPC
        setBalance(null)
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error)
      setBalance(null)
    } finally {
      setIsLoadingBalance(false)
    }
  }, [primaryWallet])

  useEffect(() => {
    if (primaryWallet && showBalance) {
      fetchBalance()
    }
  }, [primaryWallet, showBalance, fetchBalance])

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

  if (!mounted) {
    return null
  }

  if (primaryWallet) {
    const address = primaryWallet.address
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`
    const walletType = primaryWallet.connector?.name || 'Wallet'
    const networkDisplayName = getNetworkDisplayName(String(network))
    const networkColor = getNetworkIndicatorColor(String(network))

    if (variant === 'icon') {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${networkColor}`} />
            {showNetwork && (
              <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
                {networkDisplayName}
              </span>
            )}
          </div>
          <button
            onClick={() => handleLogOut()}
            className="p-2 hover:bg-muted rounded-md"
            title={`${walletType}: ${address}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )
    }

    if (variant === 'compact') {
      return (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${networkColor}`} />
          <span className="text-muted-foreground">{truncatedAddress}</span>
          <button
            onClick={() => handleLogOut()}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${networkColor}`} />
            <span className="text-sm font-medium">{truncatedAddress}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {showNetwork && <span>{networkDisplayName}</span>}
            {showBalance && (
              <>
                {showNetwork && <span>•</span>}
                <span>
                  {isLoadingBalance ? '...' : balance !== null ? `${balance.toFixed(4)} SOL` : 'N/A'}
                </span>
              </>
            )}
            <span>•</span>
            <span>{walletType}</span>
          </div>
        </div>
        <button
          onClick={() => handleLogOut()}
          className="px-3 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowAuthFlow(true)}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Connect Wallet
    </button>
  )
}

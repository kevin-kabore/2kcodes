'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export function WalletButton() {
  const { primaryWallet, setShowAuthFlow, handleLogOut } = useDynamicContext()
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Sync wallet address with database when connected
    if (primaryWallet && session?.user && !isSyncing) {
      setIsSyncing(true)
      fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: primaryWallet.address }),
      })
        .then(() => console.log('Wallet synced'))
        .catch((error) => console.error('Failed to sync wallet:', error))
        .finally(() => setIsSyncing(false))
    }
  }, [primaryWallet, session, isSyncing])

  if (!mounted || process.env.NEXT_PUBLIC_ENABLE_WEB3 !== 'true') {
    return null
  }

  if (primaryWallet) {
    const address = primaryWallet.address
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">{truncatedAddress}</span>
        <button
          onClick={() => handleLogOut()}
          className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setShowAuthFlow(true)}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
    >
      Connect Wallet
    </button>
  )
}
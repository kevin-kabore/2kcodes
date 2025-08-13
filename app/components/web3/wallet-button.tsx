'use client'

import {useDynamicContext} from '@dynamic-labs/sdk-react-core'
import {useState, useEffect} from 'react'

export function WalletButton() {
  const {primaryWallet, setShowAuthFlow, handleLogOut} = useDynamicContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  if (primaryWallet) {
    const address = primaryWallet.address
    const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`

    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {truncatedAddress}
        </span>
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

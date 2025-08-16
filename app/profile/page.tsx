'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, primaryWallet, setShowAuthFlow } = useDynamicContext()

  // Removed auto-redirect to prevent flashing and allow users to see the profile page

  if (!user || !primaryWallet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Profile</h1>
          <p className="text-muted-foreground mb-6">
            Connect your wallet to view your profile and NFT collection.
          </p>
          <button
            onClick={() => setShowAuthFlow(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="space-y-6">
          {/* User Info */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Username</label>
                <p className="text-lg">{user.username || 'Not set'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-lg">{user.email || 'Not provided'}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wallet Address</label>
                <p className="text-lg font-mono break-all">{primaryWallet.address}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Wallet Type</label>
                <p className="text-lg">{primaryWallet.connector?.name || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={`/profile/nfts?wallet=${primaryWallet.address}`}
              className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">🎨</div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    NFT Collection
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    View your minted blog post NFTs
                  </p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/blog/write"
              className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">✍️</div>
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    Write a Post
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Create a new blog post and mint as NFT
                  </p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Activity placeholder */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">
              Activity tracking coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export function DashboardContent() {
  const { user, handleLogOut } = useDynamicContext()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <button
          onClick={() => handleLogOut()}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              Welcome back, {user.alias || user.email}!
            </h2>
            <p className="text-muted-foreground mb-6">
              You&apos;re successfully logged in to your account.
            </p>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">
                Account Information:
              </h3>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Email:</strong> {user.email || 'Not provided'}
                </p>
                {user.alias && (
                  <p className="text-sm">
                    <strong>Username:</strong> {user.alias}
                  </p>
                )}
                {user.verifiedCredentials?.[0]?.address && (
                  <p className="text-sm">
                    <strong>Wallet:</strong> {user.verifiedCredentials[0].address}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Your Blog Posts</h2>
            <p className="text-sm text-muted-foreground mb-4">
              You haven&apos;t created any blog posts yet.
            </p>
            <Link 
              href="/blog/write"
              className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Create Your First Post
            </Link>
          </div>
        </div>

        <div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">Profile Settings</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your account settings and preferences.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
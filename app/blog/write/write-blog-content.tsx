'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BlogEditor } from '@/app/components/blog/blog-editor'
import { AuthWrapper } from '@/app/components/auth/auth-wrapper'

export function WriteBlogContent() {
  const { user, setShowAuthFlow } = useDynamicContext()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/blog')
    } else {
      console.log('Current user:', user)
      // Ensure user is synced with database
      syncUserWithDatabase(user)
    }
  }, [user, router])

  const syncUserWithDatabase = async (user: any) => {
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user }),
      })
      const result = await response.json()
      console.log('User sync result:', result)
    } catch (error) {
      console.error('Failed to sync user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Write a Blog Post</h1>
        
        <AuthWrapper 
          requireAuth
          fallback={
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to write a blog post.
              </p>
              <button
                onClick={() => setShowAuthFlow(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          }
        >
          <BlogEditor userId={user?.userId || ''} />
        </AuthWrapper>
      </div>
    </div>
  )
}
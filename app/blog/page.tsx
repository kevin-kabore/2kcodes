'use client'

import Link from 'next/link'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

export default function BlogPage() {
  const { user, setShowAuthFlow } = useDynamicContext()

  console.log('Dynamic user:', user)
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        {user && (
          <Link
            href="/blog/write"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Write a Post
          </Link>
        )}
      </div>

      <div className="grid gap-6">
        <div className="border border-border rounded-lg p-6">
          <p className="text-muted-foreground">
            No blog posts yet.{' '}
            {user ? (
              'Write your first post!'
            ) : (
              <>
                <button
                  onClick={() => setShowAuthFlow(true)}
                  className="text-primary hover:underline"
                >
                  Sign in
                </button>{' '}
                to start writing.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

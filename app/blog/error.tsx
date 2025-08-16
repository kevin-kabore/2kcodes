'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Blog page error:', error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-destructive mb-4">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground mb-6">
            We encountered an error while loading the blog posts. Please try again.
          </p>
          <div className="space-y-4">
            <button
              onClick={reset}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 mr-4"
            >
              Try again
            </button>
            <a
              href="/"
              className="px-4 py-2 border border-border rounded-md hover:bg-muted inline-block"
            >
              Go home
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
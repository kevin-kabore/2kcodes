'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import Link from 'next/link'

interface BlogPostActionsProps {
  authorId: string
  slug: string
}

export function BlogPostActions({ authorId, slug }: BlogPostActionsProps) {
  const { user } = useDynamicContext()
  
  // Only show actions if current user is the author
  if (!user || user.userId !== authorId) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Author Actions</h3>
        <div className="flex gap-3">
          <Link
            href={`/blog/edit/${slug}`}
            className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted"
          >
            Edit Post
          </Link>
          <button
            className="px-4 py-2 text-sm text-destructive border border-destructive rounded-md hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => {
              if (confirm('Are you sure you want to delete this post?')) {
                // TODO: Implement delete functionality
                alert('Delete functionality not implemented yet')
              }
            }}
          >
            Delete Post
          </button>
        </div>
      </div>
    </div>
  )
}
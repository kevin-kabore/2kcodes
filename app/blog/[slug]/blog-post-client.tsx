'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import Link from 'next/link'

interface BlogPostClientProps {
  authorId: string
  slug: string
}

export function BlogPostClient({ authorId, slug }: BlogPostClientProps) {
  const { user } = useDynamicContext()
  
  // Only show actions if current user is the author
  if (!user || user.userId !== authorId) {
    return null
  }

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold mb-4">Author Actions</h3>
      <div className="flex gap-4">
        <Link
          href={`/blog/${slug}/edit`}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Edit Post
        </Link>
        <button
          onClick={() => {
            if (confirm('Are you sure you want to delete this post?')) {
              // TODO: Implement delete functionality
              console.log('Delete post:', slug)
            }
          }}
          className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors"
        >
          Delete Post
        </button>
      </div>
    </div>
  )
}
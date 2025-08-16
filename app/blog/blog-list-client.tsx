'use client'

import Link from 'next/link'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { BlogPostCard } from '@/app/components/blog/blog-post-card'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  content: string
  coverImage?: string | null
  published: boolean
  publishedAt: string | null
  author: {
    id: string
    username: string
    email?: string | null
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  category?: {
    id: string
    name: string
    slug: string
  } | null
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface BlogListClientProps {
  posts: BlogPost[]
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const { user } = useDynamicContext()

  return (
    <>
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
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))
        ) : (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No blog posts published yet.
            </p>
            <p className="text-muted-foreground">
              {user ? (
                <>
                  Ready to share your thoughts?{' '}
                  <Link 
                    href="/blog/write"
                    className="text-primary hover:underline font-medium"
                  >
                    Write your first post
                  </Link>
                </>
              ) : (
                'Check back soon for new content!'
              )}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
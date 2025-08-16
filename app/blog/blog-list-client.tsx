'use client'

import { useState } from 'react'
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
  // Web3/NFT fields
  nftMinted: boolean
  nftMintAddress?: string | null
  nftMetadataUri?: string | null
  nftNetwork?: string | null
  nftTxSignature?: string | null
  nftMintedAt?: string | null
  nftRoyalty?: number | null
}

interface BlogListClientProps {
  posts: BlogPost[]
}

export function BlogListClient({ posts }: BlogListClientProps) {
  const { user } = useDynamicContext()
  const [filter, setFilter] = useState<'all' | 'nft' | 'regular'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views'>('newest')

  const filteredPosts = posts.filter(post => {
    switch (filter) {
      case 'nft':
        return post.nftMinted
      case 'regular':
        return !post.nftMinted
      case 'all':
      default:
        return true
    }
  })

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime()
      case 'oldest':
        return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime()
      case 'views':
        return b.viewCount - a.viewCount
      default:
        return 0
    }
  })

  const nftCount = posts.filter(post => post.nftMinted).length
  const regularCount = posts.length - nftCount

  return (
    <>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-center justify-between">
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

        {/* Filter and Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-1 border border-border rounded-md bg-background text-sm"
              >
                <option value="all">All Posts ({posts.length})</option>
                <option value="nft">NFT Posts ({nftCount})</option>
                <option value="regular">Regular Posts ({regularCount})</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-border rounded-md bg-background text-sm"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="views">Most Viewed</option>
              </select>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Showing {sortedPosts.length} of {posts.length}</span>
            {nftCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></span>
                  {nftCount} NFTs
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => (
            <BlogPostCard key={post.id} post={post} />
          ))
        ) : posts.length === 0 ? (
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
        ) : (
          <div className="border border-border rounded-lg p-8 text-center">
            <p className="text-muted-foreground text-lg mb-4">
              No posts match the current filter.
            </p>
            <p className="text-muted-foreground">
              Try changing the filter options above or{' '}
              <button
                onClick={() => setFilter('all')}
                className="text-primary hover:underline font-medium"
              >
                show all posts
              </button>
            </p>
          </div>
        )}
      </div>
    </>
  )
}
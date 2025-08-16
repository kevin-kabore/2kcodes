'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

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

interface BlogPostCardProps {
  post: BlogPost
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const publishedDate = post.publishedAt ? new Date(post.publishedAt) : null
  const timeAgo = publishedDate 
    ? formatDistanceToNow(publishedDate, { addSuffix: true })
    : null

  return (
    <article className="border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
      {post.coverImage && (
        <div className="mb-4">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>By {post.author.username}</span>
          {timeAgo && (
            <>
              <span>•</span>
              <span>{timeAgo}</span>
            </>
          )}
          {post.viewCount > 0 && (
            <>
              <span>•</span>
              <span>{post.viewCount} views</span>
            </>
          )}
        </div>

        {/* NFT Badge */}
        {post.nftMinted && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
              🎨 NFT
            </span>
            {post.nftNetwork && (
              <span className="text-xs text-muted-foreground">
                on {post.nftNetwork}
              </span>
            )}
          </div>
        )}

        <h2 className="text-xl font-semibold">
          <Link 
            href={`/blog/${post.slug}`}
            className="hover:text-primary transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2">
          <Link
            href={`/blog/${post.slug}`}
            className="text-primary hover:underline text-sm font-medium"
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  )
}
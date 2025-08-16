import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPostActions } from './blog-post-actions'
import { MarkdownContent } from './markdown-content'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  try {
    const post = await db.blogPost.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        tags: true,
        category: true,
      },
      // All NFT fields are automatically included since they're part of the BlogPost model
    })

    if (!post) {
      return null
    }

    // Increment view count
    await db.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } },
    })

    return post
  } catch (error) {
    console.log('Database not available, returning null for blog post')
    return null
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  // Only show published posts for now (author-specific logic moved to client component)
  if (!post.published) {
    notFound()
  }

  const publishedDate = post.publishedAt || post.createdAt

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back to Blog */}
        <div className="mb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to Blog
          </Link>
        </div>

        {/* Post Header */}
        <header className="mb-8">
          {/* Draft Badge */}
          {!post.published && (
            <div className="mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                Draft
              </span>
            </div>
          )}

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-6">
              <Image
                src={post.coverImage}
                alt={post.title}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <span>By {post.author.username}</span>
            </div>
            <div className="flex items-center gap-2">
              <time dateTime={publishedDate.toISOString()}>
                {format(publishedDate, 'MMMM d, yyyy')}
              </time>
            </div>
            <div className="flex items-center gap-2">
              <span>{post.viewCount} views</span>
            </div>
          </div>

          {/* NFT Metadata */}
          {post.nftMinted && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-full">
                  🎨 NFT Collectible
                </span>
                {post.nftNetwork && (
                  <span className="text-sm text-muted-foreground">
                    on {post.nftNetwork}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {post.nftMintAddress && (
                  <div>
                    <span className="font-medium text-foreground">Mint Address:</span>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {post.nftMintAddress}
                    </p>
                  </div>
                )}
                
                {post.nftTxSignature && (
                  <div>
                    <span className="font-medium text-foreground">Transaction:</span>
                    <p className="text-muted-foreground font-mono text-xs break-all">
                      {post.nftTxSignature}
                    </p>
                  </div>
                )}
                
                {post.nftMintedAt && (
                  <div>
                    <span className="font-medium text-foreground">Minted:</span>
                    <p className="text-muted-foreground">
                      {format(new Date(post.nftMintedAt), 'MMMM d, yyyy \'at\' h:mm a')}
                    </p>
                  </div>
                )}
                
                {post.nftRoyalty && (
                  <div>
                    <span className="font-medium text-foreground">Royalty:</span>
                    <p className="text-muted-foreground">
                      {(post.nftRoyalty / 100).toFixed(1)}%
                    </p>
                  </div>
                )}
              </div>
              
              {post.nftMetadataUri && (
                <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                  <a
                    href={post.nftMetadataUri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                  >
                    📄 View NFT Metadata
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Post Content */}
        <MarkdownContent content={post.content} />

        {/* Author Actions - Client Component */}
        <BlogPostActions authorId={post.authorId} slug={post.slug} />

        {/* Related Posts */}
        {/* TODO: Implement related posts based on tags or category */}
      </div>
    </div>
  )
}

// Generate static params for better performance
export async function generateStaticParams() {
  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
      take: 100, // Limit for build performance
    })

    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    // If database is not available during build, return empty array
    // Pages will be generated on-demand instead
    console.warn('Database not available during build, using ISR for blog posts')
    return []
  }
}
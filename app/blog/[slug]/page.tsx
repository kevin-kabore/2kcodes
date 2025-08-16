import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { format } from 'date-fns'
import MarkdownPreview from '@uiw/react-markdown-preview'
import Link from 'next/link'
import { BlogPostActions } from './blog-post-actions'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
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
              <img
                src={post.coverImage}
                alt={post.title}
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
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <MarkdownPreview
            source={post.content}
            style={{ backgroundColor: 'transparent' }}
            data-color-mode="auto"
          />
        </article>

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
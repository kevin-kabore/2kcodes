import {db} from '@/lib/db'
import {BlogListClient} from './blog-list-client'

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

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: {
      published: true,
    },
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
    orderBy: {
      publishedAt: 'desc',
    },
  })

  const transformedPosts: BlogPost[] = posts.map(post => ({
    ...post,
    publishedAt: post.publishedAt?.toISOString() || null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogListClient posts={transformedPosts} />
    </div>
  )
}

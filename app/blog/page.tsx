import {db} from '@/lib/db'
import {BlogListClient} from './blog-list-client'

// Posts come from the DB, so render per-request instead of baking at build.
export const dynamic = 'force-dynamic'

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

export default async function BlogPage() {
  let posts: BlogPost[] = []
  
  try {
    const dbPosts = await db.blogPost.findMany({
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

    posts = dbPosts.map(post => ({
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      nftMintedAt: post.nftMintedAt?.toISOString() || null,
    }))
  } catch (error) {
    console.log('Database not available during build time, using empty posts array')
    posts = []
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BlogListClient posts={posts} />
    </div>
  )
}

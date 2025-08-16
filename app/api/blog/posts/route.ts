import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  slug: z.string().min(1),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImage: z.string().url().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().default(false),
  userId: z.string().min(1), // Dynamic user ID
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received blog post data:', body)
    
    const validatedData = createPostSchema.parse(body)
    console.log('Validated data:', validatedData)
    
    // Verify user exists
    const user = await db.user.findUnique({
      where: { id: validatedData.userId }
    })
    
    console.log('Found user in database:', user ? { id: user.id, username: user.username } : 'null')
    
    if (!user) {
      console.log('User not found in database with ID:', validatedData.userId)
      return NextResponse.json(
        { error: 'Unauthorized - User not found in database' },
        { status: 401 }
      )
    }

    // Check if slug already exists
    const existingPost = await db.blogPost.findUnique({
      where: { slug: validatedData.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 400 }
      )
    }

    // Create tags if they don't exist
    const tagRecords = []
    if (validatedData.tags && validatedData.tags.length > 0) {
      for (const tagName of validatedData.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        const tag = await db.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: {
            name: tagName,
            slug: tagSlug,
          },
        })
        tagRecords.push(tag)
      }
    }

    // Create the blog post
    const post = await db.blogPost.create({
      data: {
        title: validatedData.title,
        slug: validatedData.slug,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage: validatedData.coverImage,
        published: validatedData.published,
        publishedAt: validatedData.published ? new Date() : null,
        authorId: validatedData.userId,
        categoryId: validatedData.categoryId,
        tags: {
          connect: tagRecords.map(tag => ({ id: tag.id })),
        },
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
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const published = searchParams.get('published') === 'true'
    const authorId = searchParams.get('authorId')
    const categoryId = searchParams.get('categoryId')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    
    if (published) {
      where.published = true
    }
    
    if (authorId) {
      where.authorId = authorId
    }
    
    if (categoryId) {
      where.categoryId = categoryId
    }
    
    if (tag) {
      where.tags = {
        some: {
          slug: tag
        }
      }
    }

    const [posts, total] = await Promise.all([
      db.blogPost.findMany({
        where,
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
        take: limit,
        skip: offset,
      }),
      db.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
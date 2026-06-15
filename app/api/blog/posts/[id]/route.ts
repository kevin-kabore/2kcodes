import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

// Editable fields for an existing blog post.
//
// NOTE on `slug`: slug edits are intentionally NOT supported here. The post is
// served at /blog/[slug] and is statically generated (see generateStaticParams
// in app/blog/[slug]/page.tsx). Changing the slug would orphan the existing
// route/static page and break any external links or NFT metadata that already
// reference the old slug. Slug is derived from the title at creation time only.
//
// NOTE on auth: matching the sibling nft route (app/api/blog/posts/[id]/nft),
// this route does NOT perform a server-side author check. There is no
// server-side Dynamic session to verify against in this codebase (auth identity
// is established client-side and synced via /api/auth/sync-user). Behavior is
// kept consistent with sibling routes.
// TODO(auth): once a server-verifiable session exists, gate this PATCH on the
// requesting user matching existingPost.authorId.
const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  excerpt: z.string().max(300).optional().nullable(),
  content: z.string().min(1).optional(),
  coverImage: z.string().url().nullable().optional().or(z.literal('')),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const validatedData = updatePostSchema.parse(body)

    // Check if the blog post exists
    const existingPost = await db.blogPost.findUnique({
      where: { id: params.id }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      )
    }

    // Upsert + reconnect tags only when the caller sent a tags array, mirroring
    // the connect-by-slug pattern in the POST route. `set` replaces the post's
    // tag list with exactly what was provided.
    let tagsUpdate: { set: { id: string }[] } | undefined
    if (validatedData.tags) {
      const tagRecords = []
      for (const tagName of validatedData.tags) {
        const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-')
        const tag = await db.tag.upsert({
          where: { slug: tagSlug },
          update: {},
          create: { name: tagName, slug: tagSlug },
        })
        tagRecords.push(tag)
      }
      tagsUpdate = { set: tagRecords.map(tag => ({ id: tag.id })) }
    }

    // Only move publishedAt on a real unpublished -> published transition, so
    // editing an already-published post doesn't rewrite its original date.
    let publishedAt: Date | null | undefined
    if (validatedData.published !== undefined) {
      if (validatedData.published && !existingPost.published) {
        publishedAt = new Date()
      } else if (!validatedData.published) {
        publishedAt = null
      }
    }

    // `updatedAt` is maintained automatically by Prisma (@updatedAt).
    const updatedPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        title: validatedData.title,
        excerpt: validatedData.excerpt,
        content: validatedData.content,
        coverImage:
          validatedData.coverImage === '' ? null : validatedData.coverImage,
        published: validatedData.published,
        publishedAt,
        tags: tagsUpdate,
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

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error('Error updating blog post:', error)
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

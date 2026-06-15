import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { EditBlogContent } from './edit-blog-content'

interface EditBlogPostPageProps {
  params: {
    slug: string
  }
}

// Fetch the post by slug, mirroring getBlogPost in app/blog/[slug]/page.tsx.
// We only need the id here (to pass to the editor / PATCH route) plus enough
// to confirm existence, but we keep the include shape consistent with the
// sibling page for predictability.
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
    })

    if (!post) {
      return null
    }

    return post
  } catch (error) {
    console.log('Database not available, returning null for blog post')
    return null
  }
}

export default async function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <EditBlogContent
      postId={post.id}
      initialValues={{
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        tags: post.tags.map(tag => tag.name).join(', '),
        categoryId: post.categoryId,
        published: post.published,
        slug: post.slug,
      }}
    />
  )
}

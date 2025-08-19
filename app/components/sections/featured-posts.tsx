import { db } from '@/lib/db';
import { FeaturedPostsClient } from './featured-posts-client';

async function getFeaturedPosts() {
  try {
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
      take: 3,
    });

    return posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt || post.content.slice(0, 200) + '...',
      author: post.author.username,
      category: post.category?.name || 'Uncategorized',
      publishedAt: post.publishedAt,
      viewCount: post.viewCount,
      tags: post.tags.map(tag => tag.name),
      nftNetwork: post.nftNetwork,
    }));
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

export async function FeaturedPostsSection() {
  const posts = await getFeaturedPosts();

  return (
    <FeaturedPostsClient posts={posts} />
  );
}
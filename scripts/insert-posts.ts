/**
 * Idempotent insert of the authored long-form blog posts into whatever database
 * the Prisma datasource points at (POSTGRES_PRISMA_URL). Safe to run against
 * production: it upserts by slug, preserves backdated publishedAt values, and
 * attaches them to the first user in the DB (your Dynamic account on prod).
 *
 * Usage (production — pass the v2 connection explicitly):
 *   POSTGRES_PRISMA_URL="<prod connection string>" npx tsx scripts/insert-posts.ts
 *
 * Usage (local, reads .env.local):
 *   npm run db:insert-posts
 */
import { PrismaClient } from '@prisma/client';
import { blogPosts, readPostContent, slugify } from '../prisma/blog-content';

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  if (!author) {
    throw new Error(
      'No user found in the database. Sign in once on the site (which creates your user) before running this script.',
    );
  }
  console.log(`✍️  Authoring as: ${author.username} (${author.id})`);

  for (const post of blogPosts) {
    const content = readPostContent(post.file);

    const tags = post.tags.map(name => ({
      where: { slug: slugify(name) },
      create: { name, slug: slugify(name) },
    }));

    const category = {
      connectOrCreate: {
        where: { slug: slugify(post.category) },
        create: { name: post.category, slug: slugify(post.category) },
      },
    };

    const result = await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content,
        published: true,
        publishedAt: post.publishedAt,
        category,
        tags: { connectOrCreate: tags },
      },
      create: {
        author: { connect: { id: author.id } },
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content,
        published: true,
        publishedAt: post.publishedAt,
        category,
        tags: { connectOrCreate: tags },
      },
    });

    console.log(`✓ ${result.title} — published ${post.publishedAt.toISOString().slice(0, 10)}`);
  }

  console.log('🎉 Done. Posts are live (mint via the NFT modal on each post when ready).');
}

main()
  .catch(e => {
    console.error('❌ Insert failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

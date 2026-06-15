import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Source of truth for the authored long-form blog posts. Markdown bodies live
 * in content/blog/*.md so they stay reviewable in git. Both the dev seed
 * (prisma/seed.ts) and the production insert script (scripts/insert-posts.ts)
 * consume this list.
 */
export type SeedPost = {
  slug: string;
  title: string;
  excerpt: string;
  file: string;
  category: string;
  tags: string[];
  publishedAt: Date;
};

export const blogPosts: SeedPost[] = [
  {
    slug: 'the-bottleneck-is-attention',
    title: 'The Bottleneck Is Attention',
    excerpt:
      'Compute is cheap and data is infinite. Attention — human, and now machine — is the real scarce resource. What cutting alert noise by over 98% taught me about curation, legibility, and building for a reader that is part human, part AI agent.',
    file: 'the-bottleneck-is-attention.md',
    category: 'Engineering',
    tags: ['AI', 'Systems', 'Attention'],
    publishedAt: new Date('2026-06-01T14:00:00Z'),
  },
  {
    slug: 'using-ai-to-build-a-banana-bread-business',
    title: 'Using AI to Build a Banana Bread Business',
    excerpt:
      'Four friends, a protein banana bread recipe, and a lot of AI. What founding Brekkie Bakery taught me about where AI shines, where it quietly misleads you, and why the future of this technology reaches off the screen and into physical machines.',
    file: 'using-ai-to-build-a-banana-bread-business.md',
    category: 'AI',
    tags: ['AI', 'Founders', 'Physical Systems'],
    publishedAt: new Date('2026-02-15T14:00:00Z'),
  },
];

export function slugify(value: string): string {
  return value.toLowerCase().trim().replace(/\s+/g, '-');
}

export function readPostContent(file: string): string {
  return readFileSync(join(process.cwd(), 'content', 'blog', file), 'utf-8');
}

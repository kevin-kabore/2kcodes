import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Only seed in development
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️  Skipping seed in production environment');
    return;
  }

  try {
    // Clear existing data
    await prisma.blogPost.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');

    // Create test user (Dynamic auth pattern - no password needed)
    const user = await prisma.user.create({
      data: {
        id: '01234567-8901-2345-6789-abcdef012345', // Dynamic userId format
        username: 'kevinkabore',
        email: 'kevin@example.com',
        password: null, // No password for Dynamic auth
        walletAddress: 'So11111111111111111111111111111111111111112', // Solana wallet format
      },
    });
    console.log('✅ Created user:', user.username);

    // Create sample blog posts
    const posts = await Promise.all([
      prisma.blogPost.create({
        data: {
          authorId: user.id,
          title: 'Welcome to My Web3 Blog',
          slug: 'welcome-to-my-web3-blog',
          content: `# Welcome to My Blog

This is my first post on this modern blogging platform. Here's what makes it special:

- **Modern Authentication**: Login with your Web3 wallet or Google account via Dynamic
- **Developer-Friendly**: Built with Next.js 14, TypeScript, and Prisma
- **Responsive Design**: Works perfectly on all devices
- **Fast Performance**: Optimized with server components and edge runtime

Stay tuned for more content about Web3, software engineering, and modern web development!`,
          published: true,
        },
      }),
      prisma.blogPost.create({
        data: {
          authorId: user.id,
          title: 'Building with Next.js 14 and Dynamic Auth',
          slug: 'building-with-nextjs-14-and-dynamic-auth',
          content: `# Building with Next.js 14 and Dynamic Auth

In this post, I'll share my experience building this portfolio site with the latest tech stack:

## Tech Stack
- **Next.js 14**: App Router with server components
- **TypeScript**: For type safety
- **Prisma**: Type-safe database ORM
- **Tailwind CSS**: For styling
- **Dynamic Labs**: Modern Web3 and social authentication

## Key Features
1. Server Components for better performance
2. Client-side authentication with Dynamic
3. Built-in SEO optimization
4. Hybrid authentication (wallet + social)

\`\`\`typescript
// Example of Dynamic auth usage
const { user, primaryWallet, setShowAuthFlow } = useDynamicContext();
\`\`\`

More technical posts coming soon!`,
          published: true,
        },
      }),
      prisma.blogPost.create({
        data: {
          authorId: user.id,
          title: 'Draft: The Future of Decentralized Publishing',
          slug: 'draft-future-of-decentralized-publishing',
          content: `# The Future of Decentralized Publishing

This is a draft post exploring ideas about decentralized content creation...`,
          published: false,
        },
      }),
    ]);
    console.log(`✅ Created ${posts.length} blog posts`);

    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
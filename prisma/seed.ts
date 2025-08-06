import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

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

    // Create test user with hashed password
    const hashedPassword = await argon2.hash('testpassword123');
    
    const user = await prisma.user.create({
      data: {
        username: 'kevinkabore',
        email: 'kevin@example.com',
        password: hashedPassword,
        walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f5b899',
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
          content: `# Welcome to My Web3 Blog

This is my first post on this decentralized blogging platform. Here's what makes it special:

- **Decentralized Content**: Posts are stored on IPFS
- **NFT Integration**: Each post can be minted as an NFT
- **Wallet Authentication**: Login with your Web3 wallet
- **Tipping**: Support creators directly with crypto

Stay tuned for more content about Web3, software engineering, and the future of decentralized applications!`,
          published: true,
        },
      }),
      prisma.blogPost.create({
        data: {
          authorId: user.id,
          title: 'Building with Next.js 15 and Web3',
          slug: 'building-with-nextjs-15-and-web3',
          content: `# Building with Next.js 15 and Web3

In this post, I'll share my experience building this portfolio site with the latest tech stack:

## Tech Stack
- **Next.js 15**: The latest version with App Router
- **TypeScript**: For type safety
- **Prisma**: Type-safe database ORM
- **Tailwind CSS**: For styling
- **Wagmi + Viem**: Modern Web3 libraries

## Key Features
1. Server Components for better performance
2. Edge Runtime support
3. Built-in SEO optimization
4. Progressive Web App capabilities

\`\`\`typescript
// Example of a Web3 hook
const { address, isConnected } = useAccount();
const { connect } = useConnect();
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
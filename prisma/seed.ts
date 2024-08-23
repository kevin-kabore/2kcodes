import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a new user
  const user = await prisma.user.create({
    data: {
      username: 'kevinkabore',
      email: 'kevin@example.com',
      password: 'securepassword', // Hash this in a real application
      walletAddress: '0x1234567890',
    },
  })

  // Create a new blog post
  const post = await prisma.blogPost.create({
    data: {
      authorId: user.id,
      title: 'My First Blog Post',
      content: {text: 'This is my first post!'},
      published: true,
    },
  })

  console.log('User and BlogPost created:', {user, post})
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

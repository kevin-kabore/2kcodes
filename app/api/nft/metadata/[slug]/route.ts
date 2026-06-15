import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * Serves Metaplex-standard NFT metadata JSON for a blog post.
 *
 * The on-chain NFT's `uri` points here (e.g. https://kevindotk.xyz/api/nft/metadata/<slug>),
 * so wallets and explorers resolve the post's name/description/image at this URL.
 * Self-hosting the metadata avoids needing an Irys/Arweave upload (and the devnet
 * SOL it requires) for v1.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = await db.blogPost.findUnique({
    where: { slug: params.slug },
    include: { author: true, category: true },
  })

  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') || 'https://kevindotk.xyz'

  const metadata = {
    name: post.title,
    symbol: 'KBLOG',
    description: post.excerpt || 'A blog post by Kevin Kabore, minted as an NFT.',
    image: post.coverImage || `${baseUrl}/og-image.png`,
    external_url: `${baseUrl}/blog/${post.slug}`,
    attributes: [
      { trait_type: 'Author', value: post.author.username },
      { trait_type: 'Category', value: post.category?.name ?? 'Uncategorized' },
      {
        trait_type: 'Published',
        value: post.publishedAt
          ? post.publishedAt.toISOString().split('T')[0]
          : '',
      },
    ],
    properties: {
      category: 'html',
      files: post.coverImage
        ? [{ uri: post.coverImage, type: 'image/png' }]
        : [],
    },
  }

  return NextResponse.json(metadata, {
    headers: { 'Cache-Control': 'public, max-age=60, s-maxage=300' },
  })
}

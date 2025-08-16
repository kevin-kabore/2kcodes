import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const updateNFTSchema = z.object({
  nftMinted: z.boolean(),
  nftMintAddress: z.string().optional(),
  nftMetadataUri: z.string().url().optional(),
  nftTxSignature: z.string().optional(),
  nftNetwork: z.enum(['devnet', 'testnet', 'mainnet']).optional(),
  nftMintedAt: z.string().datetime().optional(),
  nftRoyalty: z.number().min(0).max(10000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json()
    const validatedData = updateNFTSchema.parse(body)
    
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

    // Update the blog post with NFT information
    const updatedPost = await db.blogPost.update({
      where: { id: params.id },
      data: {
        nftMinted: validatedData.nftMinted,
        nftMintAddress: validatedData.nftMintAddress,
        nftMetadataUri: validatedData.nftMetadataUri,
        nftTxSignature: validatedData.nftTxSignature,
        nftNetwork: validatedData.nftNetwork,
        nftMintedAt: validatedData.nftMintedAt ? new Date(validatedData.nftMintedAt) : null,
        nftRoyalty: validatedData.nftRoyalty,
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
    console.error('Error updating NFT information:', error)
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
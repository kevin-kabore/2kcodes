import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { NFTCollection } from './nft-collection'

interface NFTProfilePageProps {
  searchParams: {
    wallet?: string
  }
}

async function getUserNFTs(walletAddress: string) {
  try {
    // First find the user by wallet address
    const user = await db.user.findFirst({
      where: {
        walletAddress: {
          equals: walletAddress,
          mode: 'insensitive'
        }
      }
    })

    if (!user) {
      return { user: null, nfts: [] }
    }

    // Get all NFT-minted blog posts by this user
    const nfts = await db.blogPost.findMany({
      where: {
        authorId: user.id,
        nftMinted: true,
        nftMintAddress: {
          not: null
        }
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            walletAddress: true
          }
        },
        tags: true,
        category: true
      },
      orderBy: {
        nftMintedAt: 'desc'
      }
    })

    return { user, nfts }
  } catch (error) {
    console.error('Failed to fetch user NFTs:', error)
    return { user: null, nfts: [] }
  }
}

export default async function NFTProfilePage({ searchParams }: NFTProfilePageProps) {
  const walletAddress = searchParams.wallet

  if (!walletAddress) {
    redirect('/profile')
  }

  const { user, nfts } = await getUserNFTs(walletAddress)

  const transformedNFTs = nfts.map(nft => ({
    ...nft,
    publishedAt: nft.publishedAt?.toISOString() || null,
    createdAt: nft.createdAt.toISOString(),
    updatedAt: nft.updatedAt.toISOString(),
    nftMintedAt: nft.nftMintedAt?.toISOString() || null,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NFT Collection</h1>
        {user ? (
          <div className="flex items-center gap-3 text-muted-foreground">
            <span>Wallet: {walletAddress}</span>
            <span>•</span>
            <span>Owner: {user.username}</span>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Wallet: {walletAddress}
          </p>
        )}
      </div>

      <NFTCollection nfts={transformedNFTs} walletAddress={walletAddress} />
    </div>
  )
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: NFTProfilePageProps) {
  const walletAddress = searchParams.wallet
  
  if (!walletAddress) {
    return {
      title: 'NFT Profile',
      description: 'View NFT collection'
    }
  }

  const { user } = await getUserNFTs(walletAddress)
  const title = user 
    ? `${user.username}'s NFT Collection` 
    : `NFT Collection - ${walletAddress.slice(0, 8)}...`

  return {
    title,
    description: `View blog post NFTs minted by ${user?.username || 'this wallet'}`
  }
}
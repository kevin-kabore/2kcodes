'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { NFTMintingModal } from '@/app/components/blog/nft-minting-modal'

interface BlogPostClientProps {
  post: {
    id: string
    title: string
    excerpt?: string | null
    content: string
    slug: string
    authorId: string
    coverImage?: string | null
    nftMinted: boolean
  }
}

export function BlogPostClient({ post }: BlogPostClientProps) {
  const { user } = useDynamicContext()
  const router = useRouter()
  const [showMint, setShowMint] = useState(false)

  // Only show actions to the post's author.
  if (!user || user.userId !== post.authorId) {
    return null
  }

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-lg font-semibold mb-4">Author Actions</h3>

      {post.nftMinted ? (
        <p className="text-sm text-muted-foreground">🎨 This post is minted as an NFT.</p>
      ) : (
        <button
          onClick={() => setShowMint(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition-opacity"
        >
          🎨 Mint as NFT
        </button>
      )}

      <NFTMintingModal
        isOpen={showMint}
        onClose={() => setShowMint(false)}
        blogPost={{
          id: post.id,
          title: post.title,
          excerpt: post.excerpt,
          content: post.content,
          slug: post.slug,
          authorId: post.authorId,
          coverImage: post.coverImage,
        }}
        onMintSuccess={async result => {
          try {
            await fetch(`/api/blog/posts/${post.id}/nft`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                nftMinted: true,
                nftMintAddress: result.mintAddress,
                nftMetadataUri: result.metadataUri,
                nftTxSignature: result.txSignature,
                nftNetwork: 'devnet',
                nftMintedAt: new Date().toISOString(),
              }),
            })
            router.refresh()
          } catch (error) {
            console.error('Failed to persist NFT info:', error)
          }
        }}
      />
    </div>
  )
}

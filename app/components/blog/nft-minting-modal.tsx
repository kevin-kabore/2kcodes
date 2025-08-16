'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useNFTMinting } from '@/hooks/use-nft-minting'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

interface NFTMintingModalProps {
  isOpen: boolean
  onClose: () => void
  blogPost: {
    id: string
    title: string
    excerpt?: string | null
    content: string
    slug: string
    authorId: string
    coverImage?: string | null
  }
  onMintSuccess?: (result: { mintAddress: string; metadataUri: string; txSignature: string }) => void
}

export function NFTMintingModal({ isOpen, onClose, blogPost, onMintSuccess }: NFTMintingModalProps) {
  const { setShowAuthFlow } = useDynamicContext()
  const [network, setNetwork] = useState<'devnet' | 'mainnet' | 'testnet'>('devnet')
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  const {
    isLoading,
    isUploading,
    isMinting,
    error,
    result,
    estimatedCost,
    mintNFT,
    estimateCost,
    clearError,
    reset,
    isWalletConnected
  } = useNFTMinting()

  useEffect(() => {
    if (isOpen && isWalletConnected) {
      estimateCost(network)
    }
  }, [isOpen, network, isWalletConnected, estimateCost])

  useEffect(() => {
    if (result?.success && result.mintAddress && result.metadataUri && result.txSignature) {
      onMintSuccess?.({
        mintAddress: result.mintAddress,
        metadataUri: result.metadataUri,
        txSignature: result.txSignature
      })
    }
  }, [result, onMintSuccess])

  const handleMint = async () => {
    clearError()
    const result = await mintNFT({
      blogPost: {
        ...blogPost,
        excerpt: blogPost.excerpt || undefined,
        coverImage: blogPost.coverImage || undefined
      },
      network
    })
    
    if (result?.success) {
      // Success will be handled by useEffect above
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Mint Blog Post as NFT</h2>
            <button
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          {!isWalletConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Connect your wallet to mint this blog post as an NFT
              </p>
              <button
                onClick={() => setShowAuthFlow(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Blog Post Preview */}
              <div className="border border-border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2">{blogPost.title}</h3>
                {blogPost.excerpt && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {blogPost.excerpt}
                  </p>
                )}
                {blogPost.coverImage && (
                  <Image
                    src={blogPost.coverImage}
                    alt={blogPost.title}
                    width={400}
                    height={128}
                    className="w-full h-32 object-cover rounded mt-2"
                  />
                )}
              </div>

              {/* Network Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Network
                </label>
                <select
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as any)}
                  disabled={isLoading}
                  className="w-full p-2 border border-border rounded-md bg-background"
                >
                  <option value="devnet">Devnet (Recommended for testing)</option>
                  <option value="testnet">Testnet</option>
                  <option value="mainnet">Mainnet</option>
                </select>
              </div>

              {/* Cost Estimation */}
              {estimatedCost && (
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Estimated Cost:</span>
                    <span className="font-medium">~{estimatedCost.toFixed(4)} SOL</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Includes mint account, metadata, and transaction fees
                  </p>
                </div>
              )}

              {/* Advanced Options */}
              <div className="mb-6">
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-sm text-primary hover:underline"
                >
                  {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                </button>
                
                {showAdvanced && (
                  <div className="mt-3 p-3 border border-border rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      <p>• Royalty: 5% (500 basis points)</p>
                      <p>• Metadata stored on IPFS/Arweave</p>
                      <p>• Creator: Your wallet address</p>
                      <p>• External URL: Links to your blog post</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg mb-4">
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Success Display */}
              {result?.success && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 p-3 rounded-lg mb-4">
                  <p className="text-sm font-medium mb-2">NFT Minted Successfully! 🎉</p>
                  <div className="text-xs space-y-1">
                    <p>Mint Address: {result.mintAddress}</p>
                    <p>Transaction: {result.txSignature}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted disabled:opacity-50"
                >
                  {result?.success ? 'Close' : 'Cancel'}
                </button>
                
                {!result?.success && (
                  <button
                    onClick={handleMint}
                    disabled={isLoading || !isWalletConnected}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isUploading ? 'Uploading Metadata...' : 
                     isMinting ? 'Minting NFT...' : 
                     isLoading ? 'Loading...' : 
                     'Mint NFT'}
                  </button>
                )}
              </div>

              {/* Loading States */}
              {(isUploading || isMinting) && (
                <div className="mt-4 text-center">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                  <span className="text-sm text-muted-foreground">
                    {isUploading ? 'Uploading metadata to IPFS...' : 'Processing transaction...'}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
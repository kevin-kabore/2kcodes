'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface NFTPost {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  coverImage?: string | null
  nftMintAddress: string | null
  nftMetadataUri?: string | null
  nftNetwork?: string | null
  nftTxSignature?: string | null
  nftMintedAt?: string | null
  nftRoyalty?: number | null
  author: {
    id: string
    username: string
    walletAddress?: string | null
  }
  tags: Array<{
    id: string
    name: string
    slug: string
  }>
  category?: {
    id: string
    name: string
    slug: string
  } | null
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface NFTCollectionProps {
  nfts: NFTPost[]
  walletAddress: string
}

export function NFTCollection({ nfts }: NFTCollectionProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'minted' | 'created' | 'views'>('minted')

  const sortedNFTs = [...nfts].sort((a, b) => {
    switch (sortBy) {
      case 'minted':
        return new Date(b.nftMintedAt || 0).getTime() - new Date(a.nftMintedAt || 0).getTime()
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      case 'views':
        return b.viewCount - a.viewCount
      default:
        return 0
    }
  })

  const getExplorerUrl = (signature: string, network: string) => {
    const baseUrls: Record<string, string> = {
      'mainnet': 'https://explorer.solana.com/tx/',
      'devnet': 'https://explorer.solana.com/tx/',
      'testnet': 'https://explorer.solana.com/tx/',
    }
    
    const baseUrl = baseUrls[network] || baseUrls.devnet
    const cluster = network !== 'mainnet' ? `?cluster=${network}` : ''
    
    return `${baseUrl}${signature}${cluster}`
  }

  if (nfts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-xl font-semibold mb-2">No NFTs Found</h3>
          <p className="text-muted-foreground mb-4">
            This wallet hasn&apos;t minted any blog post NFTs yet.
          </p>
          <Link
            href="/blog/write"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Write & Mint Your First Post
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Collection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {nfts.length}
          </div>
          <div className="text-sm text-muted-foreground">Total NFTs</div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {nfts.reduce((sum, nft) => sum + nft.viewCount, 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Views</div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {new Set(nfts.map(nft => nft.nftNetwork)).size}
          </div>
          <div className="text-sm text-muted-foreground">Networks</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1 border border-border rounded-md bg-background text-sm"
          >
            <option value="minted">Mint Date</option>
            <option value="created">Created Date</option>
            <option value="views">View Count</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* NFT Grid/List */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
        : "space-y-4"
      }>
        {sortedNFTs.map((nft) => (
          <NFTCard 
            key={nft.id} 
            nft={nft} 
            viewMode={viewMode}
            getExplorerUrl={getExplorerUrl}
          />
        ))}
      </div>
    </div>
  )
}

interface NFTCardProps {
  nft: NFTPost
  viewMode: 'grid' | 'list'
  getExplorerUrl: (signature: string, network: string) => string
}

function NFTCard({ nft, viewMode, getExplorerUrl }: NFTCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
        <div className="flex gap-4">
          {nft.coverImage && (
            <div className="flex-shrink-0">
              <Image
                src={nft.coverImage}
                alt={nft.title}
                width={120}
                height={80}
                className="w-30 h-20 object-cover rounded-md"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-lg truncate">
                <Link 
                  href={`/blog/${nft.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {nft.title}
                </Link>
              </h3>
              
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
                  🎨 NFT
                </span>
                {nft.nftNetwork && (
                  <span className="text-xs text-muted-foreground">
                    {nft.nftNetwork}
                  </span>
                )}
              </div>
            </div>
            
            {nft.excerpt && (
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {nft.excerpt}
              </p>
            )}
            
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                {nft.nftMintedAt && (
                  <span>
                    Minted {format(new Date(nft.nftMintedAt), 'MMM d, yyyy')}
                  </span>
                )}
                <span>{nft.viewCount} views</span>
              </div>
              
              <div className="flex items-center gap-2">
                {nft.nftTxSignature && nft.nftNetwork && (
                  <a
                    href={getExplorerUrl(nft.nftTxSignature, nft.nftNetwork)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View on Explorer
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {nft.coverImage && (
        <div className="aspect-video relative">
          <Image
            src={nft.coverImage}
            alt={nft.title}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded-full">
              🎨 NFT
            </span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          <Link 
            href={`/blog/${nft.slug}`}
            className="hover:text-primary transition-colors"
          >
            {nft.title}
          </Link>
        </h3>
        
        {nft.excerpt && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {nft.excerpt}
          </p>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{nft.viewCount} views</span>
            {nft.nftNetwork && (
              <span className="capitalize">{nft.nftNetwork}</span>
            )}
          </div>
          
          {nft.nftMintedAt && (
            <div className="text-xs text-muted-foreground">
              Minted {format(new Date(nft.nftMintedAt), 'MMM d, yyyy')}
            </div>
          )}
          
          {nft.nftMintAddress && (
            <div className="text-xs">
              <span className="text-muted-foreground">Mint: </span>
              <code className="font-mono text-xs">
                {nft.nftMintAddress.slice(0, 8)}...{nft.nftMintAddress.slice(-8)}
              </code>
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <Link
              href={`/blog/${nft.slug}`}
              className="text-sm text-primary hover:underline"
            >
              Read Post →
            </Link>
            
            {nft.nftTxSignature && nft.nftNetwork && (
              <a
                href={getExplorerUrl(nft.nftTxSignature, nft.nftNetwork)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Explorer ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
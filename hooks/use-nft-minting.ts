'use client'

import { useState, useCallback } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { isSolanaWallet } from '@dynamic-labs/solana'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  createNft,
  mplTokenMetadata,
} from '@metaplex-foundation/mpl-token-metadata'
import {
  generateSigner,
  percentAmount,
  signerIdentity,
} from '@metaplex-foundation/umi'
import bs58 from 'bs58'
import { createDynamicUmiSigner } from '@/lib/solana/dynamic-signer'

export type SolanaNetwork = 'devnet' | 'mainnet' | 'testnet'

const RPC_ENDPOINTS: Record<SolanaNetwork, string> = {
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
  mainnet: 'https://api.mainnet-beta.solana.com',
}

// Royalty paid to the creator on secondary sales, in basis points (500 = 5%).
const ROYALTY_BASIS_POINTS = 500

export interface BlogPostData {
  id: string
  title: string
  excerpt?: string
  content: string
  slug: string
  authorId: string
  coverImage?: string
}

export interface MintNFTParams {
  blogPost: BlogPostData
  network: SolanaNetwork
}

export interface MintResult {
  success: boolean
  mintAddress?: string
  metadataUri?: string
  txSignature?: string
  network?: SolanaNetwork
  error?: string
  message?: string
}

// Translate raw umi/web3.js send errors into something a user can act on.
function friendlyMintError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err)
  const lower = msg.toLowerCase()
  if (
    lower.includes('no record of a prior credit') ||
    lower.includes('insufficient') ||
    lower.includes('debit an account') ||
    lower.includes('needs devnet sol')
  ) {
    return 'Your wallet needs devnet SOL to mint. Get some free at faucet.solana.com (paste your address, pick Devnet), then try again.'
  }
  if (
    lower.includes('429') ||
    lower.includes('rate limit') ||
    lower.includes('too many requests')
  ) {
    return 'The Solana devnet RPC is busy right now. Wait a few seconds and try again.'
  }
  if (
    lower.includes('user rejected') ||
    lower.includes('rejected the request') ||
    lower.includes('declined')
  ) {
    return 'You declined the transaction in your wallet.'
  }
  return msg
}

export interface NFTMintingState {
  isLoading: boolean
  isUploading: boolean
  isMinting: boolean
  error: string | null
  result: MintResult | null
  estimatedCost: number | null
}

export function useNFTMinting() {
  const { primaryWallet } = useDynamicContext()
  const [state, setState] = useState<NFTMintingState>({
    isLoading: false,
    isUploading: false,
    isMinting: false,
    error: null,
    result: null,
    estimatedCost: null,
  })

  const updateState = useCallback((updates: Partial<NFTMintingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  const estimateCost = useCallback(
    async (_network: SolanaNetwork = 'devnet') => {
      // Rough on-chain cost: mint account rent + metadata + master edition +
      // transaction fees. Devnet SOL is free via airdrop.
      const cost = 0.012
      updateState({ estimatedCost: cost })
      return cost
    },
    [updateState]
  )

  const mintNFT = useCallback(
    async (params: MintNFTParams): Promise<MintResult | null> => {
      if (!primaryWallet) {
        updateState({ error: 'Wallet not connected' })
        return null
      }

      if (!isSolanaWallet(primaryWallet)) {
        updateState({ error: 'Connect a Solana wallet to mint this post' })
        return null
      }

      try {
        updateState({
          isLoading: true,
          isUploading: true,
          isMinting: false,
          error: null,
          result: null,
        })

        // Metadata is served by our own API route, so the only "upload" is
        // computing the stable URI the on-chain NFT will point at.
        const origin =
          process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, '') ||
          (typeof window !== 'undefined' ? window.location.origin : '')
        const metadataUri = `${origin}/api/nft/metadata/${params.blogPost.slug}`

        // Build a umi instance signed by the connected browser wallet.
        const walletSigner = await primaryWallet.getSigner()
        const umiSigner = createDynamicUmiSigner(walletSigner)
        const umi = createUmi(RPC_ENDPOINTS[params.network])
          .use(mplTokenMetadata())
          .use(signerIdentity(umiSigner))

        // Fail fast with a clear message if the wallet can't cover rent + fees,
        // which is the most common first-time failure (empty devnet wallet).
        const balance = await umi.rpc.getBalance(umiSigner.publicKey)
        if (balance.basisPoints < 5_000_000n) {
          throw new Error('Wallet needs devnet SOL')
        }

        updateState({ isUploading: false, isMinting: true })

        // The mint signer's public key becomes the NFT's mint address. It signs
        // in-browser (no wallet popup); the wallet signs as payer/creator.
        const mint = generateSigner(umi)

        const { signature } = await createNft(umi, {
          mint,
          name: params.blogPost.title,
          symbol: 'KBLOG',
          uri: metadataUri,
          sellerFeeBasisPoints: percentAmount(ROYALTY_BASIS_POINTS / 100, 2),
          isMutable: true,
        }).sendAndConfirm(umi)

        const result: MintResult = {
          success: true,
          mintAddress: mint.publicKey.toString(),
          metadataUri,
          txSignature: bs58.encode(signature),
          network: params.network,
          message: 'NFT minted successfully',
        }

        updateState({ isLoading: false, isMinting: false, result })
        return result
      } catch (error) {
        updateState({
          isLoading: false,
          isUploading: false,
          isMinting: false,
          error: friendlyMintError(error),
        })
        return null
      }
    },
    [primaryWallet, updateState]
  )

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isUploading: false,
      isMinting: false,
      error: null,
      result: null,
      estimatedCost: null,
    })
  }, [])

  return {
    ...state,
    mintNFT,
    estimateCost,
    clearError,
    reset,
    isWalletConnected: !!primaryWallet,
    walletAddress: primaryWallet?.address,
  }
}

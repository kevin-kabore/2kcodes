'use client'

import { useState, useCallback } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

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
  network: 'devnet' | 'mainnet' | 'testnet'
}

export interface MintResult {
  success: boolean
  mintAddress?: string
  metadataUri?: string
  txSignature?: string
  error?: string
  message?: string
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
    estimatedCost: null
  })

  const updateState = useCallback((updates: Partial<NFTMintingState>) => {
    setState(prev => ({ ...prev, ...updates }))
  }, [])

  const clearError = useCallback(() => {
    updateState({ error: null })
  }, [updateState])

  const estimateCost = useCallback(async (_network: 'devnet' | 'mainnet' | 'testnet' = 'devnet') => {
    try {
      updateState({ isLoading: true, error: null })
      // Mock estimation for now
      const cost = 0.002 // Approximate SOL cost for NFT minting
      updateState({ estimatedCost: cost, isLoading: false })
      return cost
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to estimate cost'
      updateState({ error: errorMessage, isLoading: false })
      return null
    }
  }, [updateState])

  const mintNFT = useCallback(async (params: MintNFTParams) => {
    if (!primaryWallet) {
      updateState({ error: 'Wallet not connected' })
      return null
    }

    try {
      updateState({ 
        isLoading: true, 
        isUploading: true, 
        error: null, 
        result: null 
      })

      updateState({ isUploading: false, isMinting: true })
      
      // Call the server-side NFT minting API
      const response = await fetch('/api/nft/mint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogPostId: params.blogPost.id,
          network: params.network,
          walletAddress: primaryWallet.address
        })
      })

      const result: MintResult = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Minting failed')
      }

      updateState({ 
        isLoading: false, 
        isMinting: false, 
        result,
        error: result.success ? null : result.error || 'Minting failed'
      })

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      updateState({ 
        isLoading: false, 
        isUploading: false, 
        isMinting: false, 
        error: errorMessage 
      })
      return null
    }
  }, [primaryWallet, updateState])

  const verifyNFT = useCallback(async (
    _mintAddress: string, 
    _network: 'devnet' | 'mainnet' | 'testnet' = 'devnet'
  ) => {
    try {
      updateState({ isLoading: true, error: null })
      // For now, return true for demo purposes
      // In production, you'd implement actual verification
      const isValid = true
      updateState({ isLoading: false })
      return isValid
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Verification failed'
      updateState({ error: errorMessage, isLoading: false })
      return false
    }
  }, [updateState])

  const reset = useCallback(() => {
    setState({
      isLoading: false,
      isUploading: false,
      isMinting: false,
      error: null,
      result: null,
      estimatedCost: null
    })
  }, [])

  return {
    ...state,
    mintNFT,
    verifyNFT,
    estimateCost,
    clearError,
    reset,
    isWalletConnected: !!primaryWallet,
    walletAddress: primaryWallet?.address
  }
}
'use client'

import { useState, useCallback } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { SolanaNFTMinter, MintNFTParams, MintResult } from '@/lib/solana/nft-minting'

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

  const estimateCost = useCallback(async (network: 'devnet' | 'mainnet' | 'testnet' = 'devnet') => {
    try {
      updateState({ isLoading: true, error: null })
      const minter = new SolanaNFTMinter(network)
      const cost = await minter.estimateMintCost()
      updateState({ estimatedCost: cost, isLoading: false })
      return cost
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to estimate cost'
      updateState({ error: errorMessage, isLoading: false })
      return null
    }
  }, [updateState])

  const mintNFT = useCallback(async (params: Omit<MintNFTParams, 'walletAdapter'>) => {
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

      const minter = new SolanaNFTMinter(params.network)
      
      updateState({ isUploading: false, isMinting: true })
      
      const result = await minter.mintBlogPostNFT({
        ...params,
        walletAdapter: primaryWallet
      })

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
    mintAddress: string, 
    network: 'devnet' | 'mainnet' | 'testnet' = 'devnet'
  ) => {
    try {
      updateState({ isLoading: true, error: null })
      const minter = new SolanaNFTMinter(network)
      const isValid = await minter.verifyNFT(mintAddress)
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
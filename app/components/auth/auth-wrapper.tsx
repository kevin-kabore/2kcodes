'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { ReactNode } from 'react'

interface AuthWrapperProps {
  children: ReactNode
  fallback?: ReactNode
  requireAuth?: boolean
}

/**
 * Client-side authentication wrapper that handles Dynamic Labs context
 * Use this to wrap components that need authentication
 */
export function AuthWrapper({ 
  children, 
  fallback = null, 
  requireAuth = false 
}: AuthWrapperProps) {
  const { user } = useDynamicContext()

  if (requireAuth && !user) {
    return fallback || (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Please connect your wallet to continue.</p>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Hook to safely use Dynamic context with proper error handling
 */
export function useSafeDynamicContext() {
  try {
    return useDynamicContext()
  } catch (error) {
    console.warn('Dynamic context not available:', error)
    return {
      user: null,
      primaryWallet: null,
      setShowAuthFlow: () => {},
      handleLogOut: () => {},
    }
  }
}
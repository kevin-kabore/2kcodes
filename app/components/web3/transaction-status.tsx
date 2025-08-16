'use client'

import { useState, useEffect } from 'react'
// Using simple SVG icons instead of lucide-react

export interface TransactionStatus {
  signature?: string
  status: 'pending' | 'confirming' | 'confirmed' | 'failed'
  error?: string
  confirmations?: number
  network?: string
}

interface TransactionStatusProps {
  transaction: TransactionStatus
  onRetry?: () => void
  onClose?: () => void
  className?: string
}

export function TransactionStatus({ 
  transaction, 
  onRetry, 
  onClose,
  className = "" 
}: TransactionStatusProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (transaction.status === 'confirmed' || transaction.status === 'failed') {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, 5000) // Auto-hide after 5 seconds

      return () => clearTimeout(timer)
    }
    return undefined
  }, [transaction.status, onClose])

  if (!isVisible) return null

  const getStatusIcon = () => {
    switch (transaction.status) {
      case 'pending':
      case 'confirming':
        return (
          <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        )
      case 'confirmed':
        return (
          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      case 'failed':
        return (
          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      default:
        return null
    }
  }

  const getStatusText = () => {
    switch (transaction.status) {
      case 'pending':
        return 'Transaction pending...'
      case 'confirming':
        return `Confirming transaction ${transaction.confirmations ? `(${transaction.confirmations} confirmations)` : '...'}`
      case 'confirmed':
        return 'Transaction confirmed!'
      case 'failed':
        return 'Transaction failed'
    }
  }

  const getStatusColor = () => {
    switch (transaction.status) {
      case 'pending':
      case 'confirming':
        return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/10'
      case 'confirmed':
        return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
      case 'failed':
        return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
    }
  }

  const getExplorerUrl = () => {
    if (!transaction.signature || !transaction.network) return null
    
    const baseUrls: Record<string, string> = {
      'mainnet': 'https://explorer.solana.com/tx/',
      'devnet': 'https://explorer.solana.com/tx/',
      'testnet': 'https://explorer.solana.com/tx/',
    }
    
    const baseUrl = baseUrls[transaction.network] || baseUrls.devnet
    const cluster = transaction.network !== 'mainnet' ? `?cluster=${transaction.network}` : ''
    
    return `${baseUrl}${transaction.signature}${cluster}`
  }

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${className}`}>
      <div className={`border rounded-lg p-4 shadow-lg ${getStatusColor()}`}>
        <div className="flex items-start gap-3">
          {getStatusIcon()}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-medium text-foreground">
                {getStatusText()}
              </p>
              
              {onClose && (
                <button
                  onClick={() => {
                    setIsVisible(false)
                    onClose()
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
            
            {transaction.error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-2">
                {transaction.error}
              </p>
            )}
            
            {transaction.signature && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Signature:</span>
                <code className="text-xs font-mono text-muted-foreground truncate">
                  {transaction.signature.slice(0, 8)}...{transaction.signature.slice(-8)}
                </code>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              {getExplorerUrl() && (
                <a
                  href={getExplorerUrl()!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  View on Explorer
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
              
              {transaction.status === 'failed' && onRetry && (
                <button
                  onClick={onRetry}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 underline"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for managing transaction status
export function useTransactionStatus() {
  const [transactions, setTransactions] = useState<Map<string, TransactionStatus>>(new Map())

  const addTransaction = (id: string, signature?: string, network?: string) => {
    setTransactions(prev => new Map(prev).set(id, {
      signature,
      network,
      status: 'pending'
    }))
  }

  const updateTransaction = (id: string, updates: Partial<TransactionStatus>) => {
    setTransactions(prev => {
      const newMap = new Map(prev)
      const existing = newMap.get(id)
      if (existing) {
        newMap.set(id, { ...existing, ...updates })
      }
      return newMap
    })
  }

  const removeTransaction = (id: string) => {
    setTransactions(prev => {
      const newMap = new Map(prev)
      newMap.delete(id)
      return newMap
    })
  }

  const getTransaction = (id: string) => {
    return transactions.get(id)
  }

  return {
    transactions: Array.from(transactions.entries()),
    addTransaction,
    updateTransaction,
    removeTransaction,
    getTransaction,
  }
}
'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useTransactionStatus, TransactionStatus } from './transaction-status'

interface TransactionContextType {
  transactions: [string, TransactionStatus][]
  addTransaction: (id: string, signature?: string, network?: string) => void
  updateTransaction: (id: string, updates: Partial<TransactionStatus>) => void
  removeTransaction: (id: string) => void
  getTransaction: (id: string) => TransactionStatus | undefined
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined)

interface TransactionProviderProps {
  children: ReactNode
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const transactionHook = useTransactionStatus()

  return (
    <TransactionContext.Provider value={transactionHook}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransaction() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider')
  }
  return context
}

// Enhanced hook for handling Web3 operations with automatic status tracking
export function useWeb3Operation() {
  const { addTransaction, updateTransaction, removeTransaction } = useTransaction()

  const executeOperation = async <T,>(
    operationId: string,
    operation: () => Promise<{ signature?: string; result: T }>,
    options?: {
      network?: string
      onSuccess?: (result: T) => void
      onError?: (error: Error) => void
      autoRemove?: boolean
    }
  ): Promise<T | null> => {
    try {
      // Start tracking the operation
      addTransaction(operationId, undefined, options?.network)

      // Execute the operation
      const { signature, result } = await operation()

      // Update with signature if available
      if (signature) {
        updateTransaction(operationId, {
          signature,
          status: 'confirming'
        })
      }

      // Mark as confirmed
      updateTransaction(operationId, {
        status: 'confirmed'
      })

      // Call success callback
      options?.onSuccess?.(result)

      // Auto-remove after delay if specified
      if (options?.autoRemove !== false) {
        setTimeout(() => {
          removeTransaction(operationId)
        }, 5000)
      }

      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      // Mark as failed
      updateTransaction(operationId, {
        status: 'failed',
        error: errorMessage
      })

      // Call error callback
      options?.onError?.(error instanceof Error ? error : new Error(errorMessage))

      return null
    }
  }

  return { executeOperation }
}
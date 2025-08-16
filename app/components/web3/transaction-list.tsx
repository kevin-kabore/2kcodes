'use client'

import { useTransaction } from './transaction-context'
import { TransactionStatus } from './transaction-status'

interface TransactionListProps {
  className?: string
}

export function TransactionList({ className = "" }: TransactionListProps) {
  const { transactions, removeTransaction } = useTransaction()

  if (transactions.length === 0) {
    return null
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {transactions.map(([id, transaction]) => (
        <TransactionStatus
          key={id}
          transaction={transaction}
          onClose={() => removeTransaction(id)}
          onRetry={() => {
            // Retry logic would be handled by the component that initiated the transaction
            console.log(`Retry requested for transaction ${id}`)
          }}
        />
      ))}
    </div>
  )
}
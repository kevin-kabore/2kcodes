'use client'

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID

  if (!environmentId || process.env.NEXT_PUBLIC_ENABLE_WEB3 !== 'true') {
    return <>{children}</>
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
        cssOverrides: `
          .dynamic-modal {
            --dynamic-font-family: inherit;
            --dynamic-border-radius: 0.5rem;
            --dynamic-primary-color: hsl(var(--primary));
            --dynamic-background-color: hsl(var(--background));
            --dynamic-text-primary: hsl(var(--foreground));
            --dynamic-text-secondary: hsl(var(--muted-foreground));
            --dynamic-border-color: hsl(var(--border));
            --dynamic-hover-color: hsl(var(--accent));
          }
        `,
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
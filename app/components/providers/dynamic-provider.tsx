'use client'

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core'
import { SolanaWalletConnectors } from '@dynamic-labs/solana'

export function DynamicProvider({ children }: { children: React.ReactNode }) {
  const environmentId = process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID

  if (!environmentId) {
    console.error('NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID is required')
    return <>{children}</>
  }

  return (
    <DynamicContextProvider
      settings={{
        environmentId,
        walletConnectors: [SolanaWalletConnectors],
        // Enable both wallet and social auth
        initialAuthenticationMode: 'connect-and-sign',
        
        // Enable social auth - Google should appear if configured in Dynamic dashboard
        
        // Custom styling to match your theme
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
          .dynamic-widget {
            --dynamic-modal-max-width: 420px;
          }
        `,
        
        // Event handlers for user authentication
        events: {
          onAuthSuccess: async (args: any) => {
            console.log('Dynamic auth success:', args);
            // Sync user with your backend
            try {
              await fetch('/api/auth/sync-user', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  user: args.user,
                }),
              });
            } catch (error) {
              console.error('Failed to sync user:', error);
            }
          },
          onLogout: () => {
            console.log('Dynamic logout');
            // Clear any local state if needed
          },
        },
      }}
    >
      {children}
    </DynamicContextProvider>
  )
}
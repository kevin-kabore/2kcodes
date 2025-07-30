import { WalletButton } from '@/app/components/web3/wallet-button'

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold">
              2kcodes
            </a>
            <div className="flex items-center gap-6">
              <a href="/blog" className="hover:text-primary">
                Blog
              </a>
              <a href="/blog/write" className="hover:text-primary">
                Write
              </a>
              <a href="/dashboard" className="hover:text-primary">
                Dashboard
              </a>
              <WalletButton />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
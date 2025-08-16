import { Navigation } from '@/app/components/navigation'

export default function BlogLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="pt-16">
        {children}
      </main>
    </div>
  )
}

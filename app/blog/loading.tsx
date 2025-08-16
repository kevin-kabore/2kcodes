export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
        <div className="h-10 w-28 bg-muted animate-pulse rounded"></div>
      </div>

      <div className="grid gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <article key={i} className="border border-border rounded-lg p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-4 w-20 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-16 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-12 bg-muted animate-pulse rounded"></div>
              </div>

              <div className="h-7 w-3/4 bg-muted animate-pulse rounded"></div>

              <div className="space-y-2">
                <div className="h-4 w-full bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-5/6 bg-muted animate-pulse rounded"></div>
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
              </div>

              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted animate-pulse rounded-full"></div>
                <div className="h-6 w-20 bg-muted animate-pulse rounded-full"></div>
              </div>

              <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
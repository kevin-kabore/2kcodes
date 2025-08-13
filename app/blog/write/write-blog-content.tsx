'use client'

import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { BlogEditor } from '@/app/components/blog/blog-editor'

export function WriteBlogContent() {
  const { user } = useDynamicContext()
  const router = useRouter()
  
  useEffect(() => {
    if (!user) {
      router.push('/blog')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Write a Blog Post</h1>
        <BlogEditor />
      </div>
    </div>
  )
}
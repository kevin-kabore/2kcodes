'use client'

import {useDynamicContext} from '@dynamic-labs/sdk-react-core'
import {useRouter} from 'next/navigation'
import {useEffect} from 'react'
import {
  BlogEditor,
  type BlogEditorInitialValues,
} from '@/app/components/blog/blog-editor'
import {AuthWrapper} from '@/app/components/auth/auth-wrapper'

// Thin client wrapper, mirroring app/blog/write/write-blog-content.tsx.
//
// BlogEditor requires `userId`, which is only available from the Dynamic client
// context (not server-side). The server page loads the post by slug and passes
// `postId` (update mode) plus `initialValues` to pre-populate the form.
export function EditBlogContent({
  postId,
  initialValues,
}: {
  postId: string
  initialValues?: BlogEditorInitialValues
}) {
  const {user, setShowAuthFlow} = useDynamicContext()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/blog')
    } else {
      // Ensure user is synced with database (same as the write flow).
      syncUserWithDatabase(user)
    }
  }, [user, router])

  const syncUserWithDatabase = async (user: any) => {
    try {
      const response = await fetch('/api/auth/sync-user', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user}),
      })
      const result = await response.json()
      console.log('User sync result:', result)
    } catch (error) {
      console.error('Failed to sync user:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Blog Post</h1>

        <AuthWrapper
          requireAuth
          fallback={
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold mb-4">
                Authentication Required
              </h2>
              <p className="text-muted-foreground mb-6">
                Please connect your wallet to edit this blog post.
              </p>
              <button
                onClick={() => setShowAuthFlow(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Connect Wallet
              </button>
            </div>
          }
        >
          <BlogEditor
            postId={postId}
            userId={user?.userId || ''}
            initialValues={initialValues}
          />
        </AuthWrapper>
      </div>
    </div>
  )
}

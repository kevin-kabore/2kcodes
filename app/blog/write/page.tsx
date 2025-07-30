import { BlogEditor } from '@/app/components/blog/blog-editor'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function WriteBlogPage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/blog/write')
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
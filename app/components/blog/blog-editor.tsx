'use client'

import {useState, useCallback} from 'react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z} from 'zod'
import slugify from 'slugify'
import {useTheme} from '@/app/contexts/theme-context'
import {useDynamicContext} from '@dynamic-labs/sdk-react-core'
import {NFTMintingModal} from './nft-minting-modal'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then(mod => mod.default),
  {ssr: false},
)

const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(1, 'Content is required'),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean(),
})

type BlogPostFormData = z.infer<typeof blogPostSchema>

export function BlogEditor({postId, userId}: {postId?: string; userId?: string}) {
  const router = useRouter()
  const {theme} = useTheme()
  const {primaryWallet} = useDynamicContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')
  const [showNFTModal, setShowNFTModal] = useState(false)
  const [savedPost, setSavedPost] = useState<any>(null)
  const [shouldMintNFT, setShouldMintNFT] = useState(false)

  const {
    register,
    handleSubmit,
    formState: {errors},
    watch,
    setValue,
    trigger,
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      published: false,
      content: '',
    },
  })

  const watchTitle = watch('title')
  const generateSlug = useCallback(() => {
    if (watchTitle) {
      return slugify(watchTitle, {lower: true, strict: true})
    }
    return ''
  }, [watchTitle])

  const onSubmit = async (data: BlogPostFormData) => {
    if (!userId) {
      alert('You must be logged in to create a blog post.')
      return
    }

    setIsSubmitting(true)
    try {
      const slug = generateSlug()
      const response = await fetch('/api/blog/posts', {
        method: postId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          slug,
          userId,
          coverImage: data.coverImage || null,
          tags: data.tags
            ?.split(',')
            .map(tag => tag.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save blog post')
      }

      const savedPost = await response.json()
      setSavedPost(savedPost)

      // If NFT minting is requested and wallet is connected, show NFT modal
      if (shouldMintNFT && primaryWallet && data.published) {
        setShowNFTModal(true)
      } else {
        // Show success message and redirect to blog listing
        alert(
          `Blog post "${savedPost.title}" ${
            data.published ? 'published' : 'saved as draft'
          } successfully!`,
        )
        router.push('/blog')
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert('Failed to save blog post. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter your blog post title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-destructive">
            {errors.title.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
          Excerpt (optional)
        </label>
        <textarea
          id="excerpt"
          {...register('excerpt')}
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Brief description of your post"
        />
        {errors.excerpt && (
          <p className="mt-1 text-sm text-destructive">
            {errors.excerpt.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="coverImage" className="block text-sm font-medium mb-2">
          Cover Image URL (optional)
        </label>
        <input
          id="coverImage"
          type="url"
          {...register('coverImage')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://example.com/image.jpg"
        />
        {errors.coverImage && (
          <p className="mt-1 text-sm text-destructive">
            {errors.coverImage.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2">
          Tags (comma-separated)
        </label>
        <input
          id="tags"
          type="text"
          {...register('tags')}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="web3, blockchain, ethereum"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Content</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPreviewMode('edit')}
              className={`px-3 py-1 text-sm rounded ${
                previewMode === 'edit'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('preview')}
              className={`px-3 py-1 text-sm rounded ${
                previewMode === 'preview'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
        <div data-color-mode={theme === 'dark' ? 'dark' : 'light'}>
          <MDEditor
            value={watch('content')}
            onChange={val => {
              const newContent = val || ''
              setValue('content', newContent)
              trigger('content')
            }}
            preview={previewMode}
            height={400}
          />
        </div>
        {errors.content && (
          <p className="mt-1 text-sm text-destructive">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register('published')}
            className="rounded border-border"
          />
          <span className="text-sm">Publish immediately</span>
        </label>
      </div>

      {/* NFT Minting Option */}
      {primaryWallet && (
        <div className="border border-border rounded-lg p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🎨</span>
            <h3 className="font-medium">NFT Minting</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Mint your blog post as an NFT on Solana after publishing
          </p>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={shouldMintNFT}
              onChange={(e) => setShouldMintNFT(e.target.checked)}
              className="rounded border-border"
            />
            <span className="text-sm">Mint as NFT after publishing</span>
          </label>
          {shouldMintNFT && (
            <p className="text-xs text-muted-foreground mt-2">
              Note: You can only mint published posts as NFTs. Ensure your wallet is connected to Solana.
            </p>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : postId ? 'Update Post' : 'Create Post'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/blog')}
          className="px-6 py-2 border border-border rounded-md hover:bg-muted"
        >
          Cancel
        </button>
      </div>

      {/* NFT Minting Modal */}
      {savedPost && (
        <NFTMintingModal
          isOpen={showNFTModal}
          onClose={() => {
            setShowNFTModal(false)
            setSavedPost(null)
            router.push('/blog')
          }}
          blogPost={{
            id: savedPost.id,
            title: savedPost.title,
            excerpt: savedPost.excerpt,
            content: savedPost.content,
            slug: savedPost.slug,
            authorId: savedPost.authorId,
            coverImage: savedPost.coverImage,
          }}
          onMintSuccess={async (result) => {
            // Update the blog post with NFT information
            try {
              await fetch(`/api/blog/posts/${savedPost.id}/nft`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  nftMinted: true,
                  nftMintAddress: result.mintAddress,
                  nftMetadataUri: result.metadataUri,
                  nftTxSignature: result.txSignature,
                  nftNetwork: 'devnet', // This should be dynamic based on the network used
                  nftMintedAt: new Date().toISOString(),
                }),
              })
              
              alert(`Blog post "${savedPost.title}" published and minted as NFT successfully! 🎉`)
            } catch (error) {
              console.error('Failed to update NFT information:', error)
              alert('NFT minted successfully, but failed to update database. Please contact support.')
            }
          }}
        />
      )}
    </form>
  )
}

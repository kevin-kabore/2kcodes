'use client'

import MarkdownPreview from '@uiw/react-markdown-preview'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Follow the app's theme class rather than the OS setting (data-color-mode="auto").
  const colorMode = mounted && resolvedTheme === 'dark' ? 'dark' : 'light'

  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <MarkdownPreview
        source={content}
        style={{ backgroundColor: 'transparent' }}
        data-color-mode={colorMode}
      />
    </article>
  )
}

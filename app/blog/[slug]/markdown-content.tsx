'use client'

import MarkdownPreview from '@uiw/react-markdown-preview'

interface MarkdownContentProps {
  content: string
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose prose-lg dark:prose-invert max-w-none">
      <MarkdownPreview
        source={content}
        style={{ backgroundColor: 'transparent' }}
        data-color-mode="auto"
      />
    </article>
  )
}
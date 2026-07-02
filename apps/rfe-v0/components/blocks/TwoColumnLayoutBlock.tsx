'use client'

import React from 'react'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import type { LexicalNode, LexicalRichText } from '@/lib/lexical-types'
import { isLexicalElementNode, isLexicalTextNode } from '@/lib/lexical-types'

type MediaValue = { url?: string; alt?: string } | number | null | undefined

type Props = {
  leftColumn?: LexicalRichText
  leftMedia?: MediaValue
  rightColumn?: LexicalRichText
  rightMedia?: MediaValue
  reverseOnMobile?: boolean
  sectionTone?: string
}

function renderSimpleText(node: LexicalNode): React.ReactNode {
  if (isLexicalTextNode(node)) return node.text
  if (!isLexicalElementNode(node)) return null

  const children = node.children?.map((child, i) => <span key={i}>{renderSimpleText(child)}</span>)
  if (node.type === 'paragraph') {
    return (
      <p className="text-sm leading-[2.1] font-light mb-4" style={{ color: 'rgba(245, 240, 235, 0.5)' }}>
        {children}
      </p>
    )
  }
  if (node.type === 'heading') {
    return (
      <h3 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--foreground)' }}>
        {children}
      </h3>
    )
  }
  return <>{children}</>
}

function getMediaUrl(media: MediaValue): string | null {
  if (!media || typeof media === 'number') return null
  return media.url || null
}

function ColumnContent({ richText, media }: { richText?: LexicalRichText; media?: MediaValue }) {
  const mediaUrl = getMediaUrl(media)

  return (
    <div className="flex-1 min-w-0">
      {mediaUrl && (
        <div className="relative aspect-[3/4] overflow-hidden mb-6">
          <Image
            src={mediaUrl}
            alt={typeof media === 'object' && media ? media.alt || '' : ''}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            style={{ filter: 'grayscale(0.2) brightness(0.9)' }}
          />
        </div>
      )}
      {richText?.root && renderSimpleText(richText.root)}
    </div>
  )
}

export function TwoColumnLayoutComponent({ leftColumn, leftMedia, rightColumn, rightMedia, reverseOnMobile, sectionTone }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''
  const reverseClass = reverseOnMobile ? 'flex-col-reverse lg:flex-row' : 'flex-col lg:flex-row'

  return (
    <section data-ai-element="two-column-layout" className={`relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24 ${toneClass}`}>
      <div
        ref={ref}
        className={`relative max-w-6xl mx-auto flex ${reverseClass} gap-10 lg:gap-16`}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2s var(--ease-quiet)',
        }}
      >
        <ColumnContent richText={leftColumn} media={leftMedia} />
        <ColumnContent richText={rightColumn} media={rightMedia} />
      </div>
    </section>
  )
}

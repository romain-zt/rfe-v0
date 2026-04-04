'use client'

import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  leftColumn?: { root: { children: any[] } }
  leftMedia?: { url?: string; alt?: string } | number | null
  rightColumn?: { root: { children: any[] } }
  rightMedia?: { url?: string; alt?: string } | number | null
  reverseOnMobile?: boolean
  sectionTone?: string
}

function renderSimpleText(node: any): React.ReactNode {
  if (!node) return null
  if (node.type === 'text') return node.text
  const children = node.children?.map((c: any, i: number) => <span key={i}>{renderSimpleText(c)}</span>)
  if (node.type === 'paragraph') return <p className="text-sm leading-[2.1] font-light mb-4" style={{ color: 'rgba(245, 240, 235, 0.5)' }}>{children}</p>
  if (node.type === 'heading') {
    return <h3 className="font-serif font-light mb-4" style={{ fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)', color: 'var(--foreground)' }}>{children}</h3>
  }
  return <>{children}</>
}

function getMediaUrl(media: Props['leftMedia']): string | null {
  if (!media || typeof media === 'number') return null
  return media.url || null
}

function ColumnContent({ richText, media }: { richText?: any; media?: any }) {
  const mediaUrl = getMediaUrl(media)

  return (
    <div className="flex-1 min-w-0">
      {mediaUrl && (
        <div className="relative aspect-[3/4] overflow-hidden mb-6">
          <Image
            src={mediaUrl}
            alt={typeof media === 'object' ? media?.alt || '' : ''}
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
    <section className={`relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24 ${toneClass}`}>
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

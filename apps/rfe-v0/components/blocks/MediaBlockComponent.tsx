'use client'

import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  media?: { url?: string; alt?: string } | number
  caption?: string
  size?: 'full' | 'contained'
}

export function MediaBlockComponent({ media, caption, size = 'full' }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  if (!media || typeof media === 'number') return null
  const url = media.url
  if (!url) return null

  const containerClass = size === 'full' ? 'w-full' : 'max-w-4xl mx-auto px-6 lg:px-16'

  return (
    <section className="py-8 lg:py-12">
      <div
        ref={ref}
        className={containerClass}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2s var(--ease-quiet)',
        }}
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={url}
            alt={media.alt || ''}
            fill
            className="object-cover"
            sizes={size === 'full' ? '100vw' : '(max-width: 1024px) 100vw, 896px'}
          />
        </div>
        {caption && (
          <p className="mt-3 text-xs text-center font-light" style={{ color: 'rgba(245, 240, 235, 0.35)' }}>
            {caption}
          </p>
        )}
      </div>
    </section>
  )
}

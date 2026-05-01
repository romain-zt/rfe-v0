'use client'

import { ResponsiveHeroPicture, type ImageFit } from '@/components/ResponsiveHeroPicture'
import { useReveal } from '@/hooks/useReveal'

type MediaRef = { url?: string } | number | null | undefined

type Props = {
  media?: MediaRef
  mediaMobile?: MediaRef
  caption?: string
  size?: 'full' | 'contained'
  imagePosition?: string
  imagePositionMobile?: string
  imageFit?: ImageFit | null
  imageFitMobile?: ImageFit | null
}

function getMediaUrl(media: MediaRef): string | null {
  if (!media || typeof media === 'number') return null
  return media.url || null
}

function normalizeFit(value: ImageFit | null | undefined): ImageFit | undefined {
  return value === 'cover' || value === 'contain' ? value : undefined
}

export function MediaBlockComponent({
  media,
  mediaMobile,
  caption,
  size = 'full',
  imagePosition = 'center center',
  imagePositionMobile,
  imageFit,
  imageFitMobile,
}: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  const desktopUrl = getMediaUrl(media)
  if (!desktopUrl) return null

  const mobileUrl = getMediaUrl(mediaMobile)
  const hasMobileVariant = Boolean(mobileUrl)
  const mobileSrc = mobileUrl || desktopUrl
  const mobilePosition = imagePositionMobile || imagePosition

  const containerClass = size === 'full' ? 'w-full' : 'max-w-4xl mx-auto px-6 lg:px-16'

  return (
    <section data-ai-element="media-block" className="py-8 lg:py-12">
      <div
        ref={ref}
        className={containerClass}
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2s var(--ease-quiet)',
        }}
      >
        <div className="relative aspect-video overflow-hidden">
          <ResponsiveHeroPicture
            desktopSrc={desktopUrl}
            mobileSrc={mobileSrc}
            hasMobileVariant={hasMobileVariant}
            desktopPosition={imagePosition}
            mobilePosition={mobilePosition}
            desktopFit={normalizeFit(imageFit) ?? 'cover'}
            mobileFit={normalizeFit(imageFitMobile)}
            alt=""
            priority={false}
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

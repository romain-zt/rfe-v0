import { CinematicHero } from '@/components/CinematicHero'
import { PageCinematicHero } from '@/components/PageCinematicHero'
import type { ImageFit } from '@/components/ResponsiveHeroPicture'
import { imagePositionToCss, type ImagePositionPreset } from '@rfe/cms/fields/imageDisplay'

type MediaRef = { url?: string } | number | null

type HeroData = {
  type: 'cinematic' | 'page' | 'minimal'
  headline?: string
  subtitle?: string
  label?: string
  media?: MediaRef
  mediaMobile?: MediaRef
  imagePosition?: ImagePositionPreset | string | null
  imagePositionMobile?: ImagePositionPreset | string | null
  imageFit?: ImageFit | null
  imageFitMobile?: ImageFit | null
}

function getMediaUrl(media: MediaRef | undefined): string {
  if (!media) return ''
  if (typeof media === 'number') return ''
  return media.url || ''
}

function normalizeFit(value: ImageFit | null | undefined): ImageFit | undefined {
  return value === 'cover' || value === 'contain' ? value : undefined
}

export function RenderHero({ hero }: { hero: HeroData }) {
  if (!hero) return null

  if (hero.type === 'cinematic') {
    const mediaUrl = getMediaUrl(hero.media)
    const mediaMobileUrl = getMediaUrl(hero.mediaMobile)
    const desktopPosition = imagePositionToCss(hero.imagePosition)
    const mobilePosition = hero.imagePositionMobile
      ? imagePositionToCss(hero.imagePositionMobile)
      : undefined
    return (
      <div id="hero" data-block-type="hero" data-hero-type="cinematic">
        <CinematicHero
          imageSrc={mediaUrl || undefined}
          imageSrcMobile={mediaMobileUrl || undefined}
          imagePosition={desktopPosition}
          imagePositionMobile={mobilePosition}
          imageFit={normalizeFit(hero.imageFit)}
          imageFitMobile={normalizeFit(hero.imageFitMobile)}
          headline={hero.headline}
          subtitle={hero.subtitle}
          label={hero.label}
        />
      </div>
    )
  }

  if (hero.type === 'page') {
    const mediaUrl = getMediaUrl(hero.media)
    const mediaMobileUrl = getMediaUrl(hero.mediaMobile)
    const desktopPosition = imagePositionToCss(hero.imagePosition)
    const mobilePosition = hero.imagePositionMobile
      ? imagePositionToCss(hero.imagePositionMobile)
      : undefined
    return (
      <div id="hero" data-block-type="hero" data-hero-type="page">
        <PageCinematicHero
          imageSrc={mediaUrl || undefined}
          imageSrcMobile={mediaMobileUrl || undefined}
          imagePosition={desktopPosition}
          imagePositionMobile={mobilePosition}
          imageFit={normalizeFit(hero.imageFit)}
          imageFitMobile={normalizeFit(hero.imageFitMobile)}
          label={hero.label || ''}
          subtitle={hero.subtitle}
        >
          {hero.headline || ''}
        </PageCinematicHero>
      </div>
    )
  }

  if (hero.type === 'minimal') {
    return (
      <div id="hero" data-block-type="hero" data-hero-type="minimal" className="pt-32 pb-16 text-center">
        {hero.label && (
          <p data-ai-field="hero.label" className="text-[9px] uppercase tracking-[0.42em] font-light mb-6" style={{ color: 'var(--rfe-gold-dim)' }}>
            {hero.label}
          </p>
        )}
        {hero.headline && (
          <h1 data-ai-field="hero.headline" className="text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {hero.headline}
          </h1>
        )}
        {hero.subtitle && (
          <p data-ai-field="hero.subtitle" className="text-muted-foreground">{hero.subtitle}</p>
        )}
      </div>
    )
  }

  return null
}

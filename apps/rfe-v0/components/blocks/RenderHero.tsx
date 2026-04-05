import { CinematicHero } from '@/components/CinematicHero'
import { PageCinematicHero } from '@/components/PageCinematicHero'

type HeroData = {
  type: 'cinematic' | 'page' | 'minimal'
  headline?: string
  subtitle?: string
  label?: string
  media?: { url?: string } | number | null
  imagePosition?: string
}

function getMediaUrl(media: HeroData['media']): string {
  if (!media) return ''
  if (typeof media === 'number') return ''
  return media.url || ''
}

export function RenderHero({ hero }: { hero: HeroData }) {
  if (!hero) return null

  if (hero.type === 'cinematic') {
    return (
      <div id="hero" data-block-type="hero" data-hero-type="cinematic">
        <CinematicHero />
      </div>
    )
  }

  if (hero.type === 'page') {
    const mediaUrl = getMediaUrl(hero.media)
    return (
      <div id="hero" data-block-type="hero" data-hero-type="page">
        <PageCinematicHero
          imageSrc={mediaUrl || '/assets/works/margret-stevie.png'}
          imagePosition={hero.imagePosition || 'center 30%'}
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

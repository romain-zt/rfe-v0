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
    return <CinematicHero />
  }

  if (hero.type === 'page') {
    const mediaUrl = getMediaUrl(hero.media)
    return (
      <PageCinematicHero
        imageSrc={mediaUrl || '/assets/works/margret-stevie.png'}
        imagePosition={hero.imagePosition || 'center 30%'}
        label={hero.label || ''}
        subtitle={hero.subtitle}
      >
        {hero.headline || ''}
      </PageCinematicHero>
    )
  }

  if (hero.type === 'minimal') {
    return (
      <div className="pt-32 pb-16 text-center">
        {hero.label && (
          <p className="text-[9px] uppercase tracking-[0.42em] font-light mb-6" style={{ color: 'var(--rfe-gold-dim)' }}>
            {hero.label}
          </p>
        )}
        {hero.headline && (
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {hero.headline}
          </h1>
        )}
        {hero.subtitle && (
          <p className="text-muted-foreground">{hero.subtitle}</p>
        )}
      </div>
    )
  }

  return null
}

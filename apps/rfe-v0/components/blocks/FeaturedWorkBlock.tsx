'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'

type Props = {
  work?: { title?: string; year?: number; poster?: { url?: string } | number; slug?: string; tags?: string[] } | number | null
  overridePoster?: { url?: string } | number | null
  quote?: string
  attribution?: string
  externalUrl?: string
  sectionTone?: string
}

function getPosterUrl(props: Props): string {
  if (props.overridePoster && typeof props.overridePoster === 'object' && props.overridePoster.url) return props.overridePoster.url
  if (props.work && typeof props.work === 'object' && props.work.poster && typeof props.work.poster === 'object') return props.work.poster.url || ''
  return ''
}

export function FeaturedWorkComponent(props: Props) {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { ref: infoRef, isVisible: infoVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })
  const { lang } = useLanguage()
  const toneClass = props.sectionTone && props.sectionTone !== 'default' ? `section-tone-${props.sectionTone}` : 'section-tone-ember'

  const work = typeof props.work === 'object' ? props.work : null
  const posterUrl = getPosterUrl(props)
  const title = work?.title || ''
  const year = work?.year || ''
  const tags = work?.tags || []

  return (
    <section className={`relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 overflow-hidden ${toneClass} section-bleed-top section-bleed-bottom`}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 75% 60% at 72% 38%, rgba(181, 151, 90, 0.06) 0%, transparent 55%), radial-gradient(ellipse 40% 40% at 15% 80%, rgba(139, 26, 26, 0.025) 0%, transparent 50%)' }} aria-hidden="true" />

      <div className="relative max-w-6xl mx-auto" style={{ zIndex: 2 }}>
        <div ref={titleRef} className="mb-16 lg:mb-20" style={{ letterSpacing: titleVisible ? '0.42em' : '0.08em', opacity: titleVisible ? 1 : 0, transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)' }}>
          <span className="text-[9px] uppercase font-light" style={{ color: 'var(--rfe-gold-dim)' }}>in the spotlight</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          <div ref={cardRef} className="relative" style={{ opacity: cardVisible ? 1 : 0, transition: 'opacity 2.5s var(--ease-quiet)' }}>
            {posterUrl && (
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: '#090809' }}>
                <Image src={posterUrl} alt={title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" style={{ filter: cardVisible ? 'grayscale(0.2) brightness(0.9)' : 'grayscale(1) brightness(0.6)', transition: 'filter 3s var(--ease-quiet)' }} />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)' }} aria-hidden="true" />
              </div>
            )}
            {year && <p className="mt-3 text-[10px] tracking-[0.25em] uppercase" style={{ color: 'var(--rfe-gold-dim)' }}>{year}</p>}
          </div>

          <div ref={infoRef} className="lg:pt-6">
            <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '1.5rem' }}>
              <h2 className="font-serif font-light text-balance" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.15, letterSpacing: '-0.01em', color: 'var(--foreground)', transform: infoVisible ? 'translateY(0)' : 'translateY(110%)', transition: 'transform 1.6s var(--ease-emerge)' }}>
                {title}
              </h2>
            </div>

            {props.quote && (
              <div className="border-l-2 pl-5 mb-10" style={{ borderColor: 'var(--rfe-gold)', opacity: infoVisible ? 0.8 : 0, transition: 'opacity 2s var(--ease-quiet) 0.5s' }}>
                <blockquote className="font-serif font-light italic text-sm leading-relaxed mb-2" style={{ color: 'rgba(245, 240, 235, 0.65)' }}>
                  &ldquo;{props.quote}&rdquo;
                </blockquote>
                {props.attribution && props.externalUrl && (
                  <a href={props.externalUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-500" style={{ color: 'var(--rfe-gold-dim)' }}>
                    {props.attribution} ↗
                  </a>
                )}
              </div>
            )}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-10" style={{ opacity: infoVisible ? 1 : 0, transition: 'opacity 2s var(--ease-quiet) 0.7s' }}>
                {tags.map((tag) => (
                  <span key={tag} className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5" style={{ color: 'rgba(245, 240, 235, 0.28)', border: '1px solid rgba(245, 240, 235, 0.05)', borderRadius: '100px' }}>
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <Link href={`/${lang}/our-work`} className="inline-block text-[10px] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-700" style={{ color: 'var(--rfe-rose-dim)', borderColor: 'rgba(196, 160, 160, 0.18)', opacity: infoVisible ? 1 : 0, transition: 'opacity 2s var(--ease-quiet) 0.9s' }}>
              see all work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

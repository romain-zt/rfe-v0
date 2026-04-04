'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'
import { useRef, useEffect, useState, useCallback } from 'react'

type ScrollItem = {
  work?: { title?: string; year?: number; poster?: { url?: string } | number; slug?: string } | number | null
  media?: { url?: string; alt?: string } | number | null
  label?: string
  size?: 'large' | 'medium' | 'small'
}

type RelationRef = number | { id: number; [key: string]: unknown }

type WorksGroupRef = {
  items?: RelationRef[]
} | number | null

type Props = {
  title?: string
  sourceType?: 'all' | 'pick' | 'group' | 'manual'
  selectedWorks?: RelationRef[] | null
  worksGroup?: WorksGroupRef
  items?: ScrollItem[]
  ctaLabel?: string
  ctaUrl?: string
  sectionTone?: string
}

function getImageUrl(item: ScrollItem): string {
  if (item.media && typeof item.media === 'object' && item.media.url) return item.media.url
  if (item.work && typeof item.work === 'object' && item.work.poster && typeof item.work.poster === 'object') return item.work.poster.url || ''
  return ''
}

function getTitle(item: ScrollItem): string {
  if (item.work && typeof item.work === 'object') return item.work.title || ''
  return item.label || ''
}

function getYear(item: ScrollItem): string {
  if (item.work && typeof item.work === 'object') return String(item.work.year || '')
  return ''
}

function extractIds(refs: RelationRef[] | WorksGroupRef | null | undefined): number[] | null {
  if (!refs) return null
  if (typeof refs === 'number') return null
  if (Array.isArray(refs)) {
    const ids = refs.map((r) => (typeof r === 'number' ? r : r.id))
    return ids.length > 0 ? ids : null
  }
  if ('items' in refs && Array.isArray(refs.items)) {
    const ids = refs.items.map((r) => (typeof r === 'number' ? r : r.id))
    return ids.length > 0 ? ids : null
  }
  return null
}

export function WorksScrollComponent({ title, sourceType, selectedWorks, worksGroup, items, ctaLabel, ctaUrl, sectionTone }: Props) {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { lang, content } = useLanguage()
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : 'section-tone-warm'

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 0) setScrollProgress(el.scrollLeft / maxScroll)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  const allWorks = content?.ourWork || []

  const curatedIds = (() => {
    if (sourceType === 'pick') return extractIds(selectedWorks)
    if (sourceType === 'group') return extractIds(worksGroup)
    if (sourceType === 'manual') return null
    return extractIds(selectedWorks) ?? extractIds(worksGroup)
  })()

  const displayItems: ScrollItem[] = (() => {
    if (sourceType === 'manual' && items && items.length > 0) return items
    if (!sourceType && items && items.length > 0) return items

    const sourceWorks = curatedIds
      ? (() => {
          const worksById = new Map(allWorks.map((w) => [w.id, w]))
          return curatedIds.map((id) => worksById.get(id)).filter(Boolean) as typeof allWorks
        })()
      : allWorks.filter(w => !w.category && w.src).slice(0, 10)

    return sourceWorks.map((w, i) => ({
      work: { title: w.title, year: w.year, poster: { url: w.src }, slug: w.slug },
      size: (i % 3 === 0 ? 'large' : i % 3 === 1 ? 'medium' : 'small') as ScrollItem['size'],
    }))
  })()

  if (displayItems.length === 0) return null

  return (
    <section className={`relative py-20 lg:py-32 overflow-hidden ${toneClass} section-bleed-top section-bleed-bottom`}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 26, 26, 0.035) 0%, transparent 60%)' }} aria-hidden="true" />

      <div className="relative">
        <div ref={titleRef} className="px-6 lg:px-16 mb-12 flex items-end justify-between">
          <div style={{ opacity: titleVisible ? 1 : 0, transition: 'opacity 1.5s var(--ease-quiet)' }}>
            <span className="text-[9px] uppercase block mb-4 font-light" style={{ color: 'var(--rfe-gold-dim)', letterSpacing: titleVisible ? '0.42em' : '0.08em', transition: 'letter-spacing 2.2s var(--ease-quiet)' }}>
              {title || 'Our Work'}
            </span>
          </div>
          {ctaUrl && (
            <Link href={`/${lang}${ctaUrl}`} className="text-[10px] tracking-[0.25em] uppercase pb-0.5 border-b transition-colors duration-500 hidden sm:inline-block" style={{ color: 'var(--rfe-gold-dim)', borderColor: 'rgba(181, 151, 90, 0.15)' }}>
              {ctaLabel || 'see all'} ↗
            </Link>
          )}
        </div>

        <div ref={scrollRef} className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden px-6 lg:px-16 pb-4 snap-x snap-mandatory no-scrollbar">
          {displayItems.map((item, i) => {
            const imgUrl = getImageUrl(item)
            const itemTitle = getTitle(item)
            const year = getYear(item)
            const size = item.size || 'large'
            const width = size === 'large' ? 'clamp(260px, 32vw, 400px)' : size === 'medium' ? 'clamp(200px, 24vw, 310px)' : 'clamp(140px, 16vw, 200px)'
            const aspect = size === 'large' ? '3/4' : size === 'medium' ? '2/3' : '1/1'

            return (
              <div key={i} className="relative flex-shrink-0 snap-start group" style={{ width, marginTop: i % 2 === 0 ? '0' : '2.5rem' }}>
                <div className="relative overflow-hidden" style={{ aspectRatio: aspect }}>
                  {imgUrl && (
                    <Image src={imgUrl} alt={itemTitle} fill className="object-cover transition-all duration-[1.5s] group-hover:scale-[1.04]" sizes="(max-width: 768px) 60vw, 32vw" style={{ filter: 'grayscale(0.35) brightness(0.88)' }} />
                  )}
                  <div className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-40" style={{ background: 'linear-gradient(to top, rgba(7, 7, 8, 0.65) 0%, transparent 55%)' }} aria-hidden="true" />
                  {item.label && (
                    <span className="absolute top-3 left-3 text-[8px] uppercase tracking-[0.28em] font-light px-2 py-1" style={{ color: 'var(--rfe-gold-dim)', background: 'rgba(7, 7, 8, 0.55)', backdropFilter: 'blur(6px)' }}>
                      {item.label}
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <p className="font-serif text-[12px] md:text-sm font-light tracking-wide" style={{ color: 'rgba(245, 240, 235, 0.55)' }}>{itemTitle}</p>
                  {year && <p className="text-[9px] tracking-[0.2em] mt-1" style={{ color: 'rgba(245, 240, 235, 0.2)' }}>{year}</p>}
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-6 lg:px-16 mt-6 flex items-center gap-4">
          <div className="h-px flex-1 max-w-xs" style={{ background: 'rgba(245, 240, 235, 0.06)' }}>
            <div className="h-full transition-all duration-150" style={{ width: `${Math.max(20, scrollProgress * 100)}%`, background: 'var(--rfe-gold-dim)', opacity: 0.4 }} />
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'
import { useRef, useEffect, useState, useCallback, type PointerEvent as ReactPointerEvent } from 'react'
import { posterPreviewWidth } from '@rfe/design-tokens'
import { getWorkSlug } from '@/lib/works'
import type { WorkItem } from '@/lib/i18n/types'

type ScrollItem = {
  work?: { title?: string; year?: number; poster?: { url?: string } | number; slug?: string } | number | null
  media?: { url?: string; alt?: string } | number | null
  label?: string
  size?: 'large' | 'medium' | 'small'
}

type RelationRef = number | { id: number;[key: string]: unknown }

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

function getItemSlug(item: ScrollItem, allWorks: WorkItem[]): string | null {
  if (!item.work || typeof item.work !== 'object') return null

  const explicitSlug = (item.work.slug || '').trim()
  if (explicitSlug) return explicitSlug

  const workTitle = item.work.title
  if (workTitle) {
    const match = allWorks.find((w) => w.title === workTitle)
    if (match) return getWorkSlug(match)
    return getWorkSlug({ title: workTitle, slug: '' })
  }

  return null
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
  const dragState = useRef<{
    isDown: boolean
    startX: number
    startScrollLeft: number
    pointerId: number | null
    hasDragged: boolean
  }>({
    isDown: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: null,
    hasDragged: false,
  })
  const autoScrollIntervalRef = useRef<number | null>(null)
  const interactionDebounceTimeoutRef = useRef<number | null>(null)
  const autoScrollEnabledRef = useRef(false)
  const isAutoScrollingRef = useRef(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { lang, content, t } = useLanguage()
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : 'section-tone-warm'

  const getSnapPositions = useCallback((): number[] => {
    if (!scrollRef.current) return []

    const el = scrollRef.current
    const children = Array.from(el.querySelectorAll<HTMLElement>('[data-works-scroll-item="true"]'))
    return children.map((child) => child.offsetLeft)
  }, [])

  const getNearestSnapIndex = useCallback((positions: number[], scrollLeft: number): number => {
    if (positions.length === 0) return 0

    let bestIndex = 0
    const first = positions[0]
    if (first === undefined) return 0
    let bestDistance = Math.abs(first - scrollLeft)
    for (let i = 1; i < positions.length; i += 1) {
      const value = positions[i]
      if (value === undefined) continue
      const dist = Math.abs(value - scrollLeft)
      if (dist < bestDistance) {
        bestDistance = dist
        bestIndex = i
      }
    }
    return bestIndex
  }, [])

  const scrollToSnapIndex = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const el = scrollRef.current
    if (!el) return

    const positions = getSnapPositions()
    if (positions.length === 0) return

    const len = positions.length
    const safeIndex = ((index % len) + len) % len
    el.scrollTo({ left: positions[safeIndex], behavior })
  }, [getSnapPositions])

  const scrollToRelative = useCallback((dir: 1 | -1) => {
    const el = scrollRef.current
    if (!el) return

    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll <= 0) return

    const positions = getSnapPositions()
    if (positions.length === 0) return

    const edgeTolerancePx = 4
    const isAtStart = el.scrollLeft <= edgeTolerancePx
    const isAtEnd = el.scrollLeft >= maxScroll - edgeTolerancePx

    const wrapTargetIndex =
      dir === 1 ? (isAtEnd ? 0 : null) : (isAtStart ? positions.length - 1 : null)

    if (wrapTargetIndex !== null) {
      scrollToSnapIndex(wrapTargetIndex, 'smooth')
      return
    }

    const nearestIndex = getNearestSnapIndex(positions, el.scrollLeft)
    scrollToSnapIndex(nearestIndex + dir, 'smooth')
  }, [getNearestSnapIndex, getSnapPositions, scrollToSnapIndex])

  const stopAutoScroll = useCallback(() => {
    if (autoScrollIntervalRef.current !== null) {
      window.clearInterval(autoScrollIntervalRef.current)
      autoScrollIntervalRef.current = null
    }
  }, [])

  const startAutoScroll = useCallback(() => {
    if (!autoScrollEnabledRef.current) return
    if (!scrollRef.current) return

    stopAutoScroll()

    autoScrollIntervalRef.current = window.setInterval(() => {
      isAutoScrollingRef.current = true
      scrollToRelative(1)
      window.setTimeout(() => {
        isAutoScrollingRef.current = false
      }, 1200)
    }, 5000)
  }, [scrollToRelative, stopAutoScroll])

  const markUserInteraction = useCallback(() => {
    if (!autoScrollEnabledRef.current) return

    // Stoppe tout de suite l'auto pour que le reset du timer soit immédiat.
    stopAutoScroll()

    if (interactionDebounceTimeoutRef.current !== null) {
      window.clearTimeout(interactionDebounceTimeoutRef.current)
    }

    // Reset “après relâchement” pour éviter de repousser sans fin pendant un scroll continu.
    interactionDebounceTimeoutRef.current = window.setTimeout(() => {
      startAutoScroll()
    }, 200)
  }, [startAutoScroll, stopAutoScroll])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const el = scrollRef.current
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 0) setScrollProgress(el.scrollLeft / maxScroll)

    if (!isAutoScrollingRef.current) markUserInteraction()
  }, [markUserInteraction])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    autoScrollEnabledRef.current = mq.matches

    if (mq.matches) startAutoScroll()

    const onChange = () => {
      autoScrollEnabledRef.current = mq.matches
      if (mq.matches) startAutoScroll()
      else stopAutoScroll()
    }

    mq.addEventListener('change', onChange)
    return () => {
      mq.removeEventListener('change', onChange)
      stopAutoScroll()
      if (interactionDebounceTimeoutRef.current !== null) {
        window.clearTimeout(interactionDebounceTimeoutRef.current)
        interactionDebounceTimeoutRef.current = null
      }
    }
  }, [startAutoScroll, stopAutoScroll])

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    // Sur mobile/tactile, le scroll natif marche déjà.
    if (e.pointerType !== 'mouse') return
    if (!autoScrollEnabledRef.current) return
    if (!scrollRef.current) return

    isAutoScrollingRef.current = false

    dragState.current.isDown = true
    dragState.current.startX = e.clientX
    dragState.current.startScrollLeft = scrollRef.current.scrollLeft
    dragState.current.pointerId = e.pointerId
    dragState.current.hasDragged = false

    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {
      // Certains environnements peuvent ne pas supporte setPointerCapture: on ignore.
    }
  }, [])

  const endDrag = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== e.pointerId) return

    dragState.current.isDown = false
    dragState.current.pointerId = null

    try {
      e.currentTarget.releasePointerCapture(e.pointerId)
    } catch {
      // Ignore si la capture n'est pas active.
    }
  }, [])

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragState.current.isDown) return
    if (dragState.current.pointerId !== e.pointerId) return
    if (!scrollRef.current) return

    const dx = e.clientX - dragState.current.startX
    if (Math.abs(dx) > 5) dragState.current.hasDragged = true
    scrollRef.current.scrollLeft = dragState.current.startScrollLeft - dx
  }, [])

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

    return sourceWorks.map((w) => ({
      work: { title: w.title, year: w.year, poster: { url: w.src }, slug: w.slug },
    }))
  })()

  if (displayItems.length === 0) return null

  return (
    <div>
      {/* <button
        type="button"
        aria-label="Faire défiler vers la gauche"
        className="group flex pointer-events-auto items-center justify-center absolute left-3 sm:left-6 lg:left-16 top-0 bottom-0 z-20 w-14 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rfe-gold-dim) cursor-pointer"
        onPointerDown={(e) => {
          // Empêche le drag-to-scroll du conteneur de capter le clic sur certaines zones (haut/bas).
          e.stopPropagation()
        }}
        onClick={() => {
          scrollToRelative(-1)
          markUserInteraction()
        }}
      >
        <span
          aria-hidden="true"
          className="absolute w-11 h-11 rounded-full border border-[rgba(245,240,235,0.22)] backdrop-blur-md bg-linear-to-b from-[rgba(7,7,8,0.55)] to-[rgba(7,7,8,0.10)] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-colors group-hover:border-[rgba(245,240,235,0.5)]"
          style={{ opacity: 0.75 }}
        />
        <span aria-hidden="true" className="relative z-10 text-[20px] leading-none" style={{ color: 'var(--rfe-gold-dim)' }}>
          &lt;
        </span>
      </button> */}
      <section data-ai-element="works-scroll" className={`relative py-20 lg:py-32 overflow-hidden ${toneClass} section-bleed-top section-bleed-bottom`}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 26, 26, 0.035) 0%, transparent 60%)' }} aria-hidden="true" />

        <div className="relative">
          <div ref={titleRef} className="px-6 lg:px-16 mb-12 flex items-end justify-between">
            <div style={{ opacity: titleVisible ? 1 : 0, transition: 'opacity 1.5s var(--ease-quiet)' }}>
              <span
                data-ai-field="worksScroll.title"
                className="text-base lg:text-lg uppercase block mb-4 font-light"
                style={{
                  color: 'var(--rfe-gold-dim)',
                  letterSpacing: titleVisible ? '0.38em' : '0.08em',
                  transition: 'letter-spacing 2.2s var(--ease-quiet)',
                }}
              >
                {title || 'Our Work'}
              </span>
            </div>
            {ctaUrl && (
              <Link href={`/${lang}${ctaUrl}`} className="text-[10px] tracking-[0.25em] uppercase pb-0.5 border-b transition-colors duration-500 hidden sm:inline-block" style={{ color: 'var(--rfe-gold-dim)', borderColor: 'rgba(181, 151, 90, 0.15)' }}>
                {ctaLabel || 'see all'} ↗
              </Link>
            )}
          </div>

          <div className="relative">


            <div
              ref={scrollRef}
              className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden px-6 lg:px-16 pb-4 snap-x snap-mandatory no-scrollbar select-none"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            >
              {displayItems.map((item, i) => {
                const imgUrl = getImageUrl(item)
                const itemTitle = getTitle(item)
                const year = getYear(item)
                const slug = getItemSlug(item, allWorks)
                const href = slug ? `/${lang}/our-work/${slug}` : null

                const cardContent = (
                  <>
                    <div className="relative overflow-hidden poster-preview-frame exhibition-frame cursor-pointer">
                      {imgUrl && (
                        <Image
                          src={imgUrl}
                          alt={itemTitle}
                          fill
                          className="object-cover transition-all duration-[1.5s] group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 70vw, 360px"
                          style={{ filter: 'grayscale(0.35) brightness(0.88)' }}
                        />
                      )}
                      <div
                        className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-40"
                        style={{ background: 'linear-gradient(to top, rgba(7, 7, 8, 0.65) 0%, transparent 55%)' }}
                        aria-hidden="true"
                      />
                      {href && (
                        <div className="absolute inset-0 z-[5] bg-background/75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                          <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/80 border border-foreground/30 px-5 py-2.5">
                            {t.work.view}
                          </span>
                        </div>
                      )}
                      {item.label && (
                        <span
                          className="absolute top-3 left-3 text-[8px] uppercase tracking-[0.28em] font-light px-2 py-1"
                          style={{
                            color: 'var(--rfe-gold-dim)',
                            background: 'rgba(7, 7, 8, 0.55)',
                            backdropFilter: 'blur(6px)',
                          }}
                        >
                          {item.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <p className="font-serif text-base md:text-lg font-light tracking-wide transition-colors duration-500 group-hover:text-[rgba(245,240,235,0.65)]" style={{ color: 'rgba(245, 240, 235, 0.38)' }}>
                        {itemTitle}
                      </p>
                      {year && <p className="text-[10px] tracking-[0.2em] mt-1" style={{ color: 'rgba(245, 240, 235, 0.22)' }}>{year}</p>}
                    </div>
                  </>
                )

                return (
                  <div
                    key={i}
                    data-works-scroll-item="true"
                    className={`relative shrink-0 snap-start group ${i === displayItems.length - 1 ? 'pr-2' : ''}`}
                    style={{ width: posterPreviewWidth }}
                  >
                    {href ? (
                      <Link
                        href={href}
                        className="block outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        aria-label={`${itemTitle} - ${t.work.view}`}
                        onClick={(e) => {
                          if (dragState.current.hasDragged) e.preventDefault()
                        }}
                      >
                        {cardContent}
                      </Link>
                    ) : (
                      cardContent
                    )}
                  </div>
                )
              })}
            </div>


          </div>

          <div className="px-6 lg:px-16 mt-6 flex items-center gap-4">
            <div className="h-px flex-1 max-w-full" style={{ background: 'rgba(245, 240, 235, 0.06)' }}>
              <div className="h-full transition-all duration-150" style={{ width: `${Math.max(20, scrollProgress * 100)}%`, background: 'var(--rfe-gold-dim)', opacity: 0.4 }} />
            </div>
          </div>
        </div>
      </section>
      {/* <button
        type="button"
        aria-label="Faire défiler vers la droite"
        className="group flex pointer-events-auto items-center justify-center absolute right-3 sm:right-6 lg:right-16 top-0 bottom-0 z-20 w-14 transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--rfe-gold-dim) cursor-pointer"
        onPointerDown={(e) => {
          // Empêche le drag-to-scroll du conteneur de capter le clic sur certaines zones (haut/bas).
          e.stopPropagation()
        }}
        onClick={() => {
          scrollToRelative(1)
          markUserInteraction()
        }}
      >
        <span
          aria-hidden="true"
          className="absolute w-11 h-11 rounded-full border border-[rgba(245,240,235,0.22)] backdrop-blur-md bg-linear-to-b from-[rgba(7,7,8,0.55)] to-[rgba(7,7,8,0.10)] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition-colors group-hover:border-[rgba(245,240,235,0.5)]"
          style={{ opacity: 0.75 }}
        />
        <span aria-hidden="true" className="relative z-10 text-[20px] leading-none" style={{ color: 'var(--rfe-gold-dim)' }}>
          &gt;
        </span>
      </button> */}
    </div>
  )
}


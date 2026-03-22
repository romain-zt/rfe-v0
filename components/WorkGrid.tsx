'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'
import type { WorkItem } from '@/lib/i18n/types'
import { useReveal, useStaggeredReveal } from '@/hooks/useReveal'
import { getWorkSlug } from '@/lib/works'

type FilterType = 'drama' | 'thriller'

function extractYouTubeId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) return match[1]
  }
  return null
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  return reducedMotion
}

function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection
    if (connection) {
      const checkSaveData = () => connection.saveData || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
      setSaveData(checkSaveData())
      const handler = () => setSaveData(checkSaveData())
      connection.addEventListener?.('change', handler)
      return () => connection.removeEventListener?.('change', handler)
    }
  }, [])
  return saveData
}

function VideoPreview({
  videoUrl,
  isActive,
  title,
}: {
  videoUrl: string
  isActive: boolean
  title: string
}) {
  const videoId = useMemo(() => extractYouTubeId(videoUrl), [videoUrl])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!isActive) setIsLoaded(false)
  }, [isActive])

  if (!isActive || !videoId) return null

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&showinfo=0&iv_load_policy=3&disablekb=1`

  return (
    <div className={`absolute inset-0 z-[2] transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <iframe
        src={embedUrl}
        title={`Preview: ${title}`}
        className="absolute inset-0 w-full h-full scale-[1.5] pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ border: 0 }}
        onLoad={() => setIsLoaded(true)}
      />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/60 via-transparent to-background/30" />
    </div>
  )
}

// Masonry size pattern — varies per position for editorial feel
function getMasonrySize(index: number): 'full' | 'large' | 'medium' | 'small' | 'title-only' {
  const pattern = [
    'large', 'small', 'medium',    // row 1: varied
    'full',                          // row 2: full-bleed
    'medium', 'title-only', 'large', // row 3: one is just a title
    'small', 'large', 'medium',      // row 4: varied
  ] as const
  return pattern[index % pattern.length]
}

function WorkCard({
  work,
  delay,
  isPreviewActive,
  onPreviewActivate,
  onPreviewDeactivate,
  previewsEnabled,
  cardRef,
  size,
}: {
  work: WorkItem
  delay: number
  isPreviewActive: boolean
  onPreviewActivate: () => void
  onPreviewDeactivate: () => void
  previewsEnabled: boolean
  cardRef: (el: HTMLElement | null) => void
  size: ReturnType<typeof getMasonrySize>
}) {
  const { t, lang } = useLanguage()
  const reveal = useReveal({ delay })
  const [isHovered, setIsHovered] = useState(false)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const elementRef = useRef<HTMLElement | null>(null)

  const hasVideo = !!work.videoUrl
  const showPreview = isPreviewActive && hasVideo && previewsEnabled
  const slug = getWorkSlug(work)

  const setRefs = useCallback((el: HTMLElement | null) => {
    elementRef.current = el
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(reveal.ref as any).current = el
    cardRef(el)
  }, [reveal.ref, cardRef])

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (hasVideo && previewsEnabled) {
      hoverTimerRef.current = setTimeout(() => onPreviewActivate(), 1500)
    }
  }, [hasVideo, previewsEnabled, onPreviewActivate])

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    onPreviewDeactivate()
  }, [onPreviewDeactivate])

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    }
  }, [])

  // Title-only card — no image, just typography
  if (size === 'title-only') {
    return (
      <article
        ref={setRefs}
        className={`reveal-base ${reveal.isVisible ? 'reveal-visible' : ''} flex items-end`}
      >
        <Link
          href={`/${lang}/our-work/${slug}`}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 p-6 group"
          aria-label={`${work.title} - ${t.work.view}`}
        >
          <h3 className="font-serif text-xl md:text-2xl font-light tracking-wide group-hover:text-[var(--rfe-rose)] transition-colors duration-700">
            {work.title}
          </h3>
          <p className="text-[11px] text-muted-foreground/40 tracking-[0.15em] mt-2">{work.year}</p>
          <span className="inline-block mt-4 text-[9px] tracking-[0.2em] uppercase text-foreground/30 group-hover:text-foreground/60 transition-colors duration-500">
            {t.work.view} ↗
          </span>
        </Link>
      </article>
    )
  }

  const aspectRatio = size === 'full' ? '16/9'
    : size === 'large' ? '2/3'
    : size === 'medium' ? '3/4'
    : '1/1'

  return (
    <article
      ref={setRefs}
      className={`group reveal-base ${reveal.isVisible ? 'reveal-visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={`/${lang}/our-work/${slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${work.title} - ${t.work.view}`}
      >
        <div
          className="relative overflow-hidden mb-4 exhibition-frame cursor-pointer"
          style={{ aspectRatio }}
        >
          <div
            className={`absolute inset-0 transition-all duration-[1.2s] ${reveal.isVisible && !isHovered && !showPreview ? 'bw-media-scroll in-view' : isHovered || showPreview ? '' : 'bw-media'}`}
            style={{
              filter: isHovered || showPreview
                ? 'grayscale(0) brightness(1.02) saturate(1.08)'
                : reveal.isVisible
                  ? 'grayscale(0.3) brightness(0.98)'
                  : 'grayscale(1) brightness(0.9)',
            }}
          >
            <Image
              src={work.src}
              alt={work.title}
              fill
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
              sizes={size === 'full' ? '100vw' : size === 'large' ? '(max-width: 640px) 100vw, 50vw' : '(max-width: 640px) 50vw, 33vw'}
            />
          </div>

          {hasVideo && (
            <VideoPreview
              videoUrl={work.videoUrl!}
              isActive={showPreview}
              title={work.title}
            />
          )}

          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none z-[3] opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Hover overlay */}
          <div className={`absolute inset-0 z-[5] bg-background/75 flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/80 border border-foreground/30 px-5 py-2.5">
              {t.work.view}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="font-serif text-sm md:text-base font-light tracking-wide">{work.title}</h3>
          <p className="text-[11px] text-muted-foreground tracking-[0.15em]">{work.year}</p>
          {size !== 'small' && (
            <div className="flex flex-wrap gap-2 pt-1">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 border border-border/60 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  )
}

export function WorkGrid() {
  const { lang, t, content } = useLanguage()
  const [filter, setFilter] = useState<FilterType>('drama')
  const [activePreviewId, setActivePreviewId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const previewsEnabled = !reducedMotion && !saveData

  const cardRefsMap = useRef<Map<number, HTMLElement>>(new Map())

  const posters = content?.ourWork || []

  const filteredWorks = useMemo(() => {
    return posters.filter((work) => {
      const dramaTags = ['Drama', 'Drame']
      const thrillerTags = ['Thriller']
      if (filter === 'drama') return work.tags.some(tag => dramaTags.includes(tag))
      if (filter === 'thriller') return work.tags.some(tag => thrillerTags.includes(tag))
      return false
    })
  }, [filter, posters])

  const staggerDelays = useStaggeredReveal(filteredWorks.length, 0, 80)

  const createCardRef = useCallback((workId: number) => (el: HTMLElement | null) => {
    if (el) {
      cardRefsMap.current.set(workId, el)
    } else {
      cardRefsMap.current.delete(workId)
    }
  }, [])

  const handlePreviewActivate = useCallback((workId: number) => {
    setHoveredId(workId)
    setActivePreviewId(workId)
  }, [])

  const handlePreviewDeactivate = useCallback((workId: number) => {
    setHoveredId((prev) => prev === workId ? null : prev)
    setActivePreviewId((prev) => prev === workId ? null : prev)
  }, [])

  const filterLabels: Record<FilterType, string> = {
    drama: t.work.drama,
    thriller: t.work.thriller,
  }

  return (
    <>
      {/* Filters */}
      <div className="flex justify-center gap-6 sm:gap-8 mb-14 sm:mb-16">
        {(['drama', 'thriller'] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-[11px] tracking-[0.15em] uppercase transition-all duration-500 pb-1 border-b ${
              filter === f
                ? 'text-foreground border-foreground/40'
                : 'text-muted-foreground/50 border-transparent hover:text-muted-foreground hover:border-foreground/20'
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Staggered masonry grid — editorial magazine layout */}
      <div className="grid grid-cols-2 sm:grid-cols-6 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 auto-rows-auto">
        {filteredWorks.map((work, index) => {
          const size = getMasonrySize(index)

          // Span classes based on size
          const spanClass = size === 'full'
            ? 'col-span-2 sm:col-span-6 lg:col-span-12'
            : size === 'large'
              ? 'col-span-2 sm:col-span-3 lg:col-span-5'
              : size === 'medium'
                ? 'col-span-1 sm:col-span-3 lg:col-span-4'
                : size === 'title-only'
                  ? 'col-span-1 sm:col-span-2 lg:col-span-3'
                  : 'col-span-1 sm:col-span-2 lg:col-span-3'

          return (
            <div key={work.id} className={spanClass}>
              <WorkCard
                work={work}
                delay={staggerDelays[index]}
                isPreviewActive={activePreviewId === work.id}
                onPreviewActivate={() => handlePreviewActivate(work.id)}
                onPreviewDeactivate={() => handlePreviewDeactivate(work.id)}
                previewsEnabled={previewsEnabled}
                cardRef={createCardRef(work.id)}
                size={size}
              />
            </div>
          )
        })}
      </div>
    </>
  )
}

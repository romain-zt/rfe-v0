'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from './LanguageContext'
import type { WorkItem, WorkCredit } from '@/lib/i18n/types'
import { PRODUCTION_STAGE_TAB_LABELS } from '@/lib/i18n/types'
import type { ProductionStage } from '@/lib/i18n/types'
import { useReveal, useStaggeredReveal } from '@/hooks/useReveal'
import { getWorkSlug } from '@/lib/works'

export type WorkGridProps = {
  works: WorkItem[]
  tabField?: 'productionStage' | 'none'
}

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

function getHeadlineCredit(credits?: WorkCredit[]): WorkCredit | null {
  if (!credits?.length) return null
  return credits.find(c => c.isHeadline) ?? credits[0] ?? null
}

function WorkCard({
  work,
  delay,
  isPreviewActive,
  onPreviewActivate,
  onPreviewDeactivate,
  previewsEnabled,
  cardRef,
}: {
  work: WorkItem
  delay: number
  isPreviewActive: boolean
  onPreviewActivate: () => void
  onPreviewDeactivate: () => void
  previewsEnabled: boolean
  cardRef: (el: HTMLElement | null) => void
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
          className="relative overflow-hidden mb-4 poster-preview-frame exhibition-frame cursor-pointer"
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
            {work.src ? (
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]"
                sizes="(max-width: 639px) 85vw, (max-width: 1280px) 50vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: 'var(--tone-charcoal)' }}>
                <span className="font-serif text-sm font-light" style={{ color: 'rgba(245, 240, 235, 0.25)' }}>{work.title}</span>
              </div>
            )}
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

          {/* Seen on */}
          {work.seenOn && work.seenOn.length > 0 && (
            <div className="absolute bottom-2.5 right-2.5 z-[4] flex items-center gap-1.5 pointer-events-none">
              {work.seenOn.slice(0, 3).map((channel, i) => (
                <div
                  key={i}
                  className="flex items-center justify-center"
                  style={{
                    background: 'rgba(7, 7, 8, 0.55)',
                    backdropFilter: 'blur(6px)',
                    borderRadius: '2px',
                    padding: channel.logoUrl ? '4px 6px' : '3px 6px',
                  }}
                  title={channel.name}
                >
                  {channel.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={channel.logoUrl}
                      alt={channel.name}
                      width={48}
                      height={48}
                      className="object-contain max-h-[48px] w-auto"
                    />
                  ) : (
                    <span className="text-[8px] uppercase tracking-[0.12em] font-light" style={{ color: 'rgba(245, 240, 235, 0.7)' }}>
                      {channel.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

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
          {work.tags.length > 0 && (
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
          {(() => {
            const headline = getHeadlineCredit(work.credits)
            if (!headline) return null
            const prefix = t.credits?.byRole?.[headline.role] ?? ''
            const labelText = prefix ? `${prefix} ${headline.name}` : headline.name
            if (headline.imdbUrl) {
              return (
                <a
                  href={headline.imdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center min-h-[44px] text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors line-clamp-1 pt-1"
                >
                  {labelText}&nbsp;↗
                </a>
              )
            }
            return (
              <span className="inline-flex items-center text-[10px] sm:text-xs tracking-[0.15em] uppercase text-muted-foreground/60 line-clamp-1 pt-1">
                {labelText}
              </span>
            )
          })()}
        </div>
      </Link>
    </article>
  )
}

export function WorkGrid({ works, tabField }: WorkGridProps) {
  const { lang, t } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { filterOptions, filterMode } = useMemo(() => {
    if (tabField === 'none') {
      return { filterOptions: [] as { key: string; label: string }[], filterMode: 'tags' as const }
    }

    if (tabField === 'productionStage') {
      const stages = Array.from(new Set(
        works.map(w => w.productionStage).filter(Boolean) as ProductionStage[],
      ))
      const tabOrder: ProductionStage[] = ['paid-development', 'movies-development', 'series-development']
      const ordered = tabOrder.filter(s => stages.includes(s))
      const opts = ordered.map(s => ({
        key: s,
        label: t.productionStage?.tabs?.[s] || PRODUCTION_STAGE_TAB_LABELS[s] || s,
      }))
      return { filterOptions: opts, filterMode: 'productionStage' as const }
    }

    const categories = new Set(works.map(w => w.category).filter(Boolean))
    if (categories.size >= 2) {
      const categoryLabels: Record<string, string> = {
        film: t.development?.films || 'Films',
        series: t.development?.series || 'Series',
        unscripted: t.development?.unscripted || 'Unscripted',
      }
      const opts = Array.from(categories).map(c => ({
        key: c!,
        label: categoryLabels[c!] || c!,
      }))
      return { filterOptions: opts, filterMode: 'category' as const }
    }

    const allTags = new Set(works.flatMap(w => w.tags))
    if (allTags.size >= 2) {
      const opts = Array.from(allTags).map(tag => ({ key: tag, label: tag }))
      return { filterOptions: opts, filterMode: 'tags' as const }
    }

    return { filterOptions: [] as { key: string; label: string }[], filterMode: 'tags' as const }
  }, [works, t, tabField])

  const showFilters = filterOptions.length >= 2

  const [activePreviewId, setActivePreviewId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)

  const currentFilter = useMemo(() => {
    if (!showFilters) return ''
    const filterFromUrl = searchParams.get('filter')
    if (filterFromUrl && filterOptions.some((option) => option.key === filterFromUrl)) {
      return filterFromUrl
    }
    return filterOptions[0]?.key ?? ''
  }, [filterOptions, searchParams, showFilters])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const currentUrlFilter = params.get('filter')

    if (!showFilters || !currentFilter) {
      if (currentUrlFilter !== null) {
        params.delete('filter')
        const nextQuery = params.toString()
        router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false })
      }
      return
    }

    if (currentUrlFilter === currentFilter) return
    params.set('filter', currentFilter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [currentFilter, pathname, router, searchParams, showFilters])

  const updateFilterInUrl = useCallback((nextFilter: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('filter') === nextFilter) return
    params.set('filter', nextFilter)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const previewsEnabled = !reducedMotion && !saveData

  const cardRefsMap = useRef<Map<number, HTMLElement>>(new Map())
  const filterBarRef = useRef<HTMLDivElement | null>(null)
  const filterAnchorRef = useRef<HTMLDivElement | null>(null)

  const filteredWorks = useMemo(() => {
    if (!showFilters || !currentFilter) return works

    if (filterMode === 'productionStage') {
      return works.filter((work) => work.productionStage === currentFilter)
    }

    if (filterMode === 'category') {
      return works.filter((work) => work.category === currentFilter)
    }

    return works.filter((work) => work.tags.includes(currentFilter))
  }, [currentFilter, works, filterMode, showFilters])

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

  const handleFilterClick = useCallback((nextFilter: string) => {
    updateFilterInUrl(nextFilter)

    if (typeof window === 'undefined') return

    // Tous écrans: remonte la vue jusqu'au bloc des filtres.
    const filterAnchorElement = filterAnchorRef.current
    if (!filterAnchorElement) return

    window.requestAnimationFrame(() => {
      filterAnchorElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })
  }, [updateFilterInUrl])

  return (
    <>
      {showFilters && (
        <>
          <div ref={filterAnchorRef} className="h-0" aria-hidden="true" />
          <div
            ref={filterBarRef}
            className="sticky top-0 z-50 -mx-6 px-6 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24 py-4 mb-14 sm:mb-16 border-b border-border/30"
            style={{ backgroundColor: 'var(--tone-charcoal)' }}
          >
            <div className="flex justify-center gap-6 sm:gap-8">
              {filterOptions.map((f) => (
                <button
                  key={f.key}
                  onClick={() => handleFilterClick(f.key)}
                  className={`text-[11px] tracking-[0.15em] uppercase transition-all duration-500 pb-1 border-b ${
                    currentFilter === f.key
                      ? 'text-foreground border-foreground/40'
                      : 'text-muted-foreground/50 border-transparent hover:text-muted-foreground hover:border-foreground/20 cursor-pointer'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Uniform A4 portrait poster grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-10">
        {filteredWorks.map((work, index) => (
          <WorkCard
            key={work.id}
            work={work}
            delay={staggerDelays[index] ?? 0}
            isPreviewActive={activePreviewId === work.id}
            onPreviewActivate={() => handlePreviewActivate(work.id)}
            onPreviewDeactivate={() => handlePreviewDeactivate(work.id)}
            previewsEnabled={previewsEnabled}
            cardRef={createCardRef(work.id)}
          />
        ))}
      </div>
    </>
  )
}

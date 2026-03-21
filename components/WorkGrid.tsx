'use client'

import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'
import type { WorkItem } from '@/lib/i18n/types'
import { useReveal, useStaggeredReveal } from '@/hooks/useReveal'
import { getWorkSlug } from '@/lib/works'

type FilterType = 'restoration' | 'documentaryProduction'

// ============================================
// UTILITY: Extract YouTube Video ID
// ============================================
function extractYouTubeId(url: string): string | null {
  if (!url) return null
  
  // Handle various YouTube URL formats:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - Direct VIDEO_ID
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?\/\s]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match && match[1]) {
      return match[1]
    }
  }
  
  return null
}

// ============================================
// HOOK: Detect reduced motion preference
// ============================================
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

// ============================================
// HOOK: Detect save data mode
// ============================================
function useSaveData(): boolean {
  const [saveData, setSaveData] = useState(false)
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const connection = (navigator as any).connection
    if (connection) {
      const checkSaveData = () => {
        return connection.saveData || 
               connection.effectiveType === 'slow-2g' || 
               connection.effectiveType === '2g'
      }
      setSaveData(checkSaveData())
      
      const handler = () => setSaveData(checkSaveData())
      connection.addEventListener?.('change', handler)
      return () => connection.removeEventListener?.('change', handler)
    }
  }, [])
  
  return saveData
}

// ============================================
// HOOK: Detect pointer type (fine = mouse)
// ============================================
function usePointerType(): 'fine' | 'coarse' | 'none' {
  const [pointerType, setPointerType] = useState<'fine' | 'coarse' | 'none'>('fine')
  
  useEffect(() => {
    const fineQuery = window.matchMedia('(pointer: fine)')
    const coarseQuery = window.matchMedia('(pointer: coarse)')
    
    const updatePointer = () => {
      if (fineQuery.matches) setPointerType('fine')
      else if (coarseQuery.matches) setPointerType('coarse')
      else setPointerType('none')
    }
    
    updatePointer()
    fineQuery.addEventListener('change', updatePointer)
    coarseQuery.addEventListener('change', updatePointer)
    
    return () => {
      fineQuery.removeEventListener('change', updatePointer)
      coarseQuery.removeEventListener('change', updatePointer)
    }
  }, [])
  
  return pointerType
}

// ============================================
// COMPONENT: Video Preview
// ============================================
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
  
  // Reset loaded state when becoming inactive
  useEffect(() => {
    if (!isActive) {
      setIsLoaded(false)
    }
  }, [isActive])
  
  if (!isActive || !videoId) return null
  
  // YouTube embed URL with silent autoplay parameters
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${videoId}&showinfo=0&iv_load_policy=3&disablekb=1`
  
  return (
    <div 
      className={`absolute inset-0 z-[2] transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <iframe
        src={embedUrl}
        title={`Preview: ${title}`}
        className="absolute inset-0 w-full h-full scale-[1.5] pointer-events-none"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        style={{ border: 0 }}
        onLoad={() => setIsLoaded(true)}
      />
      {/* Cinematic matte overlay for text readability */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/60 via-transparent to-background/30" />
    </div>
  )
}

// ============================================
// COMPONENT: Work Card
// ============================================
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
  
  // Combined ref callback
  const setRefs = useCallback((el: HTMLElement | null) => {
    elementRef.current = el
    // Set the reveal ref (it's a RefObject, so we set .current directly)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(reveal.ref as any).current = el
    cardRef(el)
  }, [reveal.ref, cardRef])
  
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    if (hasVideo && previewsEnabled) {
      hoverTimerRef.current = setTimeout(() => {
        onPreviewActivate()
      }, 1500)
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
  
  const handleFocus = useCallback(() => {
    if (hasVideo && previewsEnabled) {
      hoverTimerRef.current = setTimeout(() => {
        onPreviewActivate()
      }, 1500)
    }
  }, [hasVideo, previewsEnabled, onPreviewActivate])
  
  const handleBlur = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
    onPreviewDeactivate()
  }, [onPreviewDeactivate])
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  return (
    <article
      ref={setRefs}
      className={`group reveal-base ${reveal.isVisible ? 'reveal-visible' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      <Link
        href={`/${lang}/our-work/${slug}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-foreground/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${work.title} - ${t.work.view}`}
      >
        {/* Poster with B&W to color reveal */}
        <div className="relative aspect-[2/3] overflow-hidden mb-5 exhibition-frame cursor-pointer">
          {/* Poster image layer */}
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
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          
          {/* Video Preview Layer */}
          {hasVideo && (
            <VideoPreview
              videoUrl={work.videoUrl!}
              isActive={showPreview}
              title={work.title}
            />
          )}
          
          {/* Film grain overlay (always visible) */}
          <div 
            className="absolute inset-0 pointer-events-none z-[3] opacity-[0.025]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              mixBlendMode: 'overlay',
            }}
          />
          
          {/* Warm glow on hover/preview */}
          <div 
            className="absolute inset-0 pointer-events-none z-[4] transition-opacity duration-700"
            style={{
              opacity: isHovered || showPreview ? 0.15 : 0,
              background: 'radial-gradient(ellipse at center, rgba(180, 140, 90, 0.4) 0%, transparent 70%)',
            }}
          />
          
          {/* Hover overlay - pointer-events-none so it doesn't block interactions */}
          <div className={`absolute inset-0 z-[5] bg-background/75 flex items-center justify-center transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <span className="text-[10px] tracking-[0.2em] uppercase text-foreground/80 border border-foreground/30 px-5 py-2.5">
              {t.work.view}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="font-serif text-sm md:text-base font-light tracking-wide">{work.title}</h3>
          <p className="text-[11px] text-muted-foreground tracking-[0.15em]">{work.year}</p>
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
        </div>
      </Link>
    </article>
  )
}

// ============================================
// MAIN COMPONENT: Work Grid
// ============================================
export function WorkGrid() {
  const { lang, t, content } = useLanguage()
  const [filter, setFilter] = useState<FilterType>('restoration')
  const [activePreviewId, setActivePreviewId] = useState<number | null>(null)
  const [hoveredId, setHoveredId] = useState<number | null>(null)
  
  // Preference hooks
  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const pointerType = usePointerType()
  
  // Previews are enabled only if not reduced motion and not save data
  const previewsEnabled = !reducedMotion && !saveData
  
  // Card refs for intersection observer
  const cardRefsMap = useRef<Map<number, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibilityMapRef = useRef<Map<number, number>>(new Map())
  const rafIdRef = useRef<number | null>(null)
  
  // Get localized posters from sheets data
  const posters = content?.ourWork || []

  // Filter works based on selected filter - use useMemo for better performance
  const filteredWorks = useMemo(() => {
    return posters.filter((work) => {
      const restorationTags = ['Restoration', 'Restauration', 'Colorization', 'Colorisation']
      const documentaryProductionTags = ['Documentary', 'Documentaire', 'Documentary Production', 'Production Documentaire']
      if (filter === 'restoration') return work.tags.some(tag => restorationTags.includes(tag))
      if (filter === 'documentaryProduction') return work.tags.some(tag => documentaryProductionTags.includes(tag))
      return false
    })
  }, [filter, posters])

  const staggerDelays = useStaggeredReveal(filteredWorks.length, 0, 80)
  
  // IntersectionObserver for mobile auto-preview
  useEffect(() => {
    // Only use intersection observer on touch devices and when previews are enabled
    if (pointerType === 'fine' || !previewsEnabled) {
      // Clean up if conditions change
      if (observerRef.current) {
        observerRef.current.disconnect()
        observerRef.current = null
      }
      return
    }
    
    const updateMostVisibleCard = () => {
      // Don't update if there's an active hover (desktop behavior takes priority)
      if (hoveredId !== null) return
      
      let maxRatio = 0
      let mostVisibleId: number | null = null
      
      visibilityMapRef.current.forEach((ratio, id) => {
        // Only consider cards with video and nearly fully visible (95%+)
        const work = filteredWorks.find(w => w.id === id)
        if (work?.videoUrl && ratio > 0.55 && ratio > maxRatio) {
          maxRatio = ratio
          mostVisibleId = id
        }
      })
      
      // setActivePreviewId(mostVisibleId)
    }
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idAttr = entry.target.getAttribute('data-work-id')
          if (idAttr) {
            const id = parseInt(idAttr, 10)
            visibilityMapRef.current.set(id, entry.intersectionRatio)
          }
        })
        
        // Throttle updates with RAF
        if (rafIdRef.current) {
          cancelAnimationFrame(rafIdRef.current)
        }
        rafIdRef.current = requestAnimationFrame(updateMostVisibleCard)
      },
      {
        // Fine-grained thresholds for precise visibility detection
        threshold: [0, 0.2, 0.5, 0.7, 0.9, 1],
        // Only consider cards in the center 40% of viewport (ignore top/bottom 30%)
        rootMargin: '-20% 0px -20% 0px',
      }
    )
    
    // Observe all cards
    cardRefsMap.current.forEach((el, id) => {
      el.setAttribute('data-work-id', String(id))
      observerRef.current?.observe(el)
    })
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [pointerType, previewsEnabled, hoveredId, filteredWorks])
  
  // Card ref callback factory
  const createCardRef = useCallback((workId: number) => (el: HTMLElement | null) => {
    if (el) {
      cardRefsMap.current.set(workId, el)
      el.setAttribute('data-work-id', String(workId))
      observerRef.current?.observe(el)
    } else {
      const existingEl = cardRefsMap.current.get(workId)
      if (existingEl) {
        observerRef.current?.unobserve(existingEl)
      }
      cardRefsMap.current.delete(workId)
      visibilityMapRef.current.delete(workId)
    }
  }, [])
  
  // Handlers for preview activation
  const handlePreviewActivate = useCallback((workId: number) => {
    setHoveredId(workId)
    setActivePreviewId(workId)
  }, [])
  
  const handlePreviewDeactivate = useCallback((workId: number) => {
    setHoveredId((prev) => prev === workId ? null : prev)
    // Only clear if this was the active preview
    setActivePreviewId((prev) => prev === workId ? null : prev)
  }, [])

  const filterLabels: Record<FilterType, string> = {
    restoration: t.work.restoration,
    documentaryProduction: t.work.documentaryProduction,
  }

  return (
    <>
      {/* Filters */}
      <div className="flex justify-center gap-6 sm:gap-8 mb-14 sm:mb-16">
        {(['restoration', 'documentaryProduction'] as FilterType[]).map((f) => (
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

      {/* Grid - asymmetric exhibition layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14 sm:gap-y-16">
        {filteredWorks.map((work, index) => (
          <WorkCard
            key={work.id}
            work={work}
            delay={staggerDelays[index]}
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

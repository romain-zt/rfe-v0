'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { useLanguage } from './LanguageContext'
import { MEDIA, type MediaItem } from '@/app/(frontend)/[locale]/content'

// ============================================
// CONFIGURATION
// Tune these values to adjust the reveal animation
// ============================================
const REVEAL_DURATION_MS = 1800 // Timed reveal fallback duration (for B&W to color wipe)
const PARALLAX_OFFSET_PX = 12 // Subtle parallax translation on AFTER image
const SCROLL_MULTIPLIER = 1 // How much scroll affects reveal (higher = faster reveal)

// Easing function for smooth cinematic reveal
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * useScrollReveal Hook
 * 
 * 2-phase reveal animation:
 * - Phase A (0..REVEAL_DURATION_MS): Pure time-based eased animation, scroll is ignored
 * - Phase B (after duration): Scroll can drive completion, but never decreases progress
 * 
 * Progress is updated via CSS variable for performance (avoids React re-renders).
 * Only animates when `isActive` is true and respects prefers-reduced-motion.
 * 
 * @param ref - Reference to the element to track
 * @param isActive - Whether the element is visible and should animate
 */
function useScrollReveal(
  ref: React.RefObject<HTMLElement | null>,
  isActive: boolean
): number {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const initialTopRef = useRef<number | null>(null)
  const hasStartedRef = useRef(false)
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const updateProgress = useCallback((newProgress: number) => {
    const clamped = Math.min(1, Math.max(0, newProgress))
    progressRef.current = clamped
    
    // Update all CSS variables directly on element for GPU-accelerated animations
    if (ref.current) {
      const pct = clamped * 100
      const invPct = 100 - pct
      ref.current.style.setProperty('--reveal', clamped.toString())
      ref.current.style.setProperty('--reveal-pct', `${pct}%`)
      ref.current.style.setProperty('--reveal-right', `${invPct}%`)
      ref.current.style.setProperty('--reveal-top', `${invPct}%`)
      ref.current.style.setProperty('--reveal-bottom', `${invPct}%`)
      ref.current.style.setProperty('--parallax-x', `${(1 - clamped) * PARALLAX_OFFSET_PX}px`)
      ref.current.style.setProperty('--parallax-y', `${(1 - clamped) * -6}px`)
    }
    
    // Batch React state updates (only significant changes)
    if (Math.abs(clamped - progress) > 0.02) {
      setProgress(clamped)
    }
  }, [ref, progress])

  // Initialize on first activation (prevents flicker on intersection toggles)
  useEffect(() => {
    if (isActive && !hasStartedRef.current) {
      progressRef.current = 0
      startTimeRef.current = null
      initialTopRef.current = null
      if (ref.current) {
        ref.current.style.setProperty('--reveal', '0')
        ref.current.style.setProperty('--reveal-pct', '0%')
        ref.current.style.setProperty('--reveal-right', '100%')
        ref.current.style.setProperty('--reveal-top', '100%')
        ref.current.style.setProperty('--reveal-bottom', '100%')
        ref.current.style.setProperty('--parallax-x', `${PARALLAX_OFFSET_PX}px`)
        ref.current.style.setProperty('--parallax-y', '-6px')
      }
      setProgress(0)
      hasStartedRef.current = true
    }
  }, [isActive, ref])

  useEffect(() => {
    if (!isActive || !ref.current) return

    // Reduced motion: immediately show full reveal
    if (prefersReducedMotion.current) {
      updateProgress(1)
      return
    }

    const element = ref.current

    const animate = (timestamp: number) => {
      if (!element) return

      // Initialize start time on first frame
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const rect = element.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const elementHeight = rect.height

      // Record initial position when element first becomes active
      if (initialTopRef.current === null) {
        initialTopRef.current = rect.top
      }

      // Calculate scroll-based progress RELATIVE to entry position
      const scrolledDistance = initialTopRef.current - rect.top
      const revealDistance = viewportHeight * 1.1 + elementHeight * 0.4
      const scrollProgress = Math.max(0, Math.min(1,
        (scrolledDistance / revealDistance) * SCROLL_MULTIPLIER
      ))

      // Calculate time-based progress with easing
      const elapsed = timestamp - startTimeRef.current
      const rawTimeProgress = Math.min(1, elapsed / REVEAL_DURATION_MS)
      const easedTime = easeOutCubic(rawTimeProgress)

      let newProgress: number

      // Phase A: During first REVEAL_DURATION_MS, use pure time-based easing (ignore scroll)
      if (elapsed < REVEAL_DURATION_MS) {
        newProgress = easedTime
      } else {
        // Phase B: After duration, allow scroll to drive completion
        newProgress = Math.max(progressRef.current, scrollProgress)
      }

      // Ensure progress is monotonic (never decreasing) and clamped
      newProgress = Math.max(progressRef.current, newProgress)
      newProgress = Math.min(1, newProgress)

      // Only update if changed enough (performance optimization)
      if (Math.abs(newProgress - progressRef.current) > 0.003) {
        updateProgress(newProgress)
      }

      // Continue animation until complete
      if (progressRef.current < 0.995) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        updateProgress(1) // Snap to 1 when nearly complete
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive, ref, updateProgress])

  return progress
}

function GalleryItem({
  item,
  index,
  isVisible,
}: {
  item: MediaItem
  index: number
  isVisible: boolean
}) {
  const { t } = useLanguage()
  const articleRef = useRef<HTMLElement>(null)
  const isEven = index % 2 === 0

  // Get scroll-driven reveal progress [0..1]
  const revealProgress = useScrollReveal(articleRef, isVisible)

  // Check for reduced motion preference
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Hover handlers: directly set CSS vars for instant response
  const handleMouseEnter = useCallback(() => {
    if (articleRef.current && !reducedMotion) {
      articleRef.current.style.setProperty('--reveal', '1')
      articleRef.current.style.setProperty('--reveal-pct', '100%')
      articleRef.current.style.setProperty('--reveal-right', '0%')
      articleRef.current.style.setProperty('--reveal-top', '0%')
      articleRef.current.style.setProperty('--reveal-bottom', '0%')
      articleRef.current.style.setProperty('--parallax-x', '0px')
      articleRef.current.style.setProperty('--parallax-y', '0px')
    }
  }, [reducedMotion])

  const handleMouseLeave = useCallback(() => {
    // Do nothing - rAF loop will resume updating CSS vars
  }, [])

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <article
        ref={articleRef}
        className="group relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* ============================================
         * DESKTOP LAYOUT (md+): 2-column grid with image and caption
         * - Even items: Image left, Caption right
         * - Odd items: Caption left, Image right
         * - AFTER (color) revealed via clip-path left-to-right
         * ============================================ */}
        <div className="hidden md:grid md:grid-cols-2 md:gap-8 lg:gap-12 items-center">
          {/* Image column - order alternates */}
          {isEven ? (
            <>
              <div>
                <div
                  className="relative aspect-[2/3] overflow-hidden exhibition-frame film-gate max-h-[70vh]"
                  style={{
                    transform: isVisible
                      ? 'translateY(0) translateX(0)'
                      : `translateY(40px) translateX(20px)`,
                    transition: `transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15}s`,
                  }}
                >
                  {/* Base B&W layer (always visible) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      filter: 'grayscale(1) brightness(0.9) contrast(1.05)',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.title} - base`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* AFTER image with parallax and clip reveal */}
                  <div
                    className="absolute inset-0 reveal-after-desktop"
                    style={{
                      clipPath: reducedMotion ? 'none' : 'inset(0 var(--reveal-right, 100%) 0 0)',
                      transform: reducedMotion ? 'none' : 'translateX(var(--parallax-x, 0px))',
                      filter: 'grayscale(0) brightness(1.02) saturate(1.08)',
                      transition: 'filter 0.6s ease',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.title} - ${t.beforeAfter.after}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Warm color grade overlay */}
                    <div className="after-color-grade" />
                  </div>

                  {/* Reveal edge - bright line + glow at wipe boundary */}
                  {!reducedMotion && (
                    <div
                      className="reveal-edge"
                      style={{
                        left: 'var(--reveal-pct, 0%)',
                        opacity: revealProgress > 0.02 && revealProgress < 0.98 ? 1 : 0,
                      }}
                    />
                  )}

                  {/* Light leak at reveal boundary */}
                  {!reducedMotion && (
                    <div
                      className="light-leak-reveal"
                      style={{
                        opacity: revealProgress > 0.1 && revealProgress < 0.9
                          ? 0.12 + (1 - Math.abs(revealProgress - 0.5) * 2) * 0.08
                          : 0,
                        left: 'calc(var(--reveal-pct, 0%) - 15%)',
                      }}
                    />
                  )}

                  {/* Film scratches */}
                  <div className="film-scratches" />
                </div>
              </div>

              {/* Caption column */}
              <div>
                <div
                  className="text-center md:text-left"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s, transform 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s`,
                  }}
                >
                  <h3 className="font-serif text-lg md:text-xl lg:text-2xl font-light tracking-wide text-foreground/90">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-foreground/40 mt-2 tracking-[0.2em]">{item.year}</p>
                  {item.description && (
                    <p className="text-xs text-foreground/50 mt-3 max-w-md leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Caption column - first for odd items */}
              <div>
                <div
                  className="text-center md:text-right"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: `opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s, transform 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s`,
                  }}
                >
                  <h3 className="font-serif text-lg md:text-xl lg:text-2xl font-light tracking-wide text-foreground/90">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-foreground/40 mt-2 tracking-[0.2em]">{item.year}</p>
                  {item.description && (
                    <p className="text-xs text-foreground/50 mt-3 max-w-md leading-relaxed ml-auto">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Image column - second for odd items */}
              <div>
                <div
                  className="relative aspect-[2/3] overflow-hidden exhibition-frame film-gate max-h-[70vh]"
                  style={{
                    transform: isVisible
                      ? 'translateY(0) translateX(0)'
                      : `translateY(40px) translateX(-20px)`,
                    transition: `transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15}s`,
                  }}
                >
                  {/* Base B&W layer (always visible) */}
                  <div
                    className="absolute inset-0"
                    style={{
                      filter: 'grayscale(1) brightness(0.9) contrast(1.05)',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.title} - base`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>

                  {/* AFTER image with parallax and clip reveal */}
                  <div
                    className="absolute inset-0 reveal-after-desktop"
                    style={{
                      clipPath: reducedMotion ? 'none' : 'inset(0 var(--reveal-right, 100%) 0 0)',
                      transform: reducedMotion ? 'none' : 'translateX(var(--parallax-x, 0px))',
                      filter: 'grayscale(0) brightness(1.02) saturate(1.08)',
                      transition: 'filter 0.6s ease',
                    }}
                  >
                    <Image
                      src={item.src}
                      alt={`${item.title} - ${t.beforeAfter.after}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* Warm color grade overlay */}
                    <div className="after-color-grade" />
                  </div>

                  {/* Reveal edge - bright line + glow at wipe boundary */}
                  {!reducedMotion && (
                    <div
                      className="reveal-edge"
                      style={{
                        left: 'var(--reveal-pct, 0%)',
                        opacity: revealProgress > 0.02 && revealProgress < 0.98 ? 1 : 0,
                      }}
                    />
                  )}

                  {/* Light leak at reveal boundary */}
                  {!reducedMotion && (
                    <div
                      className="light-leak-reveal"
                      style={{
                        opacity: revealProgress > 0.1 && revealProgress < 0.9
                          ? 0.12 + (1 - Math.abs(revealProgress - 0.5) * 2) * 0.08
                          : 0,
                        left: 'calc(var(--reveal-pct, 0%) - 15%)',
                      }}
                    />
                  )}

                  {/* Film scratches */}
                  <div className="film-scratches" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ============================================
         * MOBILE LAYOUT (<md): Single stacked frame
         * - One container with BEFORE as base, AFTER as overlay
         * - Reveal bottom-to-top based on scroll progress
         * ============================================ */}
        <div className="md:hidden relative aspect-[2/3] overflow-hidden exhibition-frame film-gate">
          {/* Base: BEFORE (B&W) */}
          <div
            className="absolute inset-0"
            style={{
              filter: 'grayscale(1) brightness(0.9) contrast(1.05)',
            }}
          >
            <Image
              src={item.src}
              alt={`${item.title} - ${t.beforeAfter.before}`}
              fill
              className="object-cover"
              sizes="100vw"
              priority={index < 2}
            />
          </div>

          {/* Overlay: AFTER (Color) - revealed top-to-bottom */}
          <div
            className="absolute inset-0 reveal-after-mobile"
            style={{
              opacity: isVisible ? 1 : 0,
              clipPath: reducedMotion ? 'none' : 'inset(0 0 var(--reveal-bottom, 100%) 0)',
              transform: reducedMotion ? 'none' : 'translateY(var(--parallax-y, 0px))',
              filter: 'grayscale(0) brightness(1.02) saturate(1.08)',
              transition: `opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15}s`,
            }}
          >
            <Image
              src={item.src}
              alt={`${item.title} - ${t.beforeAfter.after}`}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Warm color grade */}
            <div className="after-color-grade" />
          </div>

          {/* Reveal edge for mobile (horizontal line) */}
          {!reducedMotion && (
            <div
              className="reveal-edge-mobile"
              style={{
                top: 'var(--reveal-pct, 0%)',
                opacity: revealProgress > 0.02 && revealProgress < 0.98 ? 1 : 0,
              }}
            />
          )}

          {/* Film scratches */}
          <div className="film-scratches" />

          {/* Soft bottom fade for mobile section transitions */}
          <div className="mobile-section-fade" />

          {/* Labels */}
          <div
            className="absolute top-4 left-4 exhibition-caption z-10"
            style={{
              opacity: revealProgress < 0.7 ? 1 : 0.4,
              transition: 'opacity 0.5s ease',
            }}
          >
            {t.beforeAfter.before}
          </div>
          <div
            className="absolute bottom-4 left-4 exhibition-caption z-10"
            style={{
              opacity: revealProgress > 0.3 ? 1 : 0,
              transition: 'opacity 0.5s ease',
            }}
          >
            {t.beforeAfter.after}
          </div>
        </div>

        {/* Caption - mobile only (desktop caption is in grid) */}
        <div
          className={`md:hidden mt-8 text-center`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: `opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s, transform 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.15 + 0.4}s`,
          }}
        >
          <h3 className="font-serif text-lg font-light tracking-wide text-foreground/90">
            {item.title}
          </h3>
          <p className="text-[11px] text-foreground/40 mt-2 tracking-[0.2em]">{item.year}</p>
          {item.description && (
            <p className="text-xs text-foreground/50 mt-3 max-w-md leading-relaxed mx-auto">
              {item.description}
            </p>
          )}
        </div>
      </article>

      {/* Decorative connecting line */}
      <div
        className="hidden md:block absolute bottom-0 w-px h-24 lg:h-32 bg-gradient-to-b from-foreground/08 to-transparent"
        style={{
          left: isEven ? 'auto' : '0',
          right: isEven ? '0' : 'auto',
          transform: 'translateY(100%)',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}
      />
    </div>
  )
}

export function MediaGallery() {
  const { t, lang } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [restorationTitleVisible, setRestorationTitleVisible] = useState(false)
  const [documentaryTitleVisible, setDocumentaryTitleVisible] = useState(false)

  // Get localized media items and filter by category
  const mediaItems = MEDIA.posters[lang]
  const restorationTags = ['Restoration', 'Restauration', 'Colorization', 'Colorisation']
  const documentaryTags = ['Documentary Production', 'Production Documentaire']

  // Filter for restoration items (prioritize items with restoration/colorization tags)
  const restorationItems = mediaItems
    .filter(item => item.tags.some(tag => restorationTags.includes(tag)))
    .slice(0, 3)

  // Filter for documentary-only items (exclude those already in restoration)
  const restorationIds = new Set(restorationItems.map(item => item.id))
  const documentaryItems = mediaItems
    .filter(item =>
      !restorationIds.has(item.id) &&
      item.tags.some(tag => documentaryTags.includes(tag))
    )
    .slice(0, 2)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setRestorationTitleVisible(true)
      setDocumentaryTitleVisible(true)
      const allKeys = [
        ...documentaryItems.map((_, i) => `documentary-${i}`),
        ...restorationItems.map((_, i) => `restoration-${i}`),
      ]
      setVisibleItems(new Set(allKeys))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute('data-key')
          if (entry.isIntersecting) {
            if (key === 'restoration-title') {
              setRestorationTitleVisible(true)
            } else if (key === 'documentary-title') {
              setDocumentaryTitleVisible(true)
            } else if (key) {
              setVisibleItems((prev) => new Set([...prev, key]))
            }
          }
        })
      },
      { threshold: 0.5, rootMargin: '-50px 0px' }
    )

    const section = sectionRef.current
    if (section) {
      const elements = section.querySelectorAll('[data-key]')
      elements.forEach((el) => observer.observe(el))
    }

    return () => observer.disconnect()
  }, [restorationItems, documentaryItems])

  return (
    <section ref={sectionRef} className="relative pt-32 sm:pt-24 lg:pt-36 overflow-hidden section-tone-b section-fade-top">
      {/* Background depth layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 80%, rgba(30, 25, 20, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 20%, rgba(35, 30, 25, 0.15) 0%, transparent 50%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8 mb-24 lg:mb-32 ">
        {/* Documentary Production Section */}
        {documentaryItems.length > 0 && (
          <div>
            <div
              data-key="documentary-title"
              className="text-center mb-24 lg:mb-32"
              style={{
                opacity: documentaryTitleVisible ? 1 : 0,
                transform: documentaryTitleVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
              }}
            >
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-foreground/90">
                {t.beforeAfter.documentaryTitle}
              </h2>
              <div className="mt-6 mx-auto w-20 section-divider" />
            </div>

            <div className="space-y-28 sm:space-y-36 lg:space-y-48">
              {documentaryItems.map((item, index) => (
                <div key={item.id} data-key={`documentary-${index}`}>
                  <GalleryItem
                    item={item}
                    index={index}
                    isVisible={visibleItems.has(`documentary-${index}`)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Restoration & Colorization Section */}
        <div
          data-key="restoration-title"
          className="text-center  mt-32 sm:mt-40 lg:mt-56  mb-24 lg:mb-32 "
          style={{
            opacity: restorationTitleVisible ? 1 : 0,
            transform: restorationTitleVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light tracking-wide text-foreground/90">
            {t.beforeAfter.restorationTitle}
          </h2>
          <div className="mt-6 mx-auto w-20 section-divider" />
        </div>

        <div className="space-y-28 sm:space-y-36 lg:space-y-48">
          {restorationItems.map((item, index) => (
            <div key={item.id} data-key={`restoration-${index}`}>
              <GalleryItem
                item={item}
                index={index}
                isVisible={visibleItems.has(`restoration-${index}`)}
              />
            </div>
          ))}
        </div>

        
      </div>
    </section>
  )
}

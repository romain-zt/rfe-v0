'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { ResponsiveHeroPicture, type ImageFit } from '@/components/ResponsiveHeroPicture'
import { useLanguage } from '@/components/LanguageContext'

const HERO_IMAGE_FALLBACK = '/assets/team/kara-lis.jpg'

type Props = {
  imageSrc?: string
  imageSrcMobile?: string
  imagePosition?: string
  imagePositionMobile?: string
  imageFit?: ImageFit
  imageFitMobile?: ImageFit
  headline?: string
  subtitle?: string
  label?: string
}

export function CinematicHero({
  imageSrc,
  imageSrcMobile,
  imagePosition = 'center center',
  imagePositionMobile,
  imageFit = 'cover',
  imageFitMobile,
  headline,
  subtitle,
  label,
}: Props) {
  const HERO_IMAGE_SRC = imageSrc || HERO_IMAGE_FALLBACK
  const HERO_IMAGE_SRC_MOBILE = imageSrcMobile || HERO_IMAGE_SRC
  const HERO_POSITION_MOBILE = imagePositionMobile || imagePosition
  const hasMobileVariant = Boolean(imageSrcMobile)
  const [phase, setPhase] = useState(0)
  const [imgError, setImgError] = useState(false)
  const { lang, content } = useLanguage()
  const navItems = content.navItems

  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setPhase(3)
      return
    }

    const t1 = setTimeout(() => setPhase(1), 300)
    const t2 = setTimeout(() => setPhase(2), 1000)
    const t3 = setTimeout(() => setPhase(3), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const sectionH = sectionRef.current.offsetHeight
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / (sectionH * 0.65)))

    const brightness = 0.4 + progress * 0.3
    const grayscale = 0.5 - progress * 0.4
    const filterVal = `grayscale(${grayscale}) brightness(${brightness}) contrast(1.05)`

    if (imgRef.current) imgRef.current.style.filter = filterVal

    if (vignetteRef.current) {
      vignetteRef.current.style.opacity = `${1 - progress * 0.55}`
    }

    if (orbRef.current) {
      orbRef.current.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.1}px))`
    }

    if (contentRef.current) {
      const fadeOut = Math.max(0, 1 - progress * 1.8)
      contentRef.current.style.transform = `translateY(${scrolled * 0.25}px)`
      contentRef.current.style.opacity = `${fadeOut}`
    }
  }, [])

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: '180vh', clipPath: 'inset(0)' }}
      aria-label="Hero"
    >
      {/* Fixed background — single composite photo of Elisabeth + Kara */}
      <div className="fixed inset-0 z-0" style={{ willChange: 'auto' }}>
        <div
          ref={imgRef}
          className="absolute inset-0"
          style={{
            filter: 'grayscale(0.5) brightness(0.4) contrast(1.05)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {!imgError && (
            <ResponsiveHeroPicture
              desktopSrc={HERO_IMAGE_SRC}
              mobileSrc={HERO_IMAGE_SRC_MOBILE}
              hasMobileVariant={hasMobileVariant}
              desktopPosition={imagePosition}
              mobilePosition={HERO_POSITION_MOBILE}
              desktopFit={imageFit}
              mobileFit={imageFitMobile}
              alt="Elisabeth Rohm and Kara Feifer"
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Vignette — loosens with scroll */}
        <div
          ref={vignetteRef}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 50%, transparent 0%, rgba(7, 7, 8, 0.35) 50%, rgba(7, 7, 8, 0.92) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.3) 0%, transparent 25%, transparent 60%, rgba(7, 7, 8, 0.9) 100%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Sticky viewport — content centered in first 100vh */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient orb */}
        <div
          ref={orbRef}
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: 'min(90vw, 720px)',
            height: 'min(90vw, 720px)',
            transform: 'translate(-50%, -50%)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            background: `
              radial-gradient(ellipse 65% 65% at 50% 50%,
                rgba(181, 151, 90, 0.06) 0%,
                rgba(196, 160, 160, 0.04) 40%,
                transparent 70%
              )
            `,
            animation: phase >= 1 ? 'orb-breathe 14s ease-in-out infinite' : 'none',
          }}
          aria-hidden="true"
        />

        {/* Content — parallaxes up and fades on scroll */}
        <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ willChange: 'transform, opacity' }}>
          <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
            <h1
              className="font-serif font-light text-balance"
              style={{
                fontSize: 'clamp(2rem, 6.5vw, 5rem)',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                color: 'var(--foreground)',
                transform: phase >= 2 ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.5s var(--ease-emerge)',
              }}
            >
              {headline || 'There\u2019s always more to the story.'}
            </h1>
          </div>

          {(subtitle || (!headline && !subtitle)) && (
            <p
              className="mt-8 text-sm uppercase font-light"
              style={{
                color: 'var(--rfe-gold)',
                letterSpacing: phase >= 3 ? '0.28em' : '0.06em',
                opacity: phase >= 3 ? 0.7 : 0,
                transition: 'opacity 2s var(--ease-quiet), letter-spacing 3s var(--ease-quiet)',
              }}
            >
              {subtitle || 'True Crime / Real Drama'}
            </p>
          )}

          {/* Credits — below subtitle */}
          {label && (
            <div
              className="mt-10 flex items-center justify-center"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.4s',
              }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.22em] font-light"
                style={{ color: 'rgba(245, 240, 235, 0.35)' }}
              >
                {label}
              </span>
            </div>
          )}
        </div>

        {/* Left-side table of contents — desktop only */}
        <nav
          className="absolute left-8 xl:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-5 z-20"
          aria-label="Site sections"
          style={{
            opacity: phase >= 3 ? 1 : 0,
            transition: 'opacity 2.5s var(--ease-quiet) 1.2s',
          }}
        >
          {(navItems.length > 0
            ? navItems.map((item) => ({
                label: item.label,
                href: item.isExternal || !item.href.startsWith('/')
                  ? item.href
                  : `/${lang}${item.href}`,
              }))
            : [
                { href: `/${lang}/about`, label: 'About Us' },
                { href: `/${lang}/our-work`, label: 'Our Work' },
                { href: `/${lang}/development`, label: 'Development' },
                { href: `/${lang}/press`, label: 'Press' },
                { href: `/${lang}/contact`, label: 'Contact' },
              ]
          ).map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-2.5 transition-all duration-500"
              style={{
                opacity: phase >= 3 ? 1 : 0,
                transition: `opacity 2s var(--ease-quiet) ${1.3 + i * 0.1}s`,
              }}
            >
              <span
                className="block w-3 h-px transition-all duration-500 group-hover:w-5"
                style={{ background: 'rgba(181, 151, 90, 0.35)' }}
                aria-hidden="true"
              />
              <span
                className="text-[8px] uppercase tracking-[0.32em] font-light transition-colors duration-500 group-hover:text-[rgba(245,240,235,0.65)]"
                style={{ color: 'rgba(245, 240, 235, 0.28)' }}
              >
                {item.label}
              </span>
            </Link>
          ))}
        </nav>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{
            opacity: phase >= 3 ? 0.3 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.6s',
          }}
          aria-hidden="true"
        >
          <div
            className="w-px"
            style={{
              height: 48,
              background: 'linear-gradient(to bottom, var(--rfe-gold), transparent)',
              animation: phase >= 3 ? 'scroll-line 2.8s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes orb-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 1;   }
          50%       { transform: translate(-50%, -50%) scale(1.07); opacity: 0.7; }
        }
        @keyframes scroll-line {
          0%   { transform: scaleY(0); transform-origin: top;    opacity: 0; }
          40%  { transform: scaleY(1); transform-origin: top;    opacity: 1; }
          80%  { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes orb-breathe  { 0%, 100% { opacity: 1; } }
          @keyframes scroll-line  { 0%, 100% { opacity: 0.3; } }
        }
      `}</style>
    </section>
  )
}

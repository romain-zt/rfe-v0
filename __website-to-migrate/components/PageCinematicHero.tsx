'use client'

import { useEffect, useState, useRef, useCallback, type ReactNode } from 'react'
import Image from 'next/image'

type PageCinematicHeroProps = {
  imageSrc: string
  imagePosition?: string
  label: string
  children: ReactNode
  subtitle?: string
}

export function PageCinematicHero({
  imageSrc,
  imagePosition = 'center 30%',
  label,
  children,
  subtitle,
}: PageCinematicHeroProps) {
  const [phase, setPhase] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const orbRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      setPhase(3)
      return
    }

    const t1 = setTimeout(() => setPhase(1), 200)
    const t2 = setTimeout(() => setPhase(2), 700)
    const t3 = setTimeout(() => setPhase(3), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleScroll = useCallback(() => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    const sectionH = sectionRef.current.offsetHeight
    const scrolled = -rect.top
    const progress = Math.max(0, Math.min(1, scrolled / (sectionH * 0.6)))

    if (imgRef.current) {
      const brightness = 0.3 + progress * 0.25
      const grayscale = 0.5 - progress * 0.35
      const contrast = 1.05 - progress * 0.03
      imgRef.current.style.filter = `grayscale(${grayscale}) brightness(${brightness}) contrast(${contrast})`
    }

    if (vignetteRef.current) {
      vignetteRef.current.style.opacity = `${1 - progress * 0.4}`
    }

    if (orbRef.current) {
      orbRef.current.style.transform = `translate(-50%, calc(-50% + ${scrolled * 0.08}px))`
    }

    if (contentRef.current) {
      const fadeOut = Math.max(0, 1 - progress * 2)
      contentRef.current.style.transform = `translateY(${scrolled * 0.2}px)`
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
      style={{ height: '140vh', clipPath: 'inset(0)' }}
      aria-label="Hero"
    >
      <div className="fixed inset-0 z-0" style={{ willChange: 'auto' }}>
        <Image
          ref={imgRef}
          src={imageSrc}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          style={{
            objectPosition: imagePosition,
            filter: 'grayscale(0.5) brightness(0.3) contrast(1.05)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 2.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />

        <div
          ref={vignetteRef}
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, rgba(7, 7, 8, 0.45) 0%, rgba(7, 7, 8, 0.55) 50%, rgba(7, 7, 8, 0.95) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.4) 0%, rgba(7, 7, 8, 0.2) 30%, rgba(7, 7, 8, 0.2) 60%, rgba(7, 7, 8, 0.9) 100%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Ambient orb — subtler than homepage */}
        <div
          ref={orbRef}
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: 'min(80vw, 600px)',
            height: 'min(80vw, 600px)',
            transform: 'translate(-50%, -50%)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            background: `
              radial-gradient(ellipse 65% 65% at 50% 50%,
                rgba(181, 151, 90, 0.04) 0%,
                rgba(196, 160, 160, 0.025) 40%,
                transparent 70%
              )
            `,
            animation: phase >= 1 ? 'page-orb-breathe 16s ease-in-out infinite' : 'none',
          }}
          aria-hidden="true"
        />

        {/* Single soft ring */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '50%',
            left: '50%',
            width: 'min(72vw, 580px)',
            height: 'min(72vw, 580px)',
            transform: 'translate(-50%, -50%)',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.8s',
          }}
          aria-hidden="true"
        >
          <div
            className="page-ring-breathe w-full h-full"
            style={{
              borderRadius: '50%',
              border: '1px solid rgba(196, 160, 160, 0.045)',
            }}
          />
        </div>

        <div ref={contentRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto" style={{ willChange: 'transform, opacity' }}>
          <span
            className="block text-[9px] uppercase mb-8 font-light"
            style={{
              color: 'var(--rfe-gold-dim)',
              letterSpacing: phase >= 3 ? '0.42em' : '0.08em',
              opacity: phase >= 3 ? 1 : 0,
              transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
            }}
          >
            {label}
          </span>

          <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
            <h1
              className="font-serif font-light text-balance"
              style={{
                fontSize: 'clamp(2rem, 6vw, 4.5rem)',
                letterSpacing: '-0.01em',
                lineHeight: 1.1,
                color: 'var(--foreground)',
                transform: phase >= 2 ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.4s var(--ease-emerge)',
              }}
            >
              {children}
            </h1>
          </div>

          {subtitle && (
            <p
              className="mt-8 text-sm font-light leading-[2]"
              style={{
                color: 'rgba(245, 240, 235, 0.38)',
                maxWidth: '44ch',
                margin: '2rem auto 0',
                opacity: phase >= 3 ? 1 : 0,
                transition: 'opacity 2.5s var(--ease-quiet) 0.3s',
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          style={{
            opacity: phase >= 3 ? 0.2 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.6s',
          }}
          aria-hidden="true"
        >
          <div
            className="w-px"
            style={{
              height: 36,
              background: 'linear-gradient(to bottom, var(--rfe-rose), transparent)',
              animation: phase >= 3 ? 'page-scroll-line 3s ease-in-out infinite' : 'none',
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes page-orb-breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1);    opacity: 1;   }
          50%       { transform: translate(-50%, -50%) scale(1.05); opacity: 0.65; }
        }
        @keyframes page-scroll-line {
          0%   { transform: scaleY(0); transform-origin: top;    opacity: 0; }
          40%  { transform: scaleY(1); transform-origin: top;    opacity: 1; }
          80%  { transform: scaleY(1); transform-origin: bottom; opacity: 0; }
          100% { transform: scaleY(0); transform-origin: bottom; opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes page-orb-breathe  { 0%, 100% { opacity: 1; } }
          @keyframes page-scroll-line  { 0%, 100% { opacity: 0.2; } }
        }
      `}</style>
    </section>
  )
}

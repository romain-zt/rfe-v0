'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

export function CinematicHero() {
  const [phase, setPhase] = useState(0)
  const containerRef = useRef<HTMLElement>(null)

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

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const handleScroll = () => {
      if (!containerRef.current) return
      const orb = containerRef.current.querySelector<HTMLElement>('[data-parallax-orb]')
      if (orb) orb.style.transform = `translate(-50%, calc(-50% + ${window.scrollY * 0.12}px))`
      const img = containerRef.current.querySelector<HTMLElement>('[data-parallax-img]')
      if (img) img.style.transform = `scale(1.1) translateY(${window.scrollY * 0.08}px)`
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center"
      aria-label="Hero"
    >
      {/* Background image — Elisabeth Rohm, desaturated, cinematic */}
      <div className="absolute inset-0 z-0">
        <div data-parallax-img className="absolute inset-0 scale-110 origin-center">
          <Image
            src="/assets/team/liz-rohm-hero.png"
            alt=""
            fill
            className="object-cover object-top"
            priority
            sizes="100vw"
            style={{
              filter: 'grayscale(0.6) brightness(0.35) contrast(1.1)',
              opacity: phase >= 1 ? 1 : 0,
              transition: 'opacity 3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          />
        </div>
        {/* Heavy vignette over the image */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, rgba(7, 7, 8, 0.4) 50%, rgba(7, 7, 8, 0.95) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.3) 0%, transparent 30%, transparent 60%, rgba(7, 7, 8, 0.9) 100%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      {/* Ambient orb — warm glow */}
      <div
        data-parallax-orb
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

      {/* Rose pulse — the emotional center */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: 'min(28vw, 200px)',
          height: 'min(28vw, 200px)',
          transform: 'translate(-50%, -50%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 4s cubic-bezier(0.25, 0.1, 0.25, 1) 0.8s',
        }}
        aria-hidden="true"
      >
        <div
          className="rose-pulse-ring w-full h-full"
          style={{
            borderRadius: '50%',
            background: `radial-gradient(circle,
              rgba(139, 26, 26, 0.12) 0%,
              rgba(196, 160, 160, 0.06) 45%,
              transparent 72%
            )`,
          }}
        />
      </div>

      {/* Inner orbit ring */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: 'min(68vw, 560px)',
          height: 'min(68vw, 560px)',
          transform: 'translate(-50%, -50%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 6s cubic-bezier(0.25, 0.1, 0.25, 1) 1s',
        }}
        aria-hidden="true"
      >
        <div
          className="ring-breathe-a w-full h-full"
          style={{
            borderRadius: '50%',
            border: '1px solid rgba(181, 151, 90, 0.07)',
          }}
        />
      </div>

      {/* Outer orbit ring */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          width: 'min(84vw, 690px)',
          height: 'min(84vw, 690px)',
          transform: 'translate(-50%, -50%)',
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 6s cubic-bezier(0.25, 0.1, 0.25, 1) 1.6s',
        }}
        aria-hidden="true"
      >
        <div
          className="ring-breathe-b w-full h-full"
          style={{
            borderRadius: '50%',
            border: '1px solid rgba(196, 160, 160, 0.04)',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
          <h1
            className="font-serif font-light text-balance"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              letterSpacing: '-0.01em',
              lineHeight: 1.05,
              color: 'var(--foreground)',
              transform: phase >= 2 ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge)',
            }}
          >
            not here to behave.
          </h1>
        </div>

        <p
          className="mt-8 text-sm uppercase font-light"
          style={{
            color: 'var(--rfe-rose)',
            letterSpacing: phase >= 3 ? '0.28em' : '0.06em',
            opacity: phase >= 3 ? 0.65 : 0,
            transition: 'opacity 2s var(--ease-quiet), letter-spacing 3s var(--ease-quiet)',
          }}
        >
          a cinematic female gaze studio
        </p>
      </div>

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
            background: 'linear-gradient(to bottom, var(--rfe-rose), transparent)',
            animation: phase >= 3 ? 'scroll-line 2.8s ease-in-out infinite' : 'none',
          }}
        />
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

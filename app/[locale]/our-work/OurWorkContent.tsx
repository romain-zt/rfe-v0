'use client'

import { WorkGrid } from '@/components/WorkGrid'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'

function WorkHero() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
      {/* Background — film collage feel */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/works/affiches-restoration/4.MARIA BY CALLAS CINEMA/Maria by Callas Poster.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          style={{ filter: 'grayscale(0.8) brightness(0.18) contrast(1.1)', objectPosition: 'center 30%' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 50% 50%, transparent 0%, rgba(7, 7, 8, 0.5) 50%, rgba(7, 7, 8, 0.95) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.5) 0%, transparent 30%, transparent 50%, rgba(7, 7, 8, 1) 100%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      <div ref={ref} className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-32">
        <span
          className="block text-[9px] uppercase mb-8 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: isVisible ? '0.42em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          our work
        </span>

        <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
          <h1
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge) 0.2s',
            }}
          >
            stories that refuse
            <br />
            <span style={{ color: 'var(--rfe-rose)' }}>to stay quiet.</span>
          </h1>
        </div>

        <p
          className="mt-8 text-sm font-light leading-[2]"
          style={{
            color: 'rgba(245, 240, 235, 0.38)',
            maxWidth: '44ch',
            margin: '2rem auto 0',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
          }}
        >
          Restoration, colorization, and documentary production.
          Every project carries a story that refused to disappear.
        </p>
      </div>
    </section>
  )
}

export default function OurWorkContent() {
  return (
    <main className="relative">
      <WorkHero />

      <section className="relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 20%, rgba(181, 151, 90, 0.025) 0%, transparent 55%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto">
          <WorkGrid />
        </div>
      </section>
    </main>
  )
}

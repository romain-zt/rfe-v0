'use client'

import { PageCinematicHero } from '@/components/PageCinematicHero'
import { useReveal } from '@/hooks/useReveal'

// ============================================
// PRESS ITEMS DATA
// ============================================

const pressItems = [
  {
    id: 1,
    source: 'Deadline',
    date: 'February 2026',
    title: "Shirley MacLaine To Star In Matthew Weiner's 'Margret and Stevie'",
    url: 'https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/',
    description:
      'Shirley MacLaine has been set to star in Margret and Stevie, directed by Matthew Weiner. The film follows two women whose sharp-edged friendship becomes a lifeline, reigniting resolve in each other.',
  },
]

// ============================================
// PRESS CARD
// ============================================

function PressCard({
  item,
  index,
}: {
  item: typeof pressItems[0]
  index: number
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 2s var(--ease-quiet) ${index * 120}ms, transform 2s var(--ease-quiet) ${index * 120}ms`,
      }}
    >
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group block py-10 border-t"
        style={{ borderColor: 'rgba(245, 240, 235, 0.05)' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
          {/* Source + date */}
          <div className="shrink-0 sm:w-36 lg:w-44">
            <span
              className="text-[10px] tracking-[0.25em] uppercase font-light block"
              style={{ color: 'var(--rfe-gold)' }}
            >
              {item.source}
            </span>
            <span
              className="text-[10px] tracking-[0.12em] mt-1.5 font-light block"
              style={{ color: 'rgba(245, 240, 235, 0.25)' }}
            >
              {item.date}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className="font-serif font-light text-base md:text-lg leading-snug mb-3 transition-colors duration-700 group-hover:text-[rgba(245,240,235,0.95)]"
              style={{ color: 'rgba(245, 240, 235, 0.7)', letterSpacing: '-0.005em' }}
            >
              {item.title}
              <span className="ml-2" style={{ color: 'var(--rfe-gold-dim)' }}>↗</span>
            </h3>

            {item.description && (
              <p
                className="text-sm leading-[2] font-light"
                style={{ color: 'rgba(245, 240, 235, 0.35)', letterSpacing: '0.02em', maxWidth: '62ch' }}
              >
                {item.description}
              </p>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

// ============================================
// PRESS CONTENT
// ============================================

export default function PressContent() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <main className="relative">
      <PageCinematicHero
        imageSrc="/assets/works/margret-stevie.png"
        imagePosition="center 20%"
        label="press"
      >
        The world is starting{' '}
        <span style={{ color: 'var(--rfe-rose)' }}>to listen.</span>
      </PageCinematicHero>

      <div className="relative z-10" style={{ backgroundColor: 'var(--background)' }}>
        <section className="relative px-6 lg:px-16 xl:px-24 py-20 lg:py-32 section-tone-charcoal section-bleed-top">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 55% 40% at 15% 30%, rgba(181, 151, 90, 0.04) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 85% 80%, rgba(196, 160, 160, 0.025) 0%, transparent 55%)
              `,
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
            <div
              ref={headerRef}
              className="mb-4"
              style={{
                opacity: headerVisible ? 1 : 0,
                transition: 'opacity 1.5s var(--ease-quiet)',
              }}
            >
              <p
                className="text-[10px] uppercase font-light"
                style={{
                  color: 'var(--rfe-gold-dim)',
                  letterSpacing: headerVisible ? '0.42em' : '0.08em',
                  transition: 'letter-spacing 2.2s var(--ease-quiet)',
                }}
              >
                Coverage
              </p>
            </div>

            <div className="mt-2">
              {pressItems.map((item, i) => (
                <PressCard key={item.id} item={item} index={i} />
              ))}

              {/* Placeholder for future items */}
              <div
                className="py-16 text-center border-t"
                style={{ borderColor: 'rgba(245, 240, 235, 0.04)' }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.3em] font-light"
                  style={{ color: 'rgba(245, 240, 235, 0.15)' }}
                >
                  More coverage coming
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

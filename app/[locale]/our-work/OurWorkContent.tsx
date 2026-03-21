'use client'

import { WorkGrid } from '@/components/WorkGrid'
import { PageCinematicHero } from '@/components/PageCinematicHero'

function WorkHero() {
  return (
    <PageCinematicHero
      imageSrc="/assets/works/margret-stevie.png"
      imagePosition="center 30%"
      label="our work"
      subtitle="Drama, thriller, and everything in between. Every project carries a story that refused to disappear."
    >
      stories that refuse<br />
      <span style={{ color: 'var(--rfe-rose)' }}>to stay quiet.</span>
    </PageCinematicHero>
  )
}

export default function OurWorkContent() {
  return (
    <main className="relative">
      <WorkHero />

      <div className="relative z-10" style={{ backgroundColor: 'var(--background)' }}>
        <section className="relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24 section-tone-charcoal section-bleed-top">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 60% 40% at 50% 15%, rgba(181, 151, 90, 0.04) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 10% 60%, rgba(139, 26, 26, 0.02) 0%, transparent 50%),
                radial-gradient(ellipse 35% 35% at 90% 80%, rgba(196, 160, 160, 0.02) 0%, transparent 50%)
              `,
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
            <WorkGrid />
          </div>
        </section>
      </div>
    </main>
  )
}

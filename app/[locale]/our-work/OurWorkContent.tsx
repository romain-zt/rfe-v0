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
      </div>
    </main>
  )
}

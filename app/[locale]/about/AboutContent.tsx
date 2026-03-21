'use client'

import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'

function ManifestoHero() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background image — atmospheric, cropped, intimate */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/team/liz-rohm-2.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
          style={{ filter: 'grayscale(0.7) brightness(0.25) contrast(1.1)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 50% 50%, transparent 0%, rgba(7, 7, 8, 0.5) 50%, rgba(7, 7, 8, 0.95) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.6) 0%, transparent 30%, transparent 50%, rgba(7, 7, 8, 1) 100%)
            `,
          }}
          aria-hidden="true"
        />
      </div>

      <div ref={titleRef} className="relative z-10 text-center px-6 max-w-4xl mx-auto pt-32">
        <span
          className="block text-[9px] uppercase mb-8 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: titleVisible ? '0.42em' : '0.08em',
            opacity: titleVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          about
        </span>

        <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
          <h1
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4.5rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              transform: titleVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge) 0.2s',
            }}
          >
            not a production company.
            <br />
            <span style={{ color: 'var(--rfe-rose)' }}>a voice.</span>
          </h1>
        </div>
      </div>
    </section>
  )
}

function ManifestoBlock({
  label,
  headline,
  body,
  accent = false,
  delay = 0,
}: {
  label: string
  headline: string
  body: string
  accent?: boolean
  delay?: number
}) {
  const { ref: blockRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  return (
    <div
      ref={blockRef}
      className="py-20 md:py-28 border-t"
      style={{ borderColor: 'rgba(245, 240, 235, 0.04)' }}
    >
      <p
        className="text-[10px] uppercase mb-8 font-light"
        style={{
          color: accent ? 'var(--rfe-gold)' : 'var(--rfe-rose-dim)',
          letterSpacing: isVisible ? '0.38em' : '0.08em',
          opacity: isVisible ? 1 : 0,
          transition: `opacity 1.5s var(--ease-quiet) ${delay}ms, letter-spacing 2.2s var(--ease-quiet) ${delay}ms`,
        }}
      >
        {label}
      </p>

      <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '2rem' }}>
        <h2
          className="font-serif font-light text-balance"
          style={{
            fontSize: 'clamp(1.8rem, 4.5vw, 3rem)',
            lineHeight: 1.2,
            letterSpacing: '-0.01em',
            color: 'var(--foreground)',
            transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
            transition: `transform 1.6s var(--ease-emerge) ${delay + 80}ms`,
          }}
        >
          {headline}
        </h2>
      </div>

      <p
        className="text-sm leading-[2.2] font-light"
        style={{
          color: 'rgba(245, 240, 235, 0.42)',
          letterSpacing: '0.025em',
          maxWidth: '58ch',
          opacity: isVisible ? 1 : 0,
          transition: `opacity 2.8s var(--ease-quiet) ${delay + 350}ms`,
        }}
      >
        {body}
      </p>
    </div>
  )
}

function DualitySection() {
  const { ref: sectionRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  const dualities = [
    { left: 'softness', right: 'rebellion' },
    { left: 'silence', right: 'voice' },
    { left: 'fragility', right: 'strength' },
    { left: 'intimacy', right: 'power' },
  ]

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, rgba(139, 26, 26, 0.03) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div ref={sectionRef} className="relative max-w-4xl mx-auto text-center">
        <span
          className="block text-[9px] uppercase mb-16 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: isVisible ? '0.42em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          our duality
        </span>

        <div className="space-y-8 md:space-y-12">
          {dualities.map((d, i) => (
            <div
              key={d.left}
              className="flex items-center justify-center gap-6 md:gap-12"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
                transition: `opacity 2s var(--ease-quiet) ${i * 150}ms, transform 2s var(--ease-quiet) ${i * 150}ms`,
              }}
            >
              <span
                className="font-serif font-light text-right"
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                  color: 'var(--rfe-rose)',
                  minWidth: '8ch',
                  letterSpacing: '0.02em',
                }}
              >
                {d.left}
              </span>
              <span
                className="text-[9px] uppercase tracking-[0.3em]"
                style={{ color: 'var(--rfe-gold-dim)' }}
              >
                ×
              </span>
              <span
                className="font-serif font-light text-left"
                style={{
                  fontSize: 'clamp(1.2rem, 3vw, 2rem)',
                  color: 'var(--foreground)',
                  minWidth: '8ch',
                  letterSpacing: '0.02em',
                }}
              >
                {d.right}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ImageBreak() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ height: 'clamp(300px, 50vh, 550px)' }}
    >
      <Image
        src="/assets/team/elisabeth-rohm-2.jpg"
        alt="Elisabeth Röhm"
        fill
        className="object-cover"
        sizes="100vw"
        style={{
          filter: isVisible ? 'grayscale(0.4) brightness(0.7)' : 'grayscale(1) brightness(0.3)',
          transition: 'filter 3s var(--ease-quiet)',
          objectPosition: 'center 30%',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(to bottom, rgba(7, 7, 8, 0.8) 0%, transparent 25%, transparent 75%, rgba(7, 7, 8, 0.8) 100%),
            radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, rgba(7, 7, 8, 0.5) 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Centered quote */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
        }}
      >
        <p
          className="font-serif font-light italic text-center"
          style={{
            fontSize: 'clamp(1.2rem, 3vw, 2rem)',
            color: 'rgba(245, 240, 235, 0.7)',
            maxWidth: '32ch',
            lineHeight: 1.5,
          }}
        >
          &ldquo;where feminine emotion becomes cinematic power.&rdquo;
        </p>
      </div>
    </div>
  )
}

function ClosingStatement() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative px-6 py-32 lg:py-44 flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 80%, rgba(196, 160, 160, 0.04) 0%, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative text-center max-w-2xl mx-auto">
        <div style={{ overflow: 'hidden', paddingBottom: '6px', marginBottom: '2rem' }}>
          <p
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              color: 'var(--foreground)',
              lineHeight: 1.3,
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge)',
            }}
          >
            we don&apos;t make films for comfort.
            <br />
            <span style={{ color: 'var(--rfe-rose)' }}>we make films that stay with you.</span>
          </p>
        </div>

        <a
          href="mailto:contact@rfe.studio"
          className="inline-block mt-8 text-[10px] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-700"
          style={{
            color: 'var(--rfe-gold-dim)',
            borderColor: 'rgba(181, 151, 90, 0.2)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.5s, color 500ms, border-color 500ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--rfe-gold)'
            e.currentTarget.style.borderColor = 'var(--rfe-gold)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--rfe-gold-dim)'
            e.currentTarget.style.borderColor = 'rgba(181, 151, 90, 0.2)'
          }}
        >
          contact@rfe.studio
        </a>
      </div>
    </section>
  )
}

export default function AboutContent() {
  return (
    <main className="relative">
      <ManifestoHero />

      <section className="relative px-6 lg:px-16 xl:px-24 py-8 lg:py-16">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 45% at 15% 55%, rgba(181, 151, 90, 0.03) 0%, transparent 60%)`,
          }}
          aria-hidden="true"
        />

        <div className="relative max-w-5xl mx-auto">
          <ManifestoBlock
            label="why we exist"
            headline="Because women's stories have always existed. They just kept getting silenced."
            body="Cut, softened, explained away. Told through someone else's eyes, someone else's camera, someone else's version of what a woman should be. We exist to let them breathe — raw, incomplete, refusing resolution. Because the most powerful stories are the ones that won't be contained."
            accent
          />

          <ManifestoBlock
            label="what we refuse"
            headline="Comfort. Compliance. The polished performance of femininity."
            body="Stories that end before they begin. Heroines who exist to be saved. The camera that looks at women instead of looking with them. We refuse the lie that women's anger is ugly, that feminine stories are small, that silence means consent. Every frame we make is a refusal."
            delay={80}
          />

          <ManifestoBlock
            label="what we chase"
            headline="The moment before the scream. The silence that holds everything."
            body="A gaze that doesn't look away. Fragility turning into something you can't name but can't stop feeling. We chase the tension between tenderness and rage, the stories that live in the body before they reach the mouth. Cinema that doesn't explain — it moves through you."
            accent
            delay={160}
          />
        </div>
      </section>

      <ImageBreak />

      <DualitySection />

      <ClosingStatement />
    </main>
  )
}

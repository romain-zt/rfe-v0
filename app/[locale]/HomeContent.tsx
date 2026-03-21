'use client'

import { CinematicHero } from '@/components/CinematicHero'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

function ArcDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="relative w-full overflow-hidden pointer-events-none"
      style={{ height: '40px' }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 40"
        fill="none"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
      >
        <path
          d={flip ? 'M0 25 Q720 38 1440 25' : 'M0 15 Q720 2 1440 15'}
          stroke="rgba(245, 240, 235, 0.06)"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </div>
  )
}

function ManifestoBlock({
  label,
  headline,
  body,
  delay = 0,
  accent = false,
}: {
  label: string
  headline: string
  body: string
  delay?: number
  accent?: boolean
}) {
  const { ref: labelRef, isVisible: labelVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { ref: headlineRef, isVisible: headlineVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { ref: bodyRef, isVisible: bodyVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })

  return (
    <div
      className="py-16 md:py-20 border-t"
      style={{ borderColor: 'rgba(245, 240, 235, 0.05)' }}
    >
      <div className="max-w-3xl">
        <div ref={labelRef}>
          <p
            className="text-[10px] uppercase mb-6 font-light"
            style={{
              color: accent ? 'var(--rfe-gold)' : 'var(--rfe-rose-dim)',
              letterSpacing: labelVisible ? '0.38em' : '0.08em',
              opacity: labelVisible ? 1 : 0,
              transition: `opacity 1.5s var(--ease-quiet) ${delay}ms, letter-spacing 2.2s var(--ease-quiet) ${delay}ms`,
            }}
          >
            {label}
          </p>
        </div>

        <div ref={headlineRef} style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '2rem' }}>
          <h2
            className="font-serif font-light text-balance"
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              transform: headlineVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: `transform 1.6s var(--ease-emerge) ${delay + 80}ms`,
            }}
          >
            {headline}
          </h2>
        </div>

        <div ref={bodyRef}>
          <p
            className="text-sm leading-[2.1] font-light"
            style={{
              color: 'rgba(245, 240, 235, 0.42)',
              letterSpacing: '0.025em',
              maxWidth: '56ch',
              opacity: bodyVisible ? 1 : 0,
              transition: `opacity 2.8s var(--ease-quiet) ${delay + 350}ms`,
            }}
          >
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}

function ManifestoSection() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 15% 55%, rgba(181, 151, 90, 0.035) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <div
          ref={headerRef}
          className="mb-4"
          style={{
            letterSpacing: headerVisible ? '0.42em' : '0.08em',
            opacity: headerVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2s var(--ease-quiet)',
          }}
        >
          <span
            className="text-[9px] uppercase font-light"
            style={{ color: 'var(--rfe-gold-dim)' }}
          >
            manifesto
          </span>
        </div>

        <ManifestoBlock
          label="why we exist"
          headline="Because women's stories have always existed."
          body="They kept getting cut, softened, explained away. Told through someone else's eyes. We exist to let them breathe — raw, incomplete, refusing resolution."
          delay={0}
          accent
        />

        <ManifestoBlock
          label="what we refuse"
          headline="Comfort. Compliance. The polished performance of femininity."
          body="Stories that end before they begin. Heroines who exist to be saved. The camera that looks at women instead of looking with them."
          delay={80}
        />

        <ManifestoBlock
          label="what we chase"
          headline="The moment before the scream."
          body="The silence that holds everything. A gaze that doesn't look away. Fragility turning into something you can't name but can't stop feeling."
          delay={160}
          accent
        />
      </div>
    </section>
  )
}

function CinematicImageSection() {
  const { ref: imgRef, isVisible: imgVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: quoteRef, isVisible: quoteVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative py-24 lg:py-40 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 xl:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image composition — two overlapping portraits */}
          <div ref={imgRef} className="relative">
            <div
              className="relative"
              style={{
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
              }}
            >
              {/* Main portrait */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/assets/team/elisabeth-rohm-1.jpg"
                  alt="Elisabeth Röhm"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  style={{
                    filter: imgVisible ? 'grayscale(0.3) brightness(0.95)' : 'grayscale(1) brightness(0.7)',
                    transition: 'filter 3s var(--ease-quiet)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(7, 7, 8, 0.6) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Second image — offset, smaller */}
              <div
                className="absolute -bottom-8 -right-6 lg:-right-12 w-[45%] aspect-[4/5] overflow-hidden"
                style={{
                  opacity: imgVisible ? 1 : 0,
                  transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
                  boxShadow: '0 0 60px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src="/assets/team/elisabeth-rohm-3.jpg"
                  alt=""
                  fill
                  className="object-cover"
                  sizes="25vw"
                  style={{
                    filter: 'grayscale(0.5) brightness(0.9)',
                  }}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(7, 7, 8, 0.4), transparent)',
                  }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Quote */}
          <div ref={quoteRef} className="lg:pl-8">
            <div style={{ overflow: 'hidden', paddingBottom: '4px', marginBottom: '2rem' }}>
              <blockquote
                className="font-serif font-light italic"
                style={{
                  fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                  lineHeight: 1.5,
                  color: 'rgba(245, 240, 235, 0.7)',
                  transform: quoteVisible ? 'translateY(0)' : 'translateY(110%)',
                  transition: 'transform 1.6s var(--ease-emerge) 0.2s',
                }}
              >
                &ldquo;A whisper that becomes a scream.&rdquo;
              </blockquote>
            </div>
            <p
              className="text-sm leading-[2.1] font-light"
              style={{
                color: 'rgba(245, 240, 235, 0.35)',
                letterSpacing: '0.02em',
                maxWidth: '44ch',
                opacity: quoteVisible ? 1 : 0,
                transition: 'opacity 2.5s var(--ease-quiet) 0.6s',
              }}
            >
              RFE is where feminine emotion becomes cinematic power.
              Not about films — about what women feel, reclaim, and express through cinema.
              Intimate. Poetic. Radical.
            </p>

            <Link
              href="/en/about"
              className="inline-block mt-10 text-[10px] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-700"
              style={{
                color: 'var(--rfe-gold-dim)',
                borderColor: 'rgba(181, 151, 90, 0.2)',
                opacity: quoteVisible ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.8s, color 500ms, border-color 500ms',
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
              discover our story
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturedWorkSection() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { ref: infoRef, isVisible: infoVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })
  const { lang } = useLanguage()

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 75% 60% at 72% 38%, rgba(181, 151, 90, 0.04) 0%, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto">
        <div
          ref={titleRef}
          className="mb-16 lg:mb-20"
          style={{
            letterSpacing: titleVisible ? '0.42em' : '0.08em',
            opacity: titleVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          <span
            className="text-[9px] uppercase font-light"
            style={{ color: 'var(--rfe-gold-dim)' }}
          >
            selected work
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
          {/* Visual — poster with cinematic treatment */}
          <div
            ref={cardRef}
            className="relative"
            style={{
              opacity: cardVisible ? 1 : 0,
              transition: 'opacity 2.5s var(--ease-quiet)',
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: '3/4', background: '#090809' }}
            >
              <Image
                src="/assets/works/affiches-documentary/2.VERONIQUE CINEMA/veronique.jpg"
                alt="Véronique"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  filter: cardVisible ? 'grayscale(0.2) brightness(0.9)' : 'grayscale(1) brightness(0.6)',
                  transition: 'filter 3s var(--ease-quiet)',
                }}
              />

              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse 88% 88% at 50% 50%, transparent 38%, rgba(0,0,0,0.72) 100%)',
                }}
                aria-hidden="true"
              />

              {/* Film grain */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  opacity: 0.05,
                  mixBlendMode: 'overlay',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
                aria-hidden="true"
              />
            </div>

            <p
              className="mt-3 text-[10px] tracking-[0.25em] uppercase"
              style={{ color: 'var(--rfe-gold-dim)' }}
            >
              2026 — documentary
            </p>
          </div>

          {/* Info */}
          <div ref={infoRef} className="lg:pt-6">
            <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '1.5rem' }}>
              <h2
                className="font-serif font-light text-balance"
                style={{
                  fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  color: 'var(--foreground)',
                  transform: infoVisible ? 'translateY(0)' : 'translateY(110%)',
                  transition: 'transform 1.6s var(--ease-emerge)',
                }}
              >
                Véronique
              </h2>
            </div>

            <p
              className="text-sm leading-[2.1] mb-10 font-light"
              style={{
                color: 'rgba(245, 240, 235, 0.48)',
                letterSpacing: '0.02em',
                maxWidth: '44ch',
                opacity: infoVisible ? 1 : 0,
                transition: 'opacity 2.5s var(--ease-quiet) 0.3s',
              }}
            >
              An intimate documentary portrait — the kind of story that doesn&apos;t
              ask permission. A woman seen not through anyone else&apos;s lens, but her own.
            </p>

            {/* Margret & Stevie card */}
            <div
              className="border-l-2 pl-5 mb-10"
              style={{
                borderColor: 'var(--rfe-gold)',
                opacity: infoVisible ? 0.8 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.5s',
              }}
            >
              <blockquote
                className="font-serif font-light italic text-sm leading-relaxed mb-2"
                style={{ color: 'rgba(245, 240, 235, 0.65)' }}
              >
                &ldquo;Shirley MacLaine To Star In Matthew Weiner&apos;s <em>Margret and Stevie</em>&rdquo;
              </blockquote>
              <a
                href="https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-500"
                style={{ color: 'var(--rfe-gold-dim)' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-gold)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--rfe-gold-dim)')}
              >
                Deadline, February 2026 ↗
              </a>
            </div>

            {/* Tags */}
            <div
              className="flex flex-wrap gap-3 mb-10"
              style={{
                opacity: infoVisible ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.7s',
              }}
            >
              {['Feature Film', 'Documentary', 'Female Gaze'].map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5"
                  style={{
                    color: 'rgba(245, 240, 235, 0.28)',
                    border: '1px solid rgba(245, 240, 235, 0.05)',
                    borderRadius: '100px',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <Link
              href={`/${lang}/our-work`}
              className="inline-block text-[10px] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-700"
              style={{
                color: 'var(--rfe-rose-dim)',
                borderColor: 'rgba(196, 160, 160, 0.18)',
                opacity: infoVisible ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.9s, color 500ms, border-color 500ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--rfe-rose)'
                e.currentTarget.style.borderColor = 'var(--rfe-rose)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--rfe-rose-dim)'
                e.currentTarget.style.borderColor = 'rgba(196, 160, 160, 0.18)'
              }}
            >
              see all work
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamTeaser() {
  const { ref: sectionRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { lang } = useLanguage()

  const teamImages = [
    { src: '/assets/team/liz-rohm-1.jpg', alt: 'Elisabeth Röhm' },
    { src: '/assets/team/liz-rohm-3.jpg', alt: 'Elisabeth Röhm' },
    { src: '/assets/team/kara.png', alt: 'Kara' },
  ]

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 45% at 50% 40%, rgba(196, 160, 160, 0.03) 0%, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      <div ref={sectionRef} className="relative max-w-6xl mx-auto">
        <span
          className="block text-[9px] uppercase mb-16 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: isVisible ? '0.42em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          the voices
        </span>

        {/* Portrait grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-14">
          {teamImages.map((img, i) => (
            <div
              key={img.src}
              className="relative aspect-[3/4] overflow-hidden"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 2s var(--ease-quiet) ${i * 200}ms, transform 2s var(--ease-quiet) ${i * 200}ms`,
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{
                  filter: isVisible ? 'grayscale(0.4) brightness(0.85) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                  transition: 'filter 3s var(--ease-quiet)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(7, 7, 8, 0.6) 0%, transparent 50%)',
                }}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        <div className="text-center">
          <div style={{ overflow: 'hidden', paddingBottom: '4px', marginBottom: '1rem' }}>
            <p
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: 'rgba(245, 240, 235, 0.55)',
                lineHeight: 1.45,
                transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.5s var(--ease-emerge) 0.4s',
              }}
            >
              the women behind the gaze.
            </p>
          </div>
          <Link
            href={`/${lang}/our-team`}
            className="inline-block mt-6 text-[10px] tracking-[0.3em] uppercase pb-1 border-b transition-all duration-700"
            style={{
              color: 'var(--rfe-gold-dim)',
              borderColor: 'rgba(181, 151, 90, 0.2)',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 2s var(--ease-quiet) 0.6s, color 500ms, border-color 500ms',
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
            meet the team
          </Link>
        </div>
      </div>
    </section>
  )
}

function PressSection() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 45% 50% at 82% 28%, rgba(139, 26, 26, 0.03) 0%, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto">
        <div ref={headingRef} className="mb-16">
          <span
            className="text-[9px] uppercase block mb-6 font-light"
            style={{
              color: 'var(--rfe-gold-dim)',
              letterSpacing: headingVisible ? '0.42em' : '0.08em',
              opacity: headingVisible ? 1 : 0,
              transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
            }}
          >
            press
          </span>

          <div style={{ overflow: 'hidden', paddingBottom: '4px' }}>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
                color: 'rgba(245, 240, 235, 0.65)',
                letterSpacing: '-0.01em',
                lineHeight: 1.25,
                transform: headingVisible ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.5s var(--ease-emerge) 0.2s',
              }}
            >
              the world is starting to listen.
            </h2>
          </div>
        </div>

        <div
          ref={cardRef}
          style={{
            opacity: cardVisible ? 1 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.15s',
          }}
        >
          <a
            href="https://deadline.com/2026/02/shirley-maclaine-margret-and-stevie-matthew-weiner-1236729698/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-8 py-7 border-t"
            style={{ borderColor: 'rgba(245, 240, 235, 0.05)' }}
          >
            <div className="shrink-0 sm:w-32">
              <span
                className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-700"
                style={{ color: 'var(--rfe-gold-dim)' }}
              >
                Deadline
              </span>
              <span
                className="block text-[10px] tracking-[0.1em] mt-1 font-light"
                style={{ color: 'rgba(245, 240, 235, 0.22)' }}
              >
                February 2026
              </span>
            </div>
            <span
              className="font-serif font-light text-sm leading-relaxed transition-colors duration-700 group-hover:text-[rgba(245,240,235,0.88)]"
              style={{ color: 'rgba(245, 240, 235, 0.5)' }}
            >
              Shirley MacLaine To Star In Matthew Weiner&apos;s &lsquo;Margret and Stevie&rsquo;{' '}
              <span style={{ color: 'var(--rfe-gold-dim)' }}>↗</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.35 })

  return (
    <section
      id="contact"
      className="relative px-6 py-36 lg:py-52 flex flex-col items-center justify-center text-center"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 50% 85%, rgba(196, 160, 160, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 30% 30% at 50% 100%, rgba(139, 26, 26, 0.03) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative max-w-lg mx-auto">
        <span
          className="block text-[9px] uppercase mb-10 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: isVisible ? '0.42em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          contact
        </span>

        <div style={{ overflow: 'hidden', paddingBottom: '4px', marginBottom: '2rem' }}>
          <p
            className="font-serif font-light"
            style={{
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              color: 'rgba(245, 240, 235, 0.55)',
              lineHeight: 1.55,
              letterSpacing: '-0.005em',
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge) 0.2s',
            }}
          >
            if it won&apos;t leave you alone, write to us.
          </p>
        </div>

        <a
          href="mailto:contact@rfe.studio"
          className="inline-block text-sm tracking-[0.15em] border-b pb-0.5"
          style={{
            color: 'var(--rfe-rose)',
            borderColor: 'rgba(196, 160, 160, 0.18)',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.5s, color 500ms, border-color 500ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--foreground)'
            e.currentTarget.style.borderColor = 'rgba(245, 240, 235, 0.38)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--rfe-rose)'
            e.currentTarget.style.borderColor = 'rgba(196, 160, 160, 0.18)'
          }}
        >
          contact@rfe.studio
        </a>
      </div>
    </section>
  )
}

export default function HomeContent() {
  return (
    <main className="relative">
      <CinematicHero />

      <ArcDivider />

      <ManifestoSection />

      <ArcDivider flip />

      <CinematicImageSection />

      <ArcDivider />

      <FeaturedWorkSection />

      <ArcDivider flip />

      <TeamTeaser />

      <ArcDivider />

      <PressSection />

      <ArcDivider flip />

      <ContactSection />
    </main>
  )
}

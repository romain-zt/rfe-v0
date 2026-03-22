'use client'

import { CinematicHero } from '@/components/CinematicHero'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { useRef, useEffect, useState, useCallback } from 'react'

// ============================================
// MANIFESTO
// ============================================

function ManifestoCard({
  index,
  label,
  headline,
  body,
  accent,
  align,
  glow,
  projectorSide,
}: {
  index: string
  label: string
  headline: string
  body: string
  accent: 'gold' | 'rose' | 'red'
  align: 'left' | 'right' | 'center'
  glow: string
  projectorSide: 'left' | 'right' | 'center'
}) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.18 })

  const accentColor = {
    gold: 'var(--rfe-gold)',
    rose: 'var(--rfe-rose-dim)',
    red: 'var(--rfe-red)',
  }[accent]

  const accentRgb = {
    gold: '181, 151, 90',
    rose: '196, 160, 160',
    red: '139, 26, 26',
  }[accent]

  const alignClass = {
    left: 'md:mr-auto md:ml-0',
    right: 'md:ml-auto md:mr-0',
    center: 'md:mx-auto',
  }[align]

  const projectorGradient = {
    left: `linear-gradient(105deg, rgba(${accentRgb}, 0.07) 0%, rgba(${accentRgb}, 0.02) 35%, transparent 65%)`,
    right: `linear-gradient(255deg, rgba(${accentRgb}, 0.07) 0%, rgba(${accentRgb}, 0.02) 35%, transparent 65%)`,
    center: `radial-gradient(ellipse 70% 80% at 50% 40%, rgba(${accentRgb}, 0.05) 0%, transparent 60%)`,
  }[projectorSide]

  return (
    <div
      ref={ref}
      className={`relative max-w-xl w-full ${alignClass}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 1.6s var(--ease-quiet), transform 1.8s var(--ease-emerge)',
      }}
    >
      <div
        className="absolute pointer-events-none -inset-20"
        style={{ background: glow, opacity: isVisible ? 1 : 0, transition: 'opacity 3s var(--ease-quiet)' }}
        aria-hidden="true"
      />

      <div
        className="absolute pointer-events-none -inset-10 md:-inset-16"
        style={{
          background: projectorGradient,
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 3.5s var(--ease-quiet) 0.3s',
        }}
        aria-hidden="true"
      />

      <div className="relative px-6 py-10 md:px-10 md:py-14">
        <span
          className="absolute font-serif font-light pointer-events-none select-none"
          style={{
            fontSize: 'clamp(5rem, 12vw, 9rem)',
            lineHeight: 1,
            top: '-0.7em',
            right: align === 'right' ? 'auto' : '0',
            left: align === 'right' ? '0' : 'auto',
            color: accentColor,
            opacity: isVisible ? 0.22 : 0,
            transition: 'opacity 3s var(--ease-quiet)',
          }}
          aria-hidden="true"
        >
          {index}
        </span>

        <p
          className="text-[10px] uppercase mb-5 font-light"
          style={{
            color: accentColor,
            letterSpacing: isVisible ? '0.38em' : '0.08em',
            opacity: isVisible ? 0.7 : 0,
            transition: 'opacity 1.5s var(--ease-quiet) 0.15s, letter-spacing 2.2s var(--ease-quiet) 0.15s',
          }}
        >
          {label}
        </p>

        <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '1.5rem' }}>
          <h2
            className="font-serif font-light text-balance"
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.6s var(--ease-emerge) 0.1s',
            }}
          >
            {headline}
          </h2>
        </div>

        <p
          className="text-sm leading-[2.1] font-light"
          style={{
            color: 'rgba(245, 240, 235, 0.42)',
            letterSpacing: '0.025em',
            maxWidth: '48ch',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2.8s var(--ease-quiet) 0.4s',
          }}
        >
          {body}
        </p>

        <div
          className="absolute top-0 h-full w-px"
          style={{
            [align === 'right' ? 'right' : 'left']: 0,
            background: `linear-gradient(to bottom, transparent, ${accentColor}, transparent)`,
            opacity: isVisible ? 0.2 : 0,
            transition: 'opacity 2s var(--ease-quiet) 0.3s',
          }}
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

function ManifestoSection() {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 overflow-hidden section-tone-charcoal section-bleed-top section-bleed-bottom">
      <div className="relative max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <div
          ref={headerRef}
          className="mb-20 lg:mb-28 text-center"
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

        <div className="flex flex-col gap-20 md:gap-28 lg:gap-36">
          <ManifestoCard
            index="01"
            label="why we exist"
            headline="Because women's stories have always existed."
            body="They kept getting cut, softened, explained away. Told through someone else's eyes. We exist to let them breathe — raw, incomplete, refusing resolution."
            accent="gold"
            align="left"
            projectorSide="left"
            glow="radial-gradient(ellipse 70% 60% at 20% 50%, rgba(181, 151, 90, 0.04) 0%, transparent 70%)"
          />

          <ManifestoCard
            index="02"
            label="what we refuse"
            headline="Comfort. Compliance. The polished performance of femininity."
            body="Stories that end before they begin. Heroines who exist to be saved. The camera that looks at women instead of looking with them."
            accent="rose"
            align="right"
            projectorSide="right"
            glow="radial-gradient(ellipse 70% 60% at 80% 50%, rgba(196, 160, 160, 0.04) 0%, transparent 70%)"
          />

          <ManifestoCard
            index="03"
            label="what we chase"
            headline="The moment before the scream."
            body="The silence that holds everything. A gaze that doesn't look away. Fragility turning into something you can't name but can't stop feeling."
            accent="red"
            align="center"
            projectorSide="center"
            glow="radial-gradient(ellipse 60% 60% at 50% 50%, rgba(139, 26, 26, 0.045) 0%, transparent 65%)"
          />
        </div>
      </div>
    </section>
  )
}

// ============================================
// HORIZONTAL SCROLL WORK SECTION
// ============================================

function WorkHorizontalScroll() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { lang } = useLanguage()

  const projects = [
    { src: '/assets/works/margret-stevie.png', title: 'Margret & Stevie', year: '2026', size: 'large' },
    { src: '/assets/works/the-dating-app-killer.jpg', title: 'The Dating App Killer', year: '2026', size: 'small' },
    { src: '/assets/works/lobotomist-wife.png', title: "The Lobotomist's Wife", year: '2026', size: 'medium' },
    { src: '/assets/works/diamonds-and-deadlines.png', title: 'Diamonds and Deadlines', year: '2026', size: 'large' },
    { src: '/assets/works/ruby-falls.png', title: 'Ruby Falls', year: '2026', size: 'small' },
    { src: '/assets/works/murder-your-darlings.jpg', title: 'Murder Your Darlings', year: '2026', size: 'medium' },
  ]

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return
    const el = scrollRef.current
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 0) {
      setScrollProgress(el.scrollLeft / maxScroll)
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden section-tone-warm section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(139, 26, 26, 0.035) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative">
        <div ref={titleRef} className="px-6 lg:px-16 mb-12 flex items-end justify-between">
          <div
            style={{
              opacity: titleVisible ? 1 : 0,
              transition: 'opacity 1.5s var(--ease-quiet)',
            }}
          >
            <span
              className="text-[9px] uppercase block mb-4 font-light"
              style={{
                color: 'var(--rfe-gold-dim)',
                letterSpacing: titleVisible ? '0.42em' : '0.08em',
                transition: 'letter-spacing 2.2s var(--ease-quiet)',
              }}
            >
              what keeps us up
            </span>
          </div>
          <Link
            href={`/${lang}/our-work`}
            className="text-[10px] tracking-[0.25em] uppercase pb-0.5 border-b transition-colors duration-500 hidden sm:inline-block"
            style={{ color: 'var(--rfe-gold-dim)', borderColor: 'rgba(181, 151, 90, 0.15)' }}
          >
            see all ↗
          </Link>
        </div>

        {/* Horizontal scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden px-6 lg:px-16 pb-4 snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {projects.map((project, i) => {
            const width = project.size === 'large'
              ? 'clamp(280px, 35vw, 420px)'
              : project.size === 'medium'
                ? 'clamp(200px, 25vw, 320px)'
                : 'clamp(150px, 18vw, 220px)'

            const aspect = project.size === 'large'
              ? '3/4'
              : project.size === 'medium'
                ? '2/3'
                : '4/5'

            return (
              <div
                key={project.title}
                className="relative flex-shrink-0 snap-start group"
                style={{
                  width,
                  marginTop: i % 2 === 0 ? '0' : '2rem',
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: aspect }}
                >
                  <Image
                    src={project.src}
                    alt={project.title}
                    fill
                    className="object-cover transition-all duration-[1.5s] group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 60vw, 35vw"
                    style={{
                      filter: 'grayscale(0.4) brightness(0.85)',
                      transition: 'filter 1.5s var(--ease-quiet)',
                    }}
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(7, 7, 8, 0.55) 0%, transparent 50%)',
                    }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3">
                  <p
                    className="font-serif text-[12px] md:text-sm font-light tracking-wide"
                    style={{ color: 'rgba(245, 240, 235, 0.55)' }}
                  >
                    {project.title}
                  </p>
                  <p
                    className="text-[9px] tracking-[0.2em] mt-1"
                    style={{ color: 'rgba(245, 240, 235, 0.2)' }}
                  >
                    {project.year}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Scroll progress indicator */}
        <div className="px-6 lg:px-16 mt-6">
          <div className="h-px w-full max-w-xs mx-auto" style={{ background: 'rgba(245, 240, 235, 0.06)' }}>
            <div
              className="h-full transition-all duration-150"
              style={{
                width: `${Math.max(20, scrollProgress * 100)}%`,
                background: 'var(--rfe-gold-dim)',
                opacity: 0.4,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// OVERLAPPING IMAGE + QUOTE (images bleed into text)
// ============================================

function OverlappingImageSection() {
  const { ref: imgRef, isVisible: imgVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: quoteRef, isVisible: quoteVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative py-24 lg:py-40 overflow-hidden section-tone-dusk section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 30% 50%, rgba(196, 160, 160, 0.035) 0%, transparent 55%)',
        }}
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-16 xl:px-24" style={{ position: 'relative', zIndex: 2 }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-0 items-center">
          {/* Image — bleeds into text column */}
          <div ref={imgRef} className="lg:col-span-7 relative">
            <div
              className="relative"
              style={{
                opacity: imgVisible ? 1 : 0,
                transform: imgVisible ? 'translateY(0)' : 'translateY(30px)',
                transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden lg:-mr-20">
                <Image
                  src="/assets/team/elisabeth-rohm-1.jpg"
                  alt="Elisabeth Röhm"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
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

              {/* Offset second image */}
              <div
                className="absolute -bottom-8 -right-6 lg:right-0 w-[40%] aspect-[4/5] overflow-hidden"
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
                  style={{ filter: 'grayscale(0.5) brightness(0.9)' }}
                />
              </div>
            </div>
          </div>

          {/* Quote — overlaps image on desktop */}
          <div ref={quoteRef} className="lg:col-span-5 relative lg:-ml-12 mt-12 lg:mt-0">
            <div
              className="relative bg-background/80 lg:bg-background/60 lg:backdrop-blur-sm p-6 lg:p-10"
              style={{ position: 'relative', zIndex: 3 }}
            >
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
              </p>

              {/* Inline contact — woven in, not relegated */}
              <a
                href="mailto:contact@rfe.studio"
                className="inline-block mt-8 text-[10px] tracking-[0.25em] uppercase transition-colors duration-500"
                style={{
                  color: 'var(--rfe-rose-dim)',
                  opacity: quoteVisible ? 1 : 0,
                  transition: 'opacity 2s var(--ease-quiet) 0.8s, color 500ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-rose)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--rfe-rose-dim)')}
              >
                contact@rfe.studio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================
// FEATURED WORK
// ============================================

function FeaturedWorkSection() {
  const { ref: titleRef, isVisible: titleVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { ref: infoRef, isVisible: infoVisible } = useReveal<HTMLDivElement>({ threshold: 0.25 })
  const { lang } = useLanguage()

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 overflow-hidden section-tone-ember section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 75% 60% at 72% 38%, rgba(181, 151, 90, 0.06) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 15% 80%, rgba(139, 26, 26, 0.025) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
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
            in the spotlight
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 lg:gap-20 items-start">
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
                src="/assets/works/margret-stevie.png"
                alt="Margret & Stevie"
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
              2026 — drama
            </p>
          </div>

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
                Margret &amp; Stevie
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
              A sharp-edged friendship that becomes a lifeline — two women
              reigniting resolve in each other. The kind of bond you feel
              before you understand.
            </p>

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

            <div
              className="flex flex-wrap gap-3 mb-10"
              style={{
                opacity: infoVisible ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.7s',
              }}
            >
              {['Feature Film', 'Drama', 'Female Gaze'].map((tag) => (
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

// ============================================
// TEAM TEASER — "the gaze"
// ============================================

function TeamTeaser() {
  const { ref: sectionRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { lang } = useLanguage()

  const teamImages = [
    { src: '/assets/team/liz-rohm-1.jpg', alt: 'Elisabeth Röhm' },
    { src: '/assets/team/liz-rohm-3.jpg', alt: 'Elisabeth Röhm' },
    { src: '/assets/team/kara.png', alt: 'Kara' },
  ]

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 section-tone-cool section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 45% at 50% 40%, rgba(196, 160, 160, 0.045) 0%, transparent 55%),
            radial-gradient(ellipse 35% 35% at 80% 75%, rgba(181, 151, 90, 0.02) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div ref={sectionRef} className="relative max-w-6xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <span
          className="block text-[9px] uppercase mb-16 font-light"
          style={{
            color: 'var(--rfe-gold-dim)',
            letterSpacing: isVisible ? '0.42em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          the gaze
        </span>

        {/* Staggered portrait grid — not uniform */}
        <div className="grid grid-cols-12 gap-3 md:gap-5 mb-14">
          <div
            className="col-span-5 relative aspect-[3/4] overflow-hidden"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
            }}
          >
            <Image
              src={teamImages[0].src}
              alt={teamImages[0].alt}
              fill
              className="object-cover"
              sizes="42vw"
              style={{
                filter: isVisible ? 'grayscale(0.4) brightness(0.85) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                transition: 'filter 3s var(--ease-quiet)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7, 7, 8, 0.6) 0%, transparent 50%)' }}
              aria-hidden="true"
            />
          </div>

          <div
            className="col-span-4 relative aspect-[2/3] overflow-hidden mt-12 md:mt-20"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s var(--ease-quiet) 200ms, transform 2s var(--ease-quiet) 200ms',
            }}
          >
            <Image
              src={teamImages[1].src}
              alt={teamImages[1].alt}
              fill
              className="object-cover"
              sizes="33vw"
              style={{
                filter: isVisible ? 'grayscale(0.4) brightness(0.85) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                transition: 'filter 3s var(--ease-quiet)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7, 7, 8, 0.6) 0%, transparent 50%)' }}
              aria-hidden="true"
            />
          </div>

          <div
            className="col-span-3 relative aspect-[3/5] overflow-hidden mt-6 md:mt-10"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 2s var(--ease-quiet) 400ms, transform 2s var(--ease-quiet) 400ms',
            }}
          >
            <Image
              src={teamImages[2].src}
              alt={teamImages[2].alt}
              fill
              className="object-cover"
              sizes="25vw"
              style={{
                filter: isVisible ? 'grayscale(0.4) brightness(0.85) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                transition: 'filter 3s var(--ease-quiet)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(7, 7, 8, 0.6) 0%, transparent 50%)' }}
              aria-hidden="true"
            />
          </div>
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

// ============================================
// PRESS — "they're listening"
// ============================================

function PressSection() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-24 lg:py-36 section-tone-warm section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 45% 50% at 82% 28%, rgba(139, 26, 26, 0.04) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 10% 70%, rgba(181, 151, 90, 0.02) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
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
            they&apos;re listening
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

// ============================================
// CONTACT — woven in, not relegated
// ============================================

function ContactSection() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.35 })

  return (
    <section
      id="contact"
      className="relative px-6 py-28 lg:py-40 flex flex-col items-center justify-center text-center section-tone-deep section-bleed-top"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 50% at 50% 85%, rgba(196, 160, 160, 0.05) 0%, transparent 60%),
            radial-gradient(ellipse 30% 30% at 50% 100%, rgba(139, 26, 26, 0.04) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative max-w-lg mx-auto">
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

// ============================================
// HOME — non-linear, overlapping, editorial
// ============================================

export default function HomeContent() {
  return (
    <main className="relative">
      <CinematicHero />

      {/* Content shell — sits above the fixed hero image */}
      <div className="relative z-10" style={{ background: 'var(--background)' }}>
        {/* Soft dissolve from fixed hero into content */}
        <div
          className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none"
          style={{
            height: '40vh',
            background: 'linear-gradient(to top, var(--background) 0%, rgba(7, 7, 8, 0.85) 30%, rgba(7, 7, 8, 0.4) 65%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        {/* Structure: Hero → Manifesto → Horizontal Work → Overlapping Image → Featured → Team → Press → Contact */}
        {/* Key breaks from linear: horizontal scroll, overlapping grid, contact email in image section */}

        <ManifestoSection />

        <WorkHorizontalScroll />

        <OverlappingImageSection />

        <FeaturedWorkSection />

        <TeamTeaser />

        <PressSection />

        <ContactSection />
      </div>
    </main>
  )
}

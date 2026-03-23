'use client'

import { CinematicHero } from '@/components/CinematicHero'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { useRef, useEffect, useState, useCallback } from 'react'

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
              Our Work
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

        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden px-6 lg:px-16 pb-4 snap-x snap-mandatory no-scrollbar"
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
// ABOUT TEASER — replaces overlapping image section
// ============================================

function AboutTeaser() {
  const { ref: imgRef, isVisible: imgVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const { ref: textRef, isVisible: textVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { lang } = useLanguage()

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
          {/* Dual portrait images */}
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
                  src="/assets/team/liz-rohm-hero.png"
                  alt="Elisabeth Rohm"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  style={{
                    filter: imgVisible ? 'grayscale(0.2) brightness(0.9)' : 'grayscale(1) brightness(0.6)',
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

              <div
                className="absolute -bottom-8 -right-6 lg:right-0 w-[40%] aspect-[4/5] overflow-hidden"
                style={{
                  opacity: imgVisible ? 1 : 0,
                  transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
                  boxShadow: '0 0 60px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src="/assets/team/kara.png"
                  alt="Kara Feifer"
                  fill
                  className="object-cover object-top"
                  sizes="25vw"
                  style={{ filter: 'grayscale(0.4) brightness(0.85)' }}
                />
              </div>
            </div>
          </div>

          {/* Text — overlaps image on desktop */}
          <div ref={textRef} className="lg:col-span-5 relative lg:-ml-12 mt-16 lg:mt-0">
            <div
              className="relative bg-background/80 lg:bg-background/60 lg:backdrop-blur-sm p-6 lg:p-10"
              style={{ position: 'relative', zIndex: 3 }}
            >
              <p
                className="text-[9px] uppercase mb-6 font-light"
                style={{
                  color: 'var(--rfe-gold-dim)',
                  letterSpacing: textVisible ? '0.42em' : '0.08em',
                  opacity: textVisible ? 1 : 0,
                  transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
                }}
              >
                About Us
              </p>

              <div style={{ overflow: 'hidden', paddingBottom: '4px', marginBottom: '1.5rem' }}>
                <p
                  className="font-serif font-light"
                  style={{
                    fontSize: 'clamp(1.3rem, 2.8vw, 1.8rem)',
                    lineHeight: 1.4,
                    color: 'rgba(245, 240, 235, 0.75)',
                    transform: textVisible ? 'translateY(0)' : 'translateY(110%)',
                    transition: 'transform 1.6s var(--ease-emerge) 0.2s',
                  }}
                >
                  Elisabeth Rohm &amp; Kara Feifer
                </p>
              </div>

              <p
                className="text-sm leading-[2.1] font-light mb-8"
                style={{
                  color: 'rgba(245, 240, 235, 0.38)',
                  letterSpacing: '0.02em',
                  maxWidth: '44ch',
                  opacity: textVisible ? 1 : 0,
                  transition: 'opacity 2.5s var(--ease-quiet) 0.4s',
                }}
              >
                Launched in 2023, RFE is a woman-owned film and television production company committed to telling
                inspirational, empowering stories steeped in true crime and true stories.
              </p>

              <Link
                href={`/${lang}/about`}
                className="inline-block text-[10px] tracking-[0.25em] uppercase pb-1 border-b transition-all duration-700"
                style={{
                  color: 'var(--rfe-rose-dim)',
                  borderColor: 'rgba(196, 160, 160, 0.18)',
                  opacity: textVisible ? 1 : 0,
                  transition: 'opacity 2s var(--ease-quiet) 0.6s, color 500ms, border-color 500ms',
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
                Meet the founders ↗
              </Link>
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
              {['Feature Film', 'Drama', 'True Story'].map((tag) => (
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
// PRESS — "they're listening"
// ============================================

function PressSection() {
  const { ref: headingRef, isVisible: headingVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })
  const { ref: cardRef, isVisible: cardVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { lang } = useLanguage()

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
        <div ref={headingRef} className="mb-10 flex items-end justify-between">
          <div>
            <span
              className="text-[9px] uppercase block mb-6 font-light"
              style={{
                color: 'var(--rfe-gold-dim)',
                letterSpacing: headingVisible ? '0.42em' : '0.08em',
                opacity: headingVisible ? 1 : 0,
                transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
              }}
            >
              Press
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

          <Link
            href={`/${lang}/press`}
            className="text-[10px] tracking-[0.25em] uppercase pb-0.5 border-b transition-colors duration-500 hidden sm:inline-block shrink-0 ml-8"
            style={{ color: 'var(--rfe-gold-dim)', borderColor: 'rgba(181, 151, 90, 0.15)' }}
          >
            all press ↗
          </Link>
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
// CONTACT
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
            Ready to partner with us?
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
// HOME
// ============================================

export default function HomeContent() {
  return (
    <main className="relative">
      <CinematicHero />

      <div className="relative z-10" style={{ background: 'var(--background)' }}>
        <div
          className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none"
          style={{
            height: '40vh',
            background: 'linear-gradient(to top, var(--background) 0%, rgba(7, 7, 8, 0.85) 30%, rgba(7, 7, 8, 0.4) 65%, transparent 100%)',
          }}
          aria-hidden="true"
        />

        <WorkHorizontalScroll />
        <AboutTeaser />
        <FeaturedWorkSection />
        <PressSection />
        <ContactSection />
      </div>
    </main>
  )
}

'use client'

import { PageCinematicHero } from '@/components/PageCinematicHero'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'
import Link from 'next/link'

// ============================================
// COMPANY OVERVIEW
// ============================================

function CompanyOverview() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  return (
    <section className="relative px-6 lg:px-16 xl:px-24 py-20 lg:py-32 section-tone-charcoal section-bleed-top section-bleed-bottom">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 55% 45% at 15% 35%, rgba(181, 151, 90, 0.04) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 85% 75%, rgba(196, 160, 160, 0.025) 0%, transparent 55%)
          `,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative max-w-4xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
        <p
          className="text-[10px] uppercase mb-10 font-light"
          style={{
            color: 'var(--rfe-gold)',
            letterSpacing: isVisible ? '0.38em' : '0.08em',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
          }}
        >
          About Us
        </p>

        <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '2.5rem' }}>
          <h2
            className="font-serif font-light text-balance"
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              lineHeight: 1.2,
              letterSpacing: '-0.01em',
              color: 'var(--foreground)',
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.6s var(--ease-emerge) 0.1s',
            }}
          >
            Woman-owned. Story-driven. Built for impact.
          </h2>
        </div>

        <div
          className="space-y-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2.5s var(--ease-quiet) 0.4s',
          }}
        >
          <p
            className="text-base leading-[2.1] font-light"
            style={{ color: 'rgba(245, 240, 235, 0.65)', letterSpacing: '0.02em', maxWidth: '68ch' }}
          >
            Launched in 2023, RFE is a woman-owned film and television production company committed to telling
            inspirational, empowering stories steeped in true crime and true stories that resonate with audiences of all kinds.
          </p>
          <p
            className="text-base leading-[2.1] font-light"
            style={{ color: 'rgba(245, 240, 235, 0.5)', letterSpacing: '0.02em', maxWidth: '68ch' }}
          >
            Rohm Feifer Entertainment&rsquo;s team has decades of experience creating high-quality, critically-acclaimed,
            award-winning and globally popular films and series, as well as nonscripted series, documentaries, and podcasts.
          </p>
        </div>
      </div>
    </section>
  )
}

// ============================================
// BIO SECTION — reusable
// ============================================

function BioSection({
  name,
  role,
  bio,
  mainImage,
  imageAlt,
  extraImages,
  videoSrc,
  externalLink,
  externalLinkLabel,
  reverse = false,
}: {
  name: string
  role: string
  bio: string[]
  mainImage: string
  imageAlt: string
  extraImages?: string[]
  videoSrc?: string
  externalLink?: string
  externalLinkLabel?: string
  reverse?: boolean
}) {
  const { ref: sectionRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })

  return (
    <section
      className={`relative px-6 lg:px-16 xl:px-24 py-20 lg:py-32 ${reverse ? 'section-tone-cool' : 'section-tone-warm'} section-bleed-top section-bleed-bottom`}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: reverse
            ? `radial-gradient(ellipse 55% 45% at 80% 50%, rgba(196, 160, 160, 0.05) 0%, transparent 60%)`
            : `radial-gradient(ellipse 55% 45% at 20% 50%, rgba(181, 151, 90, 0.05) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div
        ref={sectionRef}
        className={`relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start ${reverse ? 'lg:[direction:rtl]' : ''}`}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {/* Image column */}
        <div className={reverse ? 'lg:[direction:ltr]' : ''}>
          <div
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
            }}
          >
            {/* Main portrait */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={mainImage}
                alt={imageAlt}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  filter: isVisible ? 'grayscale(0.2) brightness(0.9) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                  transition: 'filter 3s var(--ease-quiet)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 90% 90% at 50% 50%, transparent 35%, rgba(7, 7, 8, 0.45) 100%),
                    linear-gradient(to top, rgba(7, 7, 8, 0.45) 0%, transparent 40%)
                  `,
                }}
                aria-hidden="true"
              />
            </div>

            {/* Extra BTS images in a small row */}
            {extraImages && extraImages.length > 0 && (
              <div className="flex gap-2 mt-3">
                {extraImages.slice(0, 4).map((src, i) => (
                  <div
                    key={src}
                    className="relative flex-1 aspect-[4/3] overflow-hidden"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transition: `opacity 2s var(--ease-quiet) ${0.3 + i * 0.15}s`,
                    }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="12vw"
                      style={{ filter: 'grayscale(0.5) brightness(0.75)' }}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Reel video */}
            {videoSrc && (
              <div
                className="relative mt-3 overflow-hidden"
                style={{
                  aspectRatio: '16/9',
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 2s var(--ease-quiet) 0.8s',
                }}
              >
                <video
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.88)' }}
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(ellipse 90% 90% at 50% 50%, transparent 40%, rgba(7,7,8,0.45) 100%)',
                  }}
                  aria-hidden="true"
                />
              </div>
            )}
          </div>
        </div>

        {/* Text column */}
        <div className={`${reverse ? 'lg:[direction:ltr]' : ''} lg:pt-4`}>
          <p
            className="text-[10px] uppercase mb-5 font-light"
            style={{
              color: 'var(--rfe-gold)',
              letterSpacing: isVisible ? '0.38em' : '0.08em',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 1.5s var(--ease-quiet) 0.2s, letter-spacing 2.2s var(--ease-quiet) 0.2s',
            }}
          >
            {role}
          </p>

          <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '2rem' }}>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: 'var(--foreground)',
                transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.6s var(--ease-emerge) 0.3s',
              }}
            >
              {name}
            </h2>
          </div>

          <div
            className="space-y-5"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
            }}
          >
            {bio.map((paragraph, i) => (
              <p
                key={i}
                className="text-sm leading-[2.1] font-light"
                style={{ color: 'rgba(245, 240, 235, 0.5)', letterSpacing: '0.02em', maxWidth: '52ch' }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {externalLink && externalLinkLabel && (
            <Link
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-10 text-[10px] tracking-[0.25em] uppercase pb-1 border-b transition-all duration-500"
              style={{
                color: 'var(--rfe-rose-dim)',
                borderColor: 'rgba(196, 160, 160, 0.18)',
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.8s, color 500ms, border-color 500ms',
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
              {externalLinkLabel} ↗
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

// ============================================
// CLOSING STATEMENT
// ============================================

function ClosingStatement() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative px-6 py-32 lg:py-44 flex items-center justify-center section-tone-deep section-bleed-top">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 50% 50% at 50% 80%, rgba(196, 160, 160, 0.05) 0%, transparent 55%),
            radial-gradient(ellipse 35% 35% at 50% 20%, rgba(181, 151, 90, 0.02) 0%, transparent 50%)
          `,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative text-center max-w-2xl mx-auto" style={{ position: 'relative', zIndex: 2 }}>
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
            There&rsquo;s always more to the story.
            <br />
            <span style={{ color: 'var(--rfe-rose)' }}>We&rsquo;re here to tell it.</span>
          </p>
        </div>

        {/* <a
          href="mailto:elisabeth@rohmfeiferentertainment.com"
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
          elisabeth@rohmfeiferentertainment.com
        </a> */}
      </div>
    </section>
  )
}

// ============================================
// ABOUT CONTENT
// ============================================

export default function AboutContent() {
  return (
    <main className="relative">
      <PageCinematicHero
        imageSrc="/assets/team/liz-rohm-hero.png"
        imagePosition="center center"
        label="about us"
      >
        True Crime.{' '}
        <span style={{ color: 'var(--rfe-rose)' }}>Real Drama.</span>
      </PageCinematicHero>

      <div className="relative z-10" style={{ backgroundColor: 'var(--background)' }}>
        <CompanyOverview />

        <BioSection
          name="Kara Feifer"
          role="Co-Founder & Executive Producer"
          bio={[
            'Kara Feifer, entertainment veteran, is not only known for starring in the international television series TIME OF YOUR LIFE, but also for her fruitful network collaborations.',
            'She executive produced films such as TEMPTING FATE, starring Alyssa Milano; TO HAVE AND TO HOLD; FAMILY PICTURES, starring Elisabeth Rohm; HUSBAND/FATHER/KILLER, starring Jackie Cruz; WIFE STALKER starring Keshia Knight Pulliam; and DATING APP KILLER: THE MONICA WHITE STORY starring Lela Rochon.',
            'She is the executive producer of \u201cShe Wants More,\u201d the Webby nominated iHeart podcast.',
          ]}
          mainImage="/assets/team/kara.png"
          imageAlt="Kara Feifer"
          externalLink="https://www.iheart.com/podcast/104-she-wants-more-with-kara-feifer-30836849/"
          externalLinkLabel="She Wants More podcast"
        />

        <BioSection
          name="Elisabeth Rohm"
          role="Co-Founder, Director & Producer"
          bio={[
            'Elisabeth Rohm is an acclaimed actress, director, and producer, best known for her role in LAW & ORDER (Emmy and SAG nominee). Her collaboration with David O. Russell in the Oscar-nominated AMERICAN HUSTLE earned her a SAG Award for Best Ensemble. She also starred in Russell\u2019s JOY as well as Jay Roach\u2019s Oscar-nominated BOMBSHELL.',
            'Beginning with her directorial debut, GIRL IN THE BASEMENT, Rohm gravitates towards thrilling, woman-centered stories. Other films include SWITCHED BEFORE BIRTH; GIRL IN ROOM 13; DEVIL ON CAMPUS: THE LARRY RAY STORY, starring Billy Zane; HUSBAND/FATHER/KILLER; and WIFE STALKER. Episodic directing includes LAW & ORDER and CHICAGO MED.',
          ]}
          mainImage="/assets/portfolio-medias/elisabeth-1.png"
          imageAlt="Elisabeth Rohm"
          extraImages={[
            '/assets/portfolio-medias/tournage-1.jpg',
            '/assets/portfolio-medias/tournage-2.jpg',
            '/assets/portfolio-medias/tournage-3.jpg',
            '/assets/portfolio-medias/tournage-4.jpg',
          ]}
          videoSrc="https://s3.amazonaws.com/buchwald-portfolios-production/transcoded-video-for-web/59047/59047-web.mp4"
          externalLink="https://portfolio.buchwald.com/portfolios/10708"
          externalLinkLabel="Director's portfolio"
          reverse
        />

        <ClosingStatement />
      </div>
    </main>
  )
}

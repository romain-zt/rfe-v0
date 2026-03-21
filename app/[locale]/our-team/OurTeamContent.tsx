'use client'

import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'

const team = [
  {
    name: 'Elisabeth Röhm',
    role: 'Founder & Creative Director',
    bio: 'Actress, writer, producer. Elisabeth founded RFE to build a space where feminine emotion becomes cinematic power — stories told not through someone else\'s eyes, but through our own. Her work spans film, television, and advocacy for women\'s voices in storytelling.',
    mainImage: '/assets/team/liz-rohm-hero.png',
    secondaryImage: '/assets/team/elisabeth-rohm-1.jpg',
    accentImage: '/assets/team/liz-rohm-4.jpg',
  },
  {
    name: 'Kara',
    role: 'Head of Development',
    bio: 'Kara shapes the creative direction of every project, ensuring each story carries the emotional truth and radical authenticity that defines RFE. She brings an intuitive understanding of narrative tension — the silence between words, the gesture before the break.',
    mainImage: '/assets/team/kara.png',
    secondaryImage: null,
    accentImage: null,
  },
]

function TeamHero() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background — mosaic of team portraits, deeply darkened */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/team/liz-rohm-5.jpg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
          style={{ filter: 'grayscale(0.8) brightness(0.2) contrast(1.1)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 65% 55% at 50% 50%, transparent 0%, rgba(7, 7, 8, 0.5) 50%, rgba(7, 7, 8, 0.95) 100%),
              linear-gradient(to bottom, rgba(7, 7, 8, 0.5) 0%, transparent 30%, transparent 60%, rgba(7, 7, 8, 1) 100%)
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
          our team
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
            the voices behind <span style={{ color: 'var(--rfe-rose)' }}>the gaze.</span>
          </h1>
        </div>

        <p
          className="mt-8 text-sm font-light leading-[2]"
          style={{
            color: 'rgba(245, 240, 235, 0.4)',
            maxWidth: '44ch',
            margin: '2rem auto 0',
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
          }}
        >
          Women who chose to stop waiting for permission. Who built the table instead of asking for a seat.
        </p>
      </div>
    </section>
  )
}

function TeamMemberSection({
  member,
  index,
}: {
  member: typeof team[0]
  index: number
}) {
  const { ref: sectionRef, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const isEven = index % 2 === 0

  return (
    <section
      ref={sectionRef}
      className="relative px-6 lg:px-16 xl:px-24 py-20 lg:py-32"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isEven
            ? `radial-gradient(ellipse 55% 45% at 20% 50%, rgba(181, 151, 90, 0.03) 0%, transparent 60%)`
            : `radial-gradient(ellipse 55% 45% at 80% 50%, rgba(196, 160, 160, 0.03) 0%, transparent 60%)`,
        }}
        aria-hidden="true"
      />

      <div className={`relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? 'lg:[direction:rtl]' : ''}`}>
        {/* Image composition */}
        <div className={!isEven ? 'lg:[direction:ltr]' : ''}>
          <div
            className="relative"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
              transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
            }}
          >
            {/* Main portrait */}
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={member.mainImage}
                alt={member.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{
                  filter: isVisible ? 'grayscale(0.3) brightness(0.85) contrast(1.05)' : 'grayscale(1) brightness(0.5)',
                  transition: 'filter 3s var(--ease-quiet)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `
                    radial-gradient(ellipse 90% 90% at 50% 50%, transparent 30%, rgba(7, 7, 8, 0.5) 100%),
                    linear-gradient(to top, rgba(7, 7, 8, 0.5) 0%, transparent 40%)
                  `,
                }}
                aria-hidden="true"
              />
            </div>

            {/* Secondary image — offset */}
            {member.secondaryImage && (
              <div
                className={`absolute -bottom-6 ${isEven ? '-right-4 lg:-right-10' : '-left-4 lg:-left-10'} w-[40%] aspect-[4/5] overflow-hidden`}
                style={{
                  opacity: isVisible ? 1 : 0,
                  transition: 'opacity 2.5s var(--ease-quiet) 0.4s',
                  boxShadow: '0 0 60px rgba(0,0,0,0.5)',
                }}
              >
                <Image
                  src={member.secondaryImage}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="20vw"
                  style={{ filter: 'grayscale(0.6) brightness(0.8)' }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className={`${!isEven ? 'lg:[direction:ltr]' : ''} lg:py-8`}>
          <p
            className="text-[10px] uppercase mb-6 font-light"
            style={{
              color: 'var(--rfe-gold)',
              letterSpacing: isVisible ? '0.38em' : '0.08em',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 1.5s var(--ease-quiet) 0.2s, letter-spacing 2.2s var(--ease-quiet) 0.2s',
            }}
          >
            {member.role}
          </p>

          <div style={{ overflow: 'hidden', paddingBottom: '5px', marginBottom: '2rem' }}>
            <h2
              className="font-serif font-light"
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.01em',
                color: 'var(--foreground)',
                transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
                transition: 'transform 1.6s var(--ease-emerge) 0.3s',
              }}
            >
              {member.name}
            </h2>
          </div>

          <p
            className="text-sm leading-[2.2] font-light"
            style={{
              color: 'rgba(245, 240, 235, 0.45)',
              letterSpacing: '0.02em',
              maxWidth: '48ch',
              opacity: isVisible ? 1 : 0,
              transition: 'opacity 2.5s var(--ease-quiet) 0.5s',
            }}
          >
            {member.bio}
          </p>

          {/* Accent image — small, intimate detail */}
          {member.accentImage && (
            <div
              className="mt-10 w-32 h-32 relative overflow-hidden rounded-full"
              style={{
                opacity: isVisible ? 0.7 : 0,
                transition: 'opacity 2s var(--ease-quiet) 0.8s',
              }}
            >
              <Image
                src={member.accentImage}
                alt=""
                fill
                className="object-cover"
                sizes="128px"
                style={{ filter: 'grayscale(0.5) brightness(0.8)' }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function ClosingVoice() {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })

  return (
    <section className="relative px-6 py-32 lg:py-44 flex items-center justify-center">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 80%, rgba(139, 26, 26, 0.03) 0%, transparent 55%)`,
        }}
        aria-hidden="true"
      />

      <div ref={ref} className="relative text-center max-w-2xl mx-auto">
        <div style={{ overflow: 'hidden', paddingBottom: '6px' }}>
          <p
            className="font-serif font-light italic"
            style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)',
              color: 'rgba(245, 240, 235, 0.6)',
              lineHeight: 1.4,
              transform: isVisible ? 'translateY(0)' : 'translateY(110%)',
              transition: 'transform 1.5s var(--ease-emerge)',
            }}
          >
            &ldquo;We didn&apos;t ask for permission.
            <br />
            We built the room ourselves.&rdquo;
          </p>
        </div>
      </div>
    </section>
  )
}

export default function OurTeamContent() {
  return (
    <main className="relative">
      <TeamHero />

      {team.map((member, i) => (
        <TeamMemberSection key={member.name} member={member} index={i} />
      ))}

      <ClosingVoice />
    </main>
  )
}

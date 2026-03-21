'use client'

import { useRef, useEffect, useState } from 'react'
import { useLanguage } from './LanguageContext'
import { partnersPrimary, partnersSecondary } from '@/app/[locale]/content'
import { LogoGrid } from './LogoGrid'

export function LogoWall() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36">
      {/* Subtle depth background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 50%, rgba(25, 22, 18, 0.3) 0%, transparent 60%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <h2
          className="font-serif text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-center mb-20 text-foreground/80"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          {t.partners.title}
        </h2>

        {/* PRIMARY */}
        <LogoGrid items={partnersPrimary} isVisible={isVisible} delay={0.4} />

        {/* SECONDARY */}
        <div className="mt-20 lg:mt-24">
          {/* <h3
            className="font-serif text-base md:text-lg lg:text-xl font-light tracking-wide text-center mb-12 text-foreground/60"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.5s, transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.5s',
            }}
          >
            Thanks to our partners and clients
          </h3> */}
          <LogoGrid items={partnersSecondary} subtle isVisible={isVisible} delay={0.6} />
        </div>
      </div>
    </section>
  )
}

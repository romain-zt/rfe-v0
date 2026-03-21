'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { useLanguage, type AwardsNewsItem } from './LanguageContext'

function NewsCard({
  item,
  index,
  isVisible,
}: {
  item: AwardsNewsItem
  index: number
  isVisible: boolean
}) {
  const { lang } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <article
      className="group relative p-8 lg:p-10 border border-foreground/5 hover:border-foreground/15 transition-all duration-1000"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s, transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1) ${index * 0.1}s, border-color 1s ease`,
      }}
    >
      {/* Subtle hover glow */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: isHovered ? 1 : 0,
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.02) 0%, transparent 70%)',
        }}
      />

      <time className="relative text-[10px] text-foreground/30 tracking-[0.2em] uppercase">
        {new Date(item.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>

      <h3 className="relative mt-5 font-serif text-base md:text-lg font-light tracking-wide leading-[1.6] text-foreground/80 group-hover:text-foreground/95 transition-colors duration-700">
        {item.title}
      </h3>

      <p className="relative mt-4 text-[10px] text-foreground/30 uppercase tracking-[0.2em]">
        {item.source}
      </p>

      {/* Decorative corner accent */}
      <div
        className="absolute bottom-0 right-0 w-8 h-8 pointer-events-none transition-opacity duration-700"
        style={{
          opacity: isHovered ? 0.3 : 0.1,
          background: 'linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.1) 50%)',
        }}
      />
    </article>
  )
}

export function AwardsNews() {
  const { t, content } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const items = content.awardsNews.slice(0, 6)

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36">
      {/* Background depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(to bottom, transparent 0%, rgba(15, 12, 10, 0.4) 30%, rgba(15, 12, 10, 0.4) 70%, transparent 100%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-8">
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-20 gap-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 1.5s cubic-bezier(0.25, 0.1, 0.25, 1), transform 1.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        >
          <h2 className="font-serif text-xl md:text-2xl lg:text-3xl font-light tracking-wide text-foreground/80">
            {t.awardsNews.title}
          </h2>
          <Link
            href="/news"
            className="text-[10px] text-foreground/40 hover:text-foreground/70 transition-colors duration-700 tracking-[0.25em] uppercase border-b border-foreground/10 hover:border-foreground/30 pb-1"
          >
            {t.awardsNews.readMore}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {items.map((item, index) => (
            <NewsCard key={item.id} item={item} index={index} isVisible={isVisible} />
          ))}
        </div>
      </div>
    </section>
  )
}

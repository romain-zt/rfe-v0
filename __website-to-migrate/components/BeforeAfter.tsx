'use client'

import Image from 'next/image'
import { useLanguage } from './LanguageContext'
import { MEDIA } from '@/app/(frontend)/[locale]/content'
import { useReveal, useStaggeredReveal } from '@/hooks/useReveal'

function BeforeAfterCard({
  item,
  delay,
}: {
  item: (typeof MEDIA.beforeAfter.en)[0]
  delay: number
}) {
  const { t } = useLanguage()
  const reveal = useReveal({ delay })

  return (
    <div
      ref={reveal.ref}
      className={`space-y-5 reveal-base ${reveal.isVisible ? 'reveal-visible' : ''}`}
    >
      <div className="grid grid-cols-2 gap-3">
        {/* Before (B&W) */}
        <div className="relative aspect-[4/3] overflow-hidden group exhibition-frame">
          <div className="absolute inset-0 bw-media">
            <Image
              src={item.src}
              alt={`${item.title} - ${t.beforeAfter.before}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="absolute bottom-3 left-3 exhibition-caption">
            {t.beforeAfter.before}
          </div>
        </div>

        {/* After (Color) */}
        <div className="relative aspect-[4/3] overflow-hidden group exhibition-frame">
          <div 
            className={`absolute inset-0 transition-all duration-[1.5s] ${reveal.isVisible ? '' : 'bw-media'}`}
            style={{
              filter: reveal.isVisible ? 'grayscale(0) brightness(1) saturate(1.05)' : 'grayscale(1) brightness(0.9)',
            }}
          >
            <Image
              src={item.src}
              alt={`${item.title} - ${t.beforeAfter.after}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          {/* Warm glow on reveal */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-[2s]"
            style={{
              opacity: reveal.isVisible ? 0.1 : 0,
              background: 'radial-gradient(ellipse at center, rgba(180, 140, 90, 0.35) 0%, transparent 70%)',
            }}
          />
          <div className="absolute bottom-3 left-3 exhibition-caption">
            {t.beforeAfter.after}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="font-serif text-sm md:text-base font-light tracking-wide">{item.title}</h3>
        <p className="text-[11px] text-muted-foreground/50 mt-1 tracking-[0.15em]">{item.year}</p>
      </div>
    </div>
  )
}

export function BeforeAfter() {
  const { t, lang } = useLanguage()
  const titleReveal = useReveal({ threshold: 0.2 })
  
  // Get localized items
  const items = MEDIA.beforeAfter[lang]
  const staggerDelays = useStaggeredReveal(items.length, 100, 150)

  return (
    <section className="py-28 sm:py-32 lg:py-24 section-tone-c section-fade-bottom">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2
          ref={titleReveal.ref}
          className={`font-serif text-2xl lg:text-3xl font-light tracking-wide text-center mb-16 sm:mb-20 reveal-base ${titleReveal.isVisible ? 'reveal-visible' : ''}`}
        >
          {t.beforeAfter.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 lg:gap-16">
          {items.map((item, index) => (
            <BeforeAfterCard key={item.id} item={item} delay={staggerDelays[index]} />
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'
import { useEffect, useState } from 'react'

type PressItem = {
  id: number
  title: string
  source: string
  date: string
  url: string
  description?: string
}

type Props = {
  title?: string
  limit?: number
  showViewAll?: boolean
  viewAllUrl?: string
  sectionTone?: string
}

function PressCard({ item, index }: { item: PressItem; index: number }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })

  return (
    <div ref={ref} style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(20px)', transition: `opacity 2s var(--ease-quiet) ${index * 120}ms, transform 2s var(--ease-quiet) ${index * 120}ms` }}>
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="group block py-10 border-t" style={{ borderColor: 'rgba(245, 240, 235, 0.05)' }}>
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-10">
          <div className="shrink-0 sm:w-36 lg:w-44">
            <span className="text-[10px] tracking-[0.25em] uppercase font-light block" style={{ color: 'var(--rfe-gold)' }}>{item.source}</span>
            <span className="text-[10px] tracking-[0.12em] mt-1.5 font-light block" style={{ color: 'rgba(245, 240, 235, 0.25)' }}>{item.date}</span>
          </div>
          <div className="flex-1">
            <h3 className="font-serif font-light text-base md:text-lg leading-snug mb-3 transition-colors duration-700 group-hover:text-[rgba(245,240,235,0.95)]" style={{ color: 'rgba(245, 240, 235, 0.7)' }}>
              {item.title} <span style={{ color: 'var(--rfe-gold-dim)' }}>↗</span>
            </h3>
            {item.description && (
              <p className="text-sm leading-[2] font-light" style={{ color: 'rgba(245, 240, 235, 0.35)', maxWidth: '62ch' }}>{item.description}</p>
            )}
          </div>
        </div>
      </a>
    </div>
  )
}

export function PressListComponent({ title, limit = 100, showViewAll, viewAllUrl, sectionTone }: Props) {
  const { ref: headerRef, isVisible: headerVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })
  const { lang } = useLanguage()
  const [items, setItems] = useState<PressItem[]>([])
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''

  useEffect(() => {
    fetch(`/api/press-items?sort=-date&limit=${limit}&depth=0`)
      .then(r => r.json())
      .then(data => setItems(data.docs || []))
      .catch(() => {})
  }, [limit])

  return (
    <section className={`relative px-6 lg:px-16 xl:px-24 py-20 lg:py-32 ${toneClass}`}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 55% 40% at 15% 30%, rgba(181, 151, 90, 0.04) 0%, transparent 55%)' }} aria-hidden="true" />
      <div className="relative max-w-4xl mx-auto" style={{ zIndex: 2 }}>
        <div ref={headerRef} className="mb-4 flex items-end justify-between" style={{ opacity: headerVisible ? 1 : 0, transition: 'opacity 1.5s var(--ease-quiet)' }}>
          <p className="text-[10px] uppercase font-light" style={{ color: 'var(--rfe-gold-dim)', letterSpacing: headerVisible ? '0.42em' : '0.08em', transition: 'letter-spacing 2.2s var(--ease-quiet)' }}>
            {title || 'Coverage'}
          </p>
          {showViewAll && viewAllUrl && (
            <Link href={`/${lang}${viewAllUrl}`} className="text-[10px] tracking-[0.25em] uppercase pb-0.5 border-b hidden sm:inline-block" style={{ color: 'var(--rfe-gold-dim)', borderColor: 'rgba(181, 151, 90, 0.15)' }}>
              all press ↗
            </Link>
          )}
        </div>

        <div className="mt-2">
          {items.map((item, i) => (
            <PressCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

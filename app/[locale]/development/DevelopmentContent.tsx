'use client'

import { PageCinematicHero } from '@/components/PageCinematicHero'
import { useReveal } from '@/hooks/useReveal'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { useState } from 'react'
import { getWorkSlug } from '@/lib/works'
import type { WorkItem } from '@/lib/i18n/types'

// ============================================
// CATEGORY TABS
// ============================================

type Category = 'films' | 'series' | 'unscripted'

const categoryLabels: Record<Category, string> = {
  films: 'Films',
  series: 'Series',
  unscripted: 'Unscripted',
}

// Ordered group definitions per category.
// subcategory: null = items with no subcategory (rendered first, no separator heading)
// subcategory: string = items matching that subcategory value, preceded by a separator
type GroupDef = { subcategory: string | null; label?: string }

const SECTION_ORDER: Record<Category, GroupDef[]> = {
  films: [
    { subcategory: null },
    { subcategory: 'true-crime-movies', label: 'True Crime Movies' },
    { subcategory: 'dramas-feature', label: 'Dramas' },
  ],
  series: [
    { subcategory: null },
    { subcategory: 'true-crime-series', label: 'True Crime Stories' },
    { subcategory: 'dramas-feature', label: 'Dramas' },
    { subcategory: 'dramas-series', label: 'Dramas Series' },
  ],
  unscripted: [
    { subcategory: 'comedy-features', label: 'Unscripted' },
  ],
}

function categorizeWorks(works: WorkItem[]): Record<Category, WorkItem[]> {
  return {
    films: works.filter((w) => w.category === 'film'),
    series: works.filter((w) => w.category === 'series'),
    unscripted: works.filter((w) => w.category === 'unscripted'),
  }
}

// ============================================
// SECTION SEPARATOR
// ============================================

function SectionSeparator({ label }: { label: string }) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  return (
    <div
      ref={ref}
      className="col-span-full pt-14 pb-4 border-t"
      style={{ borderColor: 'rgba(245, 240, 235, 0.06)' }}
    >
      <span
        className="text-[9px] uppercase font-light"
        style={{
          color: 'var(--rfe-gold-dim)',
          letterSpacing: isVisible ? '0.42em' : '0.08em',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 1.5s var(--ease-quiet), letter-spacing 2.2s var(--ease-quiet)',
        }}
      >
        {label}
      </span>
    </div>
  )
}

// ============================================
// PROJECT CARD
// ============================================

function ProjectCard({ work, index }: { work: WorkItem; index: number }) {
  const { lang, t } = useLanguage()
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const slug = getWorkSlug(work)

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 1.8s var(--ease-quiet) ${(index % 6) * 80}ms, transform 1.8s var(--ease-quiet) ${(index % 6) * 80}ms`,
      }}
    >
      <Link
        href={`/${lang}/our-work/${slug}`}
        className="group block outline-none focus-visible:ring-2 focus-visible:ring-foreground/30"
        aria-label={`${work.title} — ${t.work.view}`}
      >
        <div className="relative overflow-hidden aspect-[2/3] mb-4">
          <Image
            src={work.src}
            alt={work.title}
            fill
            className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{
              filter: isVisible
                ? 'grayscale(0.25) brightness(0.88)'
                : 'grayscale(1) brightness(0.5)',
              transition: 'filter 2s var(--ease-quiet)',
            }}
          />
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(7, 7, 8, 0.6) 0%, transparent 50%)',
            }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-background/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <span className="text-[9px] tracking-[0.2em] uppercase border border-foreground/25 px-4 py-2" style={{ color: 'rgba(245,240,235,0.75)' }}>
              {t.work.view}
            </span>
          </div>
        </div>

        <h3
          className="font-serif font-light text-sm md:text-base tracking-wide transition-colors duration-500 group-hover:text-[var(--rfe-rose)]"
          style={{ color: 'rgba(245, 240, 235, 0.7)' }}
        >
          {work.title}
        </h3>
        <p className="text-[10px] tracking-[0.18em] mt-1.5 font-light" style={{ color: 'rgba(245, 240, 235, 0.25)' }}>
          {work.year}
        </p>
      </Link>
    </div>
  )
}

// ============================================
// GROUPED CATEGORY SECTION
// ============================================

function CategorySection({ works, category }: { works: WorkItem[]; category: Category }) {
  const groups = SECTION_ORDER[category]

  // Build ordered list of (groupDef, items[]) pairs, skipping empty groups
  const renderedGroups = groups
    .map((group) => ({
      group,
      items: group.subcategory === null
        ? works.filter((w) => !w.subcategory)
        : works.filter((w) => w.subcategory === group.subcategory),
    }))
    .filter(({ items }) => items.length > 0)

  if (renderedGroups.length === 0) {
    return (
      <div className="py-16 text-center border-t" style={{ borderColor: 'rgba(245, 240, 235, 0.04)' }}>
        <p className="text-[9px] uppercase tracking-[0.3em] font-light" style={{ color: 'rgba(245, 240, 235, 0.15)' }}>
          Coming soon
        </p>
      </div>
    )
  }

  let globalIndex = 0

  return (
    <div className="space-y-0">
      {renderedGroups.map(({ group, items }) => (
        <div key={group.subcategory ?? '__root'}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {group.label && <SectionSeparator label={group.label} />}
            {items.map((work) => {
              const idx = globalIndex++
              return <ProjectCard key={`${work.id}-${work.subcategory}`} work={work} index={idx} />
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ============================================
// DEVELOPMENT CONTENT
// ============================================

export default function DevelopmentContent() {
  const { content } = useLanguage()
  const [activeCategory, setActiveCategory] = useState<Category>('films')
  const { ref: introRef, isVisible: introVisible } = useReveal<HTMLDivElement>({ threshold: 0.2 })

  const allWorks = content?.ourWork ?? []
  const categorized = categorizeWorks(allWorks)

  return (
    <main className="relative">
      <PageCinematicHero
        imageSrc="/assets/works/wife-stalker.png"
        imagePosition="center 25%"
        label="development"
      >
        Films. Series.{' '}
        <span style={{ color: 'var(--rfe-rose)' }}>Unscripted.</span>
      </PageCinematicHero>

      <div className="relative" style={{ backgroundColor: 'var(--background)' }}>
        <section className="relative px-6 lg:px-16 xl:px-24 py-20 lg:py-28 section-tone-charcoal section-bleed-top">
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: `
                radial-gradient(ellipse 55% 40% at 15% 30%, rgba(181, 151, 90, 0.04) 0%, transparent 55%),
                radial-gradient(ellipse 40% 40% at 85% 75%, rgba(196, 160, 160, 0.025) 0%, transparent 55%)
              `,
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-7xl mx-auto">
            {/* Intro */}
            <div
              ref={introRef}
              className="max-w-3xl mb-16 lg:mb-20"
              style={{
                opacity: introVisible ? 1 : 0,
                transition: 'opacity 1.8s var(--ease-quiet)',
              }}
            >
              <p
                className="text-sm leading-[2.1] font-light"
                style={{ color: 'rgba(245, 240, 235, 0.48)', letterSpacing: '0.02em' }}
              >
                Rohm Feifer Entertainment has a robust slate across feature films, scripted series,
                and unscripted programming — all rooted in true crime, true stories, and empowering
                narratives for audiences worldwide.
              </p>
            </div>

            {/* Category tabs */}
            <div
              className="sticky max-w-[50dvw] mx-auto top-0 z-50 -mx-6 px-6 lg:-mx-16 lg:px-16 xl:-mx-24 xl:px-24 py-3 mb-16"
              style={{
                backgroundColor: 'var(--tone-charcoal)',
                borderColor: 'rgba(245, 240, 235, 0.06)',
              }}
            >
              <div className="flex justify-center gap-6 sm:gap-10">
                {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className="pb-4 text-[11px] tracking-[0.18em] uppercase transition-all duration-500"
                    style={{
                      color: activeCategory === cat ? 'var(--rfe-gold)' : 'rgba(245, 240, 235, 0.3)',
                      borderBottom: activeCategory === cat ? '1px solid var(--rfe-gold)' : '1px solid transparent',
                      marginBottom: '-1px',
                    }}
                  >
                    {categoryLabels[cat]}
                    <span
                      className="ml-2 text-[9px]"
                      style={{ color: activeCategory === cat ? 'rgba(181, 151, 90, 0.5)' : 'rgba(245, 240, 235, 0.15)' }}
                    >
                      {categorized[cat].length > 0 ? `(${categorized[cat].length})` : ''}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active category content */}
            <CategorySection
              key={activeCategory}
              works={categorized[activeCategory]}
              category={activeCategory}
            />
          </div>
        </section>
      </div>
    </main>
  )
}

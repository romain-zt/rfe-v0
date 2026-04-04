'use client'

import { WorkGrid } from '@/components/WorkGrid'
import { useReveal } from '@/hooks/useReveal'

type Props = {
  title?: string
  category?: string
  showFilters?: boolean
  showSubcategoryTabs?: boolean
  limit?: number
  sectionTone?: string
}

export function WorksGridComponent({ title, sectionTone }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''

  return (
    <section className={`relative px-6 lg:px-16 xl:px-24 py-12 lg:py-20 ${toneClass}`}>
      {title && (
        <div
          ref={ref}
          className="mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet)',
          }}
        >
          <h2 className="font-serif font-light text-2xl" style={{ color: 'var(--foreground)' }}>
            {title}
          </h2>
        </div>
      )}
      <WorkGrid />
    </section>
  )
}

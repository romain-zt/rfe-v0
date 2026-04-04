'use client'

import { useMemo } from 'react'
import { WorkGrid } from '@/components/WorkGrid'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'

type Props = {
  title?: string
  category?: string
  showFilters?: boolean
  showSubcategoryTabs?: boolean
  limit?: number
  sectionTone?: string
}

export function WorksGridComponent(props: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const { content } = useLanguage()
  const toneClass = props.sectionTone && props.sectionTone !== 'default' ? `section-tone-${props.sectionTone}` : ''

  const allWorks = content?.ourWork || []

  const { works, filterMode, showFilters } = useMemo(() => {
    if (props.showSubcategoryTabs) {
      let devWorks = allWorks.filter(w => w.category)
      if (props.category) {
        devWorks = devWorks.filter(w => w.category === props.category)
      }
      return {
        works: props.limit ? devWorks.slice(0, props.limit) : devWorks,
        filterMode: 'category' as const,
        showFilters: true,
      }
    }

    const ourWorks = allWorks.filter(w => !w.category)
    return {
      works: props.limit ? ourWorks.slice(0, props.limit) : ourWorks,
      filterMode: 'tags' as const,
      showFilters: props.showFilters !== false,
    }
  }, [allWorks, props.showSubcategoryTabs, props.category, props.showFilters, props.limit])

  return (
    <section className={`relative px-6 lg:px-16 xl:px-24 py-12 lg:py-20 ${toneClass}`}>
      {props.title && (
        <div
          ref={ref}
          className="mb-8"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 1.5s var(--ease-quiet)',
          }}
        >
          <h2 className="font-serif font-light text-2xl" style={{ color: 'var(--foreground)' }}>
            {props.title}
          </h2>
        </div>
      )}
      <WorkGrid works={works} filterMode={filterMode} showFilters={showFilters} />
    </section>
  )
}

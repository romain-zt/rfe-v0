'use client'

import { useMemo } from 'react'
import { WorkGrid } from '@/components/WorkGrid'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'

type RelationRef = number | { id: number; [key: string]: unknown }

type WorksGroupRef = {
  items?: RelationRef[]
} | number | null

type Props = {
  title?: string
  sourceType?: 'all' | 'pick' | 'group'
  selectedWorks?: RelationRef[] | null
  worksGroup?: WorksGroupRef
  category?: string
  showFilters?: boolean
  showSubcategoryTabs?: boolean
  limit?: number
  sectionTone?: string
}

function extractIds(refs: RelationRef[] | WorksGroupRef | null | undefined): number[] | null {
  if (!refs) return null
  if (typeof refs === 'number') return null
  if (Array.isArray(refs)) {
    const ids = refs.map((r) => (typeof r === 'number' ? r : r.id))
    return ids.length > 0 ? ids : null
  }
  if ('items' in refs && Array.isArray(refs.items)) {
    const ids = refs.items.map((r) => (typeof r === 'number' ? r : r.id))
    return ids.length > 0 ? ids : null
  }
  return null
}

export function WorksGridComponent(props: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.1 })
  const { content } = useLanguage()
  const toneClass = props.sectionTone && props.sectionTone !== 'default' ? `section-tone-${props.sectionTone}` : ''

  const allWorks = content?.ourWork || []

  const curatedIds = useMemo(() => {
    if (props.sourceType === 'pick') return extractIds(props.selectedWorks)
    if (props.sourceType === 'group') return extractIds(props.worksGroup)
    return extractIds(props.selectedWorks) ?? extractIds(props.worksGroup)
  }, [props.sourceType, props.selectedWorks, props.worksGroup])

  const { works, filterMode, showFilters } = useMemo(() => {
    if (curatedIds) {
      const worksById = new Map(allWorks.map((w) => [w.id, w]))
      const ordered = curatedIds.map((id) => worksById.get(id)).filter(Boolean) as typeof allWorks
      return { works: ordered, filterMode: 'tags' as const, showFilters: false }
    }

    if (props.category) {
      const filtered = allWorks.filter(w => w.category === props.category)
      return {
        works: props.limit ? filtered.slice(0, props.limit) : filtered,
        filterMode: props.showSubcategoryTabs ? 'category' as const : 'tags' as const,
        showFilters: props.showSubcategoryTabs || (props.showFilters ?? false),
      }
    }

    if (props.showSubcategoryTabs) {
      const devWorks = allWorks.filter(w => w.category)
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
  }, [allWorks, curatedIds, props.showSubcategoryTabs, props.category, props.showFilters, props.limit])

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

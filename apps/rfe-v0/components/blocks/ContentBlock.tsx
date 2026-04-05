'use client'

import React from 'react'
import { useReveal } from '@/hooks/useReveal'
import { CTABlockComponent } from './CTABlock'
import { WorksGridComponent } from './WorksGridBlock'
import { WorksScrollComponent } from './WorksScrollBlock'
import { FeaturedWorkComponent } from './FeaturedWorkBlock'
import { TeamShowcaseComponent } from './TeamShowcaseBlock'
import { PressListComponent } from './PressListBlock'
import { ContactInfoComponent } from './ContactInfoBlock'
import { ContactFormComponent } from './ContactFormBlock'
import { EmbeddedFormBlock } from './EmbeddedFormBlock'
import { LegalSectionsComponent } from './LegalSectionsBlock'
import { MediaBlockComponent } from './MediaBlockComponent'
import { TwoColumnLayoutComponent } from './TwoColumnLayoutBlock'

const embeddedBlockComponents: Record<string, React.ComponentType<any>> = {
  cta: CTABlockComponent,
  worksGrid: WorksGridComponent,
  worksScroll: WorksScrollComponent,
  featuredWork: FeaturedWorkComponent,
  teamShowcase: TeamShowcaseComponent,
  pressList: PressListComponent,
  contactInfo: ContactInfoComponent,
  contactForm: ContactFormComponent,
  embeddedForm: EmbeddedFormBlock,
  legalSections: LegalSectionsComponent,
  mediaBlock: MediaBlockComponent,
  twoColumnLayout: TwoColumnLayoutComponent,
}

type Column = {
  size: 'full' | 'half' | 'oneThird' | 'twoThirds'
  richText: { root: { children: any[] } }
}

type Props = {
  columns?: Column[]
  sectionTone?: string
}

function renderLexicalNode(node: any): React.ReactNode {
  if (!node) return null

  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong key="b">{text}</strong>
    if (node.format & 2) text = <em key="i">{text}</em>
    return text
  }

  if (node.type === 'block') {
    const fields = node.fields
    if (!fields?.blockType) return null
    const BlockComp = embeddedBlockComponents[fields.blockType]
    if (!BlockComp) return null
    return <BlockComp key={fields.id} {...fields} />
  }

  const children = node.children?.map((child: any, i: number) => {
    const rendered = renderLexicalNode(child)
    if (child.type === 'text' || child.type === 'linebreak') return <React.Fragment key={i}>{rendered}</React.Fragment>
    return <React.Fragment key={i}>{rendered}</React.Fragment>
  })

  switch (node.type) {
    case 'paragraph':
      return <p className="text-sm leading-[2.1] font-light mb-6" style={{ color: 'rgba(245, 240, 235, 0.55)', letterSpacing: '0.02em' }}>{children}</p>
    case 'heading': {
      const tag = node.tag || 'h2'
      if (tag === 'h1') return <h1 className="font-serif font-light text-balance mb-6" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', lineHeight: 1.2, color: 'var(--foreground)' }}>{children}</h1>
      if (tag === 'h3') return <h3 className="font-serif font-light text-balance mb-4" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.5rem)', lineHeight: 1.3, color: 'var(--foreground)' }}>{children}</h3>
      return <h2 className="font-serif font-light text-balance mb-6" style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', lineHeight: 1.25, color: 'var(--foreground)' }}>{children}</h2>
    }
    case 'list':
      return node.listType === 'number'
        ? <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
        : <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
    case 'listitem':
      return <li className="text-sm leading-[2] font-light" style={{ color: 'rgba(245, 240, 235, 0.55)' }}>{children}</li>
    case 'link':
      return <a href={node.fields?.url || '#'} className="underline hover:text-[var(--rfe-rose)] transition-colors">{children}</a>
    case 'root':
      return <>{children}</>
    default:
      return <>{children}</>
  }
}

const sizeClasses: Record<string, string> = {
  full: 'col-span-1',
  half: 'col-span-1 lg:col-span-1',
  oneThird: 'col-span-1 lg:col-span-1',
  twoThirds: 'col-span-1 lg:col-span-2',
}

export function ContentBlockComponent({ columns, sectionTone }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''

  const gridCols = columns && columns.length > 1 ? 'lg:grid-cols-2' : ''

  const hasEmbeddedBlocks = columns?.some((col) =>
    col.richText?.root?.children?.some((child: any) => child.type === 'block')
  )

  if (hasEmbeddedBlocks) {
    return (
      <div className={toneClass}>
        {columns?.map((col, i) => (
          <div key={i}>
            {col.richText?.root?.children?.map((child: any, j: number) => (
              <React.Fragment key={j}>{renderLexicalNode(child)}</React.Fragment>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <section data-ai-element="content" className={`relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24 ${toneClass}`}>
      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto grid grid-cols-1 ${gridCols} gap-8`}
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
        }}
      >
        {columns?.map((col, i) => (
          <div key={i} className={sizeClasses[col.size] || 'col-span-1'}>
            {col.richText?.root && renderLexicalNode(col.richText.root)}
          </div>
        ))}
      </div>
    </section>
  )
}

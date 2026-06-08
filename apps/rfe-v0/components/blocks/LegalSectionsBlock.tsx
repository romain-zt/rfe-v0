'use client'

type LegalSection = {
  title: string
  content?: { root: { children: any[] } }
}

type Props = {
  sections?: LegalSection[]
}

function extractText(node: any): string {
  if (!node) return ''
  if (node.type === 'text') return node.text || ''
  if (node.children) return node.children.map(extractText).join('')
  return ''
}

export function LegalSectionsComponent({ sections }: Props) {
  if (!sections || sections.length === 0) return null

  return (
    <div data-ai-element="legal-sections" className="mx-auto max-w-3xl px-6 lg:px-8 py-8">
      <div className="space-y-10 sm:space-y-12 text-sm sm:text-base leading-relaxed text-foreground/90">
        {sections.map((section, i) => (
          <section key={i} data-ai-element="legal-section" data-ai-section-index={i} className="space-y-4">
            <h2 data-ai-field={`legalSections.sections.${i}.title`} className="text-xs sm:text-sm tracking-[0.2em] uppercase text-foreground/60">
              {section.title}
            </h2>
            {section.content?.root?.children?.map((node: any, j: number) => {
              const text = extractText(node)
              if (!text) return null
              return <p key={j}>{text}</p>
            })}
          </section>
        ))}
      </div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useReveal } from '@/hooks/useReveal'

type CTALink = {
  label: string
  url: string
  isExternal?: boolean
  appearance?: 'default' | 'outline' | 'gold'
}

type Props = {
  richText?: { root: { children: any[] } }
  links?: CTALink[]
  sectionTone?: string
}

export function CTABlockComponent({ richText, links, sectionTone }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.3 })
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''

  return (
    <section className={`relative px-6 py-20 lg:py-32 flex flex-col items-center justify-center text-center ${toneClass}`}>
      <div
        ref={ref}
        className="relative max-w-lg mx-auto"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'opacity 2s var(--ease-quiet), transform 2s var(--ease-quiet)',
        }}
      >
        {richText?.root?.children?.map((node: any, i: number) => {
          if (node.type === 'paragraph') {
            const text = node.children?.map((c: any) => c.text).join('') || ''
            return (
              <p key={i} className="font-serif font-light mb-6" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: 'rgba(245, 240, 235, 0.55)', lineHeight: 1.55 }}>
                {text}
              </p>
            )
          }
          return null
        })}

        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {links.map((link, i) => {
              const baseClasses = 'inline-block text-sm tracking-[0.15em] uppercase pb-1 border-b transition-all duration-500'
              const colorStyle = link.appearance === 'gold'
                ? { color: 'var(--rfe-gold)', borderColor: 'rgba(181, 151, 90, 0.3)' }
                : { color: 'var(--rfe-rose)', borderColor: 'rgba(196, 160, 160, 0.18)' }

              if (link.isExternal) {
                return (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={baseClasses} style={colorStyle}>
                    {link.label} ↗
                  </a>
                )
              }

              return (
                <Link key={i} href={link.url} className={baseClasses} style={colorStyle}>
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

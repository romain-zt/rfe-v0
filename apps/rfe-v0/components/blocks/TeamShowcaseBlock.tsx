'use client'

import React from 'react'
import Image from 'next/image'
import { useReveal } from '@/hooks/useReveal'
import { useLanguage } from '@/components/LanguageContext'
import { renderLexicalNode } from '@/components/blocks/ContentBlock'

type Props = {
  title?: string
  introText?: { root: { children: any[] } }
  showBios?: boolean
  showPhotos?: boolean
  sectionTone?: string
}

export function TeamShowcaseComponent({ title, introText, showBios = true, showPhotos = true, sectionTone }: Props) {
  const { ref, isVisible } = useReveal<HTMLDivElement>({ threshold: 0.15 })
  const { content } = useLanguage()
  const toneClass = sectionTone && sectionTone !== 'default' ? `section-tone-${sectionTone}` : ''

  const teamMembers = content?.teamMembers || []

  return (
    <section data-ai-element="team-showcase" className={`relative px-6 lg:px-16 xl:px-24 py-16 lg:py-24 ${toneClass}`}>
      <div ref={ref} className="relative max-w-4xl mx-auto" style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 2s var(--ease-quiet)' }}>
        {title && (
          <p data-ai-field="teamShowcase.title" className="text-[10px] uppercase mb-6 font-light" style={{ color: 'var(--rfe-gold)', letterSpacing: '0.38em' }}>
            {title}
          </p>
        )}

        {introText?.root && (
          <div className="mb-10">
            {renderLexicalNode(introText.root)}
          </div>
        )}

        <div className="space-y-12">
          {teamMembers.map((member: any) => (
            <div key={member.id || member.name} data-ai-element="team-member" data-ai-member-id={member.id} className="border-t pt-8" style={{ borderColor: 'rgba(245, 240, 235, 0.05)' }}>
              <div className={showPhotos && member.photo ? 'flex gap-6 items-start' : undefined}>
                {showPhotos && member.photo && (
                  <div className="relative shrink-0 overflow-hidden rounded-sm" style={{ width: 72, height: 72 }}>
                    <Image src={member.photo} alt={member.name} fill className="object-cover grayscale" sizes="72px" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 data-ai-field="teamMember.name" className="font-serif font-light text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    {member.name}
                  </h3>
                  <p data-ai-field="teamMember.role" className="text-[10px] tracking-[0.2em] uppercase mb-4" style={{ color: 'var(--rfe-gold-dim)' }}>
                    {member.role}
                  </p>
                  {showBios && member.bio && (
                    <p className="text-sm leading-[2] font-light" style={{ color: 'rgba(245, 240, 235, 0.45)', maxWidth: '60ch' }}>
                      {member.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export default function LegalContent() {
  const { t, lang } = useLanguage()
  const { title, subtitle, sections } = t.legalPage as {
    title: string
    subtitle: string
    sections: { title: string; paragraphs: string[] }[]
  }

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="text-center mb-14 sm:mb-16">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide mb-4">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <div className="space-y-10 sm:space-y-12 text-sm sm:text-base leading-relaxed text-foreground/90">
          {sections.map((section) => (
            <section key={section.title} className="space-y-4">
              <h2 className="text-xs sm:text-sm tracking-[0.2em] uppercase text-foreground/60">{section.title}</h2>
              {section.paragraphs.map((p, i) => (
                <p key={`${section.title}-${i}`}>{p}</p>
              ))}
            </section>
          ))}
        </div>

        <p className="mt-16 text-center">
          <Link
            href={`/${lang}/contact`}
            className="text-xs tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
          >
            {t.contactPage.title}
          </Link>
        </p>
      </div>
    </main>
  )
}

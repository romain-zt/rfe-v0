'use client'

import { useState } from 'react'
import { useLanguage, type AwardsNewsItem } from '@/components/LanguageContext'
import { Modal } from '@rfe/ui'

export default function NewsContent() {
  const { lang, t, content } = useLanguage()
  const [selectedItem, setSelectedItem] = useState<AwardsNewsItem | null>(null)

  return (
    <main className="pt-32 pb-24 min-h-screen">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-light tracking-wide mb-4">
            {t.news.title}
          </h1>
          <p className="text-muted-foreground">{t.news.subtitle}</p>
        </div>

        {/* News List */}
        <div className="space-y-8">
          {content.awardsNews.map((item) => (
            <article
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer p-6 border border-border/50 hover:border-border transition-colors duration-500"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <time className="text-xs text-muted-foreground tracking-wide">
                    {new Date(item.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <h2 className="mt-2 text-lg font-light tracking-wide leading-relaxed group-hover:text-muted-foreground transition-colors">
                    {item.title}
                  </h2>
                  <p className="mt-2 text-xs text-muted-foreground uppercase tracking-wider">
                    {item.source}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {t.awardsNews.readMore} →
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={!!selectedItem}
          onClose={() => setSelectedItem(null)}
          title={selectedItem?.title}
        >
          {selectedItem && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time>
                  {new Date(selectedItem.date).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span>·</span>
                <span className="uppercase tracking-wider text-xs">{selectedItem.source}</span>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {selectedItem.content}
              </p>
            </div>
          )}
        </Modal>
      </div>
    </main>
  )
}

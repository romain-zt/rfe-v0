'use client'

import { useLanguage } from '@/components/LanguageContext'

export function BottomLogoReveal() {
  const { content } = useLanguage()
  const logoUrl = content.brandLogoUrl || '/assets/logos/logo-rfe-blackgold-nobg.png'

  return (
    <div
      className="fixed inset-0 z-0 flex flex-col items-center justify-center gap-6 md:gap-8 pointer-events-none"
      style={{ background: 'var(--background)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoUrl}
        alt=""
        className="w-auto max-w-[260px] md:max-w-[400px]"
        style={{ opacity: 0.5 }}
      />
    </div>
  )
}

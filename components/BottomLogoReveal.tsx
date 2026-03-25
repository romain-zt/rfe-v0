'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export function BottomLogoReveal() {
  const { lang, t } = useLanguage()

  return (
    <div
      className="fixed inset-0 z-0 flex flex-col items-center justify-center gap-6 md:gap-8 pointer-events-none"
      style={{ background: 'var(--background)' }}
    >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/logos/logo-rfe-blackgold-nobg.png"
          alt=""
          className="w-auto max-w-[260px] md:max-w-[400px]"
          style={{ opacity: 0.5 }}
        />
    </div>
  )
}

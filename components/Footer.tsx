'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'

export function Footer() {
  const { lang, t } = useLanguage()

  return (
    <footer className="relative px-6 py-24 lg:py-32 flex flex-col items-center justify-center text-center">
      {/* Logo — barely there */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logos/logo-rfe.png"
        alt="RFE"
        className="h-6 w-auto object-contain mb-8"
        style={{ opacity: 0.12 }}
      />

      <a
        href="mailto:elisabeth@rohmfeiferentertainment.com"
        className="text-xs tracking-[0.1em] transition-colors duration-700"
        style={{ color: 'rgba(245, 240, 235, 0.3)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-rose)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 235, 0.3)')}
      >
        elisabeth@rohmfeiferentertainment.com
      </a>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <Link
          href={`/${lang}/legal`}
          className="text-[9px] sm:text-[10px] tracking-[0.15em] min-h-[44px] min-w-[44px] inline-flex items-center justify-center transition-colors duration-700"
          style={{ color: 'rgba(245, 240, 235, 0.2)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-rose)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 235, 0.2)')}
        >
          {t.footer.legal}
        </Link>
        <p className="text-[9px] tracking-[0.15em]" style={{ color: 'rgba(245, 240, 235, 0.08)' }}>
          © {new Date().getFullYear()} RFE
        </p>
      </div>
    </footer>
  )
}

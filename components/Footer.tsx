'use client'

import Link from 'next/link'
import { useLanguage } from './LanguageContext'

export function Footer() {
  const { lang } = useLanguage()

  return (
    <footer
      className="relative border-t px-6 lg:px-10 py-14"
      style={{ borderColor: 'rgba(245, 240, 235, 0.06)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/logo-rfe.png"
              alt="RFE"
              className="h-7 w-auto object-contain"
              style={{ opacity: 0.5 }}
            />
            <p
              className="text-[10px] font-light italic"
              style={{ color: 'rgba(245, 240, 235, 0.2)', letterSpacing: '0.05em' }}
            >
              a cinematic female gaze studio
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Footer navigation">
            {[
              { href: `/${lang}/about`, label: 'about' },
              { href: `/${lang}/our-team`, label: 'our team' },
              { href: `/${lang}/our-work`, label: 'our work' },
              { href: `/${lang}/contact`, label: 'contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 hover:text-[var(--rfe-rose)]"
                style={{ color: 'rgba(245, 240, 235, 0.25)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Contact */}
          <a
            href="mailto:contact@rfe.studio"
            className="text-[10px] tracking-[0.2em] uppercase transition-colors duration-500"
            style={{ color: 'rgba(245, 240, 235, 0.25)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-rose)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 235, 0.25)')}
          >
            contact@rfe.studio
          </a>
        </div>

        {/* Bottom line */}
        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: 'rgba(245, 240, 235, 0.04)' }}
        >
          <p
            className="text-[10px] tracking-[0.15em]"
            style={{ color: 'rgba(245, 240, 235, 0.15)' }}
          >
            © {new Date().getFullYear()} RFE. All rights reserved.
          </p>
          <a
            href="https://www.imdb.com/name/nm0738400/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-500"
            style={{ color: 'rgba(245, 240, 235, 0.15)' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-gold-dim)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 235, 0.15)')}
          >
            IMDb ↗
          </a>
        </div>
      </div>
    </footer>
  )
}

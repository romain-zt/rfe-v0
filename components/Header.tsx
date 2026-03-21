'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navItems = [
    { href: `/${lang}`, label: 'home' },
    { href: `/${lang}/about`, label: 'about' },
    { href: `/${lang}/our-team`, label: 'our team' },
    { href: `/${lang}/our-work`, label: 'our work' },
    { href: `/${lang}/contact`, label: 'contact' },
  ]

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          isScrolled ? 'bg-background/40 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="px-6 lg:px-10 h-16 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="group outline-none"
            aria-label="RFE — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logos/logo-rfe-blackgold.png"
              alt="RFE"
              className="h-9 w-auto object-contain transition-opacity duration-500 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-500 hover:text-[var(--rfe-rose)]"
                style={{ color: 'rgba(245, 240, 235, 0.45)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
          >
            <span
              className="block w-5 h-px bg-current transition-all duration-500"
              style={{
                color: 'var(--rfe-rose)',
                transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-px bg-current transition-all duration-500"
              style={{
                color: 'var(--rfe-rose)',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-px bg-current transition-all duration-500"
              style={{
                color: 'var(--rfe-rose)',
                transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none',
              }}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 md:hidden ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(7, 7, 8, 0.97)' }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-10" aria-label="Mobile navigation">
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-serif font-light text-2xl tracking-wide transition-all duration-700"
              style={{
                color: 'rgba(245, 240, 235, 0.6)',
                transform: menuOpen ? 'translateY(0)' : `translateY(${20 + i * 10}px)`,
                opacity: menuOpen ? 1 : 0,
                transitionDelay: menuOpen ? `${i * 80}ms` : '0ms',
              }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

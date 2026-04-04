'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'

type NavItem = { label: string; href: string; isExternal?: boolean }

export function Header({ navItems: navItemsProp }: { navItems?: NavItem[] }) {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLanguage()
  const ticking = useRef(false)
  const SCROLL_THRESHOLD = 300

  useEffect(() => {
    const updateVisibility = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        // Hidden at top only; visible once scrolled past threshold (any direction)
        setVisible(window.scrollY >= SCROLL_THRESHOLD)
        ticking.current = false
      })
    }
    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const defaultItems: NavItem[] = [
    { href: '/about', label: 'About Us' },
    { href: '/our-work', label: 'Our Work' },
    { href: '/development', label: 'Development' },
    { href: '/press', label: 'Press' },
    { href: '/contact', label: 'Contact' },
  ]

  const navItems = (navItemsProp ?? defaultItems).map((item) => ({
    ...item,
    href: item.isExternal || !item.href.startsWith('/')
      ? item.href
      : `/${lang}${item.href}`,
  }))

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 transition-transform duration-500 ${menuOpen ? 'z-[80]' : 'z-30'}`}
        style={{
          transform: visible || menuOpen ? 'translateY(0)' : 'translateY(-100%)',
          background: 'rgba(7, 7, 8, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="px-6 lg:px-10 h-14 flex items-center justify-between">
          <Link
            href={`/${lang}`}
            className="group outline-none"
            aria-label="RFE — home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/favicon.png"
              alt="RFE"
              className="h-7 w-auto object-contain transition-opacity duration-500 group-hover:opacity-80"
            />
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-sans text-sm tracking-wide transition-opacity duration-300 hover:opacity-60"
                style={{ color: 'rgba(245, 240, 235, 0.85)' }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            className="relative lg:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5"
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

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 z-[70] transition-all duration-700 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(7, 7, 8, 0.97)' }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-10" aria-label="Navigation">
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

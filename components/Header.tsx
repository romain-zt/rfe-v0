'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useLanguage } from './LanguageContext'

export function Header() {
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { lang } = useLanguage()
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const currentY = window.scrollY
        // Show header on scroll-up (past 100px), hide on scroll-down
        if (currentY < 100) {
          setVisible(false)
        } else if (currentY < lastScrollY.current) {
          setVisible(true)
        } else {
          setVisible(false)
        }
        lastScrollY.current = currentY
        ticking.current = false
      })
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
    { href: `/${lang}/our-team`, label: 'the gaze' },
    { href: `/${lang}/our-work`, label: 'the work' },
    { href: `/${lang}/contact`, label: 'contact' },
  ]

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-transform duration-500"
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
              src="/assets/logos/logo-rfe-blackgold.png"
              alt="RFE"
              className="h-7 w-auto object-contain transition-opacity duration-500 group-hover:opacity-80"
            />
          </Link>

          {/* Hamburger — always visible */}
          <button
            className="relative w-8 h-8 flex flex-col items-center justify-center gap-1.5"
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
        className={`fixed inset-0 z-40 transition-all duration-700 ${
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

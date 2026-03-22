'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { extractYouTubeId } from '@/lib/works'
import type { WorkItem } from '@/lib/i18n/types'

interface WorkPageContentProps {
  work: WorkItem
}

export default function WorkPageContent({ work }: WorkPageContentProps) {
  const { t, lang } = useLanguage()
  const videoRef = useRef<HTMLDivElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const youtubeId = work.videoUrl ? extractYouTubeId(work.videoUrl) : null
  
  // Reveal animation on mount
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <main className="min-h-screen pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href={`/${lang}/our-work`}
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-muted-foreground/60 hover:text-foreground transition-colors mb-8 sm:mb-12"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          {lang === 'fr' ? 'Retour aux travaux' : 'Back to works'}
        </Link>
        
        {/* Hero section with video/poster */}
        <div
          className="relative mb-8 sm:mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          {/* Video or Poster */}
          <div
            ref={videoRef}
            className="relative aspect-video overflow-hidden exhibition-frame"
          >
            {youtubeId ? (
              <>
                {/* Poster fallback while video loads */}
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
                >
                  <Image
                    src={work.src}
                    alt={work.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 80vw"
                    priority
                  />
                </div>
                
                {/* YouTube embed */}
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                  title={work.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIsVideoLoaded(true)}
                />
              </>
            ) : (
              <Image
                src={work.src}
                alt={work.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 80vw"
                priority
              />
            )}
            
            {/* Warm glow overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(180, 140, 90, 0.06) 0%, transparent 70%)',
              }}
            />
          </div>
        </div>
        
        {/* Content */}
        <div
          className="space-y-6"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s',
          }}
        >
          {/* Title and year */}
          <div className="space-y-3">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light tracking-wide">
              {work.title}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground tracking-[0.15em]">
              {work.year}
            </p>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-2">
            {work.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 border border-border/60 px-3 py-1.5"
              >
                {tag}
              </span>
            ))}
          </div>
          
          {/* Description */}
          {work.description && (
            <p className="text-sm sm:text-base text-muted-foreground/80 leading-relaxed max-w-3xl">
              {work.description}
            </p>
          )}
          
          {/* CTA section */}
          <div
            className="pt-8 sm:pt-12 border-t border-border/30 space-y-6"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 0.8s ease 0.4s, transform 0.8s ease 0.4s',
            }}
          >
            {/* CTA copy removed — Composite Films artifact */}
            <Link
              href={`/${lang}/contact`}
              className="inline-flex items-center gap-2 text-[11px] sm:text-xs tracking-[0.15em] uppercase border border-foreground/40 px-5 py-3 hover:bg-foreground/5 transition-colors"
            >
              {t.nav.contact}
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

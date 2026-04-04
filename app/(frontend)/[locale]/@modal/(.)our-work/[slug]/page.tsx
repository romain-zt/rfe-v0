'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/components/LanguageContext'
import { getWorkBySlug, extractYouTubeId } from '@/lib/works'

export default function WorkModalPage() {
  const router = useRouter()
  const params = useParams()
  const { lang, t, content } = useLanguage()
  const slug = params.slug as string
  
  const [isOpen, setIsOpen] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  
  // Get work data from sheets content
  const work = getWorkBySlug(slug, content.ourWork)
  const youtubeId = work?.videoUrl ? extractYouTubeId(work.videoUrl) : null
  
  // Open animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 50)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(timer)
      document.body.style.overflow = ''
    }
  }, [])
  
  // Close handler
  const handleClose = useCallback(() => {
    setIsOpen(false)
    setTimeout(() => {
      router.back()
    }, 300)
  }, [router])
  
  // Escape key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [handleClose])
  
  if (!work) {
    return null
  }
  
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal content */}
      <div
        className={`relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute -top-12 right-0 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        
        {/* Content wrapper */}
        <div className="bg-background border border-border/30 overflow-hidden">
          {/* Video or Poster */}
          <div className="relative aspect-video overflow-hidden">
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
                  />
                </div>
                
                {/* YouTube embed */}
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
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
          
          {/* Info */}
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2
                  id="modal-title"
                  className="font-serif text-xl sm:text-2xl font-light tracking-wide"
                >
                  {work.title}
                </h2>
                <p className="text-xs text-muted-foreground tracking-[0.15em]">
                  {work.year}
                </p>
              </div>
              
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {work.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/60 border border-border/60 px-2 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>
            
            {/* Description */}
            {work.description && (
              <p className="text-sm text-muted-foreground/80 leading-relaxed">
                {work.description}
              </p>
            )}
            
            {/* Contact CTA */}
            {/* <div className="pt-4 border-t border-border/30">
              <Link
                href={`/${lang}/contact`}
                className="inline-flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors"
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
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

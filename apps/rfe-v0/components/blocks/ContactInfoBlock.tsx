'use client'

import { useLanguage } from '@/components/LanguageContext'

type Props = {
  title?: string
  showEmail?: boolean
  showPhone?: boolean
  showAddress?: boolean
  showSocials?: boolean
}

export function ContactInfoComponent({ title, showEmail = true, showPhone = true, showAddress = true, showSocials = true }: Props) {
  const { content } = useLanguage()
  const info = content?.contactInfo

  if (!info) return null

  return (
    <div className="space-y-8">
      {title && (
        <h3 className="text-sm tracking-wide uppercase mb-6" style={{ color: 'var(--rfe-gold)' }}>
          {title}
        </h3>
      )}

      {showAddress && info.address && (
        <div>
          <h4 className="text-sm tracking-wide uppercase mb-3">Address</h4>
          <p className="text-muted-foreground text-sm">{info.address}</p>
        </div>
      )}

      {showEmail && info.email && (
        <div>
          <h4 className="text-sm tracking-wide uppercase mb-3">Email</h4>
          <a href={`mailto:${info.email}`} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
            {info.email}
          </a>
        </div>
      )}

      {showPhone && info.phone && (
        <div>
          <h4 className="text-sm tracking-wide uppercase mb-3">Phone</h4>
          <p className="text-muted-foreground text-sm">{info.phone}</p>
        </div>
      )}

      {showSocials && info.social && (
        <div className="flex gap-4 mt-4">
          {info.social.instagram && (
            <a href={info.social.instagram} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
              Instagram
            </a>
          )}
          {info.social.imdb && (
            <a href={info.social.imdb} target="_blank" rel="noopener noreferrer" className="text-xs tracking-wider uppercase text-muted-foreground hover:text-foreground transition-colors">
              IMDb
            </a>
          )}
        </div>
      )}
    </div>
  )
}

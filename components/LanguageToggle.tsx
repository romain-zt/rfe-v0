'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLanguage } from './LanguageContext'

export function LanguageToggle() {
  const { lang } = useLanguage()
  const pathname = usePathname()
  const router = useRouter()

  const switchLocale = (newLocale: 'en' | 'fr') => {
    if (newLocale === lang) return
    
    // Replace the locale segment in the pathname
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    
    // Set cookie for middleware persistence
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => switchLocale('en')}
        className={`transition-colors ${
          lang === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        EN
      </button>
      <span className="text-muted-foreground">/</span>
      <button
        onClick={() => switchLocale('fr')}
        className={`transition-colors ${
          lang === 'fr' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        FR
      </button>
    </div>
  )
}

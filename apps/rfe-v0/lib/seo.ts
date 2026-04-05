import type { Metadata } from 'next'
import type { Language } from '@/lib/i18n/types'

export const SITE_CONFIG = {
  name: 'RFE',
  url: 'https://www.rohmfeiferentertainment.com',
  locale: {
    default: 'en' as Language,
    supported: ['en'] as Language[],
  },
  social: {
    instagram: 'https://instagram.com/rohmfeiferentertainment',
  },
  contact: {
    email: 'elisabeth@rohmfeiferentertainment.com',
  },
} as const

export const OG_IMAGES = {
  default: '/logo-rfe.svg',
  width: 1200,
  height: 630,
} as const

export const seoContent = {
  en: {
    site: {
      title: 'RFE — a cinematic female gaze studio',
      description: 'stories that refuse to stay quiet.',
      keywords: [
        'female gaze cinema',
        'feminist film production',
        'independent film studio',
        'female director',
        'women in film',
        'auteur cinema',
        'indie production company',
        'Margret and Stevie',
        'cinematic storytelling',
        'female-led films',
      ],
    },
    pages: {
      home: {
        title: 'RFE — a cinematic female gaze studio',
        description: 'stories that refuse to stay quiet.',
      },
      ourWork: {
        title: 'Work — RFE',
        description: 'Films that look with women, not at them.',
      },
      ourTeam: {
        title: 'Team — RFE',
        description: 'The people behind the gaze.',
      },
      about: {
        title: 'About — RFE',
        description: 'Why we exist. What we refuse. What we chase.',
      },
      news: {
        title: 'Press — RFE',
        description: 'The world is starting to listen.',
      },
      contact: {
        title: 'Contact — RFE',
        description: "if it won't leave you alone, write to us.",
      },
      legal: {
        title: 'Legal notice — RFE',
        description: 'Publisher, hosting, and terms of use for this website.',
      },
    },
  },
  fr: {
    site: {
      title: 'RFE — un studio de cinéma au regard féminin',
      description: 'des histoires qui refusent de se taire.',
      keywords: [
        'regard féminin cinéma',
        'production cinéma féministe',
        'studio indépendant',
        'réalisatrice',
        'femmes dans le cinéma',
        'cinéma d\'auteur',
      ],
    },
    pages: {
      home: {
        title: 'RFE — un studio de cinéma au regard féminin',
        description: 'des histoires qui refusent de se taire.',
      },
      ourWork: {
        title: 'Projets — RFE',
        description: 'Des films qui regardent avec les femmes, pas les femmes.',
      },
      ourTeam: {
        title: 'Équipe — RFE',
        description: 'Les personnes derrière le regard.',
      },
      about: {
        title: 'À propos — RFE',
        description: 'Pourquoi on existe. Ce qu\'on refuse. Ce qu\'on cherche.',
      },
      news: {
        title: 'Presse — RFE',
        description: 'Le monde commence à écouter.',
      },
      contact: {
        title: 'Contact — RFE',
        description: "si ça ne vous lâche pas, écrivez-nous.",
      },
      legal: {
        title: 'Mentions légales — RFE',
        description: 'Éditeur, hébergement et conditions d’utilisation du site.',
      },
    },
  },
} as const

type PageKey = keyof typeof seoContent.en.pages

export function generatePageMetadata(
  page: PageKey,
  lang: Language = 'en',
  pathname: string = '/',
  overrides?: Partial<Metadata>
): Metadata {
  const langKey = lang === 'fr' ? 'fr' : 'en'
  const content = seoContent[langKey].pages[page]
  const siteContent = seoContent[langKey].site
  const pathWithoutLocale = pathname.replace(/^\/(en|fr)/, '') || '/'

  return {
    title: content.title,
    description: content.description,
    keywords: siteContent.keywords as unknown as string[],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: `/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
      languages: {
        en: `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
        'x-default': `/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${SITE_CONFIG.url}/${lang}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`,
      siteName: SITE_CONFIG.name,
      title: content.title,
      description: content.description,
      images: [
        {
          url: OG_IMAGES.default,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [OG_IMAGES.default],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...overrides,
  }
}

export function generateRootMetadata(lang: Language = 'en'): Metadata {
  const langKey = lang === 'fr' ? 'fr' : 'en'
  const content = seoContent[langKey].site

  return {
    title: {
      default: content.title,
      template: `%s | RFE`,
    },
    description: content.description,
    keywords: content.keywords as unknown as string[],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    metadataBase: new URL(SITE_CONFIG.url),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: '/en',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: `${SITE_CONFIG.url}/${lang}`,
      siteName: SITE_CONFIG.name,
      title: content.title,
      description: content.description,
      images: [
        {
          url: OG_IMAGES.default,
          width: OG_IMAGES.width,
          height: OG_IMAGES.height,
          alt: SITE_CONFIG.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.title,
      description: content.description,
      images: [OG_IMAGES.default],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: { url: '/icon.svg', type: 'image/svg+xml' },
      apple: { url: '/icon.svg', type: 'image/svg+xml' },
    },
  }
}

import React from "react"
import type { Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/components/LanguageContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BottomLogoReveal } from '@/components/BottomLogoReveal'
import { generateSiteJsonLd } from '@/lib/generate-meta'
import { buildUiDictionary } from '@/lib/build-ui-dictionary'
import { siteThemeToStyleVars, buildGoogleFontsUrl } from '@/lib/site-theme'
import {
  getWorks,
  getTeamMembers,
  getSiteConfig,
  getNavigation,
  getPressItems,
} from '@/lib/cms'
import type { Language } from '@/lib/i18n/types'
import './globals.css'

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const _fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-fraunces',
  display: 'swap',
})

type Props = {
  params: Promise<{ locale: Language }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const siteConfig = await getSiteConfig().catch(() => null)
  const title = siteConfig?.seo?.defaultTitle || 'RFE — a cinematic female gaze studio'
  const description = siteConfig?.seo?.defaultDescription || 'stories that refuse to stay quiet.'
  const siteUrl = siteConfig?.seo?.siteUrl || 'https://www.rohmfeiferentertainment.com'

  return {
    title: { default: title, template: siteConfig?.seo?.titleTemplate || '%s | RFE' },
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: `/${locale}`, languages: { en: '/en', 'x-default': '/en' } },
    openGraph: { type: 'website' as const, locale: 'en_US', url: `${siteUrl}/${locale}`, siteName: siteConfig?.brand?.name || 'RFE', title, description },
    twitter: { card: 'summary_large_image' as const, title, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large' as const, 'max-snippet': -1 } },
    icons: { icon: { url: '/icon.svg', type: 'image/svg+xml' }, apple: { url: '/icon.svg', type: 'image/svg+xml' } },
  }
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  await params
  const siteConfig = await getSiteConfig().catch(() => null)
  return {
    themeColor: siteConfig?.colors?.background ?? '#070708',
    width: 'device-width',
    initialScale: 1,
  }
}

export function generateStaticParams() {
  return [{ locale: 'en' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Language }>
}>) {
  const { locale } = await params

  const [siteConfig, navigation, worksRes, teamRes, pressRes] = await Promise.all([
    getSiteConfig().catch(() => null),
    getNavigation().catch(() => null),
    getWorks().catch(() => ({ docs: [] })),
    getTeamMembers().catch(() => ({ docs: [] })),
    getPressItems().catch(() => ({ docs: [] })),
  ])

  const works = worksRes.docs.map((w) => ({
    id: w.id,
    title: w.title,
    slug: w.slug,
    year: w.year,
    src: typeof w.poster === 'object' && w.poster ? w.poster.url : '',
    tags: w.tags || [],
    description: w.description || '',
    videoUrl: w.videoUrl || '',
    category: w.category,
    subcategory: w.subcategory,
  }))

  const teamMembers = teamRes.docs.map((m) => ({
    id: m.id,
    name: m.name,
    role: m.role,
    bio: m.bio,
    photo: typeof m.photo === 'object' && m.photo ? (m.photo as { url?: string }).url || '' : '',
  }))

  const pressDateYm = (d: string | undefined) => (d ? d.slice(0, 7) : '')

  const content = {
    aboutContent: siteConfig?.about?.paragraphs?.map((p) => p.text) ?? [],
    teamMembers,
    awardsNews: pressRes.docs.map((p) => ({
      id: p.id,
      date: pressDateYm(p.date),
      source: p.source,
      title: p.title,
      content: p.description ?? '',
    })),
    contactInfo: {
      email: siteConfig?.contact?.email ?? '',
      phone: siteConfig?.contact?.phone ?? '',
      address: siteConfig?.contact?.address ?? '',
      social: {
        instagram: siteConfig?.social?.instagram ?? '',
        linkedin: siteConfig?.social?.linkedin ?? '',
        vimeo: siteConfig?.social?.vimeo ?? '',
        tiktok: siteConfig?.social?.tiktok ?? '',
        imdb: siteConfig?.social?.imdb ?? '',
      },
    },
    ourWork: works,
  }

  const navItems = navigation?.header?.items
  const themeStyle = siteThemeToStyleVars(siteConfig)
  const googleFontsUrl = buildGoogleFontsUrl(siteConfig)
  const t = buildUiDictionary(siteConfig, navigation)

  return (
    <html
      lang={locale}
      className={`dark ${_inter.variable} ${_fraunces.variable}`}
      style={themeStyle}
    >
      <head>
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={googleFontsUrl} rel="stylesheet" />
          </>
        )}
        {generateSiteJsonLd(siteConfig, navItems ?? [], locale)}
      </head>
      <body className="font-sans antialiased min-h-screen cinema-root max-w-[100dvw] overflow-x-hidden">
        <LanguageProvider locale={locale} t={t} content={content}>
          {/* Cinematic depth layers */}
          <div className="cinema-hole" aria-hidden="true" />
          <div className="cinema-lens" aria-hidden="true" />
          <div className="cinema-leak" aria-hidden="true" />

          <BottomLogoReveal />
          <Header navItems={navItems} />
          <div
            className="relative [&>header]:z-10 [&>main>div]:max-w-7xl [&>main>div]:mx-auto max-w-[100dvw] [overflow-x:clip]"
            style={{ background: 'var(--background)', marginBottom: '80vh' }}
          >
            {children}
            <Footer />
          </div>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}

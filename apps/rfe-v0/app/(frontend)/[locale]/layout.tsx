import React from "react"
import type { Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/components/LanguageContext'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BottomLogoReveal } from '@/components/BottomLogoReveal'
import { GrainOverlay } from '@rfe/ui'
import { RootJsonLd } from '@/components/JsonLd'
import { generateRootMetadata } from '@/lib/seo'
import { fallbackEn } from '@/lib/i18n/fallback/en'
import { getWorks, getTeamMembers, getSiteConfig, getNavigation } from '@/lib/cms'
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
  return generateRootMetadata(locale)
}

export const viewport: Viewport = {
  themeColor: '#070708',
  width: 'device-width',
  initialScale: 1,
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

  const [siteConfig, navigation, worksRes, teamRes] = await Promise.all([
    getSiteConfig().catch(() => null),
    getNavigation().catch(() => null),
    getWorks().catch(() => ({ docs: [] })),
    getTeamMembers().catch(() => ({ docs: [] })),
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
  }))

  const content = {
    aboutContent: siteConfig?.about?.paragraphs?.map((p) => p.text) ?? fallbackEn.aboutContent,
    teamMembers: teamMembers.length ? teamMembers : fallbackEn.teamMembers,
    awardsNews: fallbackEn.awardsNews,
    contactInfo: siteConfig
      ? {
          email: siteConfig.contact.email,
          phone: siteConfig.contact.phone ?? '',
          address: siteConfig.contact.address,
          social: {
            instagram: siteConfig.social.instagram ?? '',
            linkedin: siteConfig.social.linkedin ?? '',
            vimeo: siteConfig.social.vimeo ?? '',
            tiktok: siteConfig.social.tiktok ?? '',
            imdb: siteConfig.social.imdb ?? '',
          },
        }
      : fallbackEn.contactInfo,
    ourWork: works.length ? works : fallbackEn.ourWork,
  }

  const navItems = navigation?.header?.items ?? [
    { label: 'About Us', href: '/about', isExternal: false },
    { label: 'Our Work', href: '/our-work', isExternal: false },
    { label: 'Development', href: '/development', isExternal: false },
    { label: 'Press', href: '/press', isExternal: false },
    { label: 'Contact', href: '/contact', isExternal: false },
  ]

  return (
    <html
      lang={locale}
      className={`dark ${_inter.variable} ${_fraunces.variable}`}
    >
      <head>
        <RootJsonLd lang={locale} />
      </head>
      <body className="font-sans antialiased min-h-screen cinema-root max-w-[100dvw] overflow-x-hidden">
        <LanguageProvider
          locale={locale}
          t={fallbackEn.t}
          content={content}
        >
          {/* Cinematic depth layers */}
          <div className="cinema-hole" aria-hidden="true" />
          <div className="cinema-lens" aria-hidden="true" />
          <div className="cinema-leak" aria-hidden="true" />

          {/* Grain overlay */}
          <GrainOverlay />

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

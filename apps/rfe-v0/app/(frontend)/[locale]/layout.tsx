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
import { fallbackFr } from '@/lib/i18n/fallback/fr'
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
  return [{ locale: 'en' }, { locale: 'fr' }]
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: Language }>
}>) {
  const { locale } = await params
  const site = locale === 'fr' ? fallbackFr : fallbackEn

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
          t={site.t}
          content={{
            aboutContent: site.aboutContent,
            teamMembers: site.teamMembers,
            awardsNews: site.awardsNews,
            contactInfo: site.contactInfo,
            ourWork: site.ourWork,
          }}
        >
          {/* Cinematic depth layers */}
          <div className="cinema-hole" aria-hidden="true" />
          <div className="cinema-lens" aria-hidden="true" />
          <div className="cinema-leak" aria-hidden="true" />

          {/* Grain overlay */}
          <GrainOverlay />

          <BottomLogoReveal />
          <Header />
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

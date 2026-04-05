import { NextResponse } from 'next/server'
import { SITE_CONFIG } from '@/lib/seo'
import { getWorks } from '@/lib/cms'
import { getWorkSlug } from '@/lib/works'

export const runtime = 'nodejs'

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const base = SITE_CONFIG.url.replace(/\/$/, '')
  const urls: string[] = []
  const { docs: works } = await getWorks()

  for (const locale of ['en'] as const) {
    for (const work of works) {
      // Only include works with videos
      if (!work.videoUrl) continue

      const slug = getWorkSlug(work)
      const loc = `${base}/${locale}/our-work/${slug}`
      const posterUrl =
        typeof work.poster === 'object' && work.poster?.url ? work.poster.url : ''
      const thumb = posterUrl.startsWith('http') ? posterUrl : `${base}${posterUrl}`
      const description = work.description || work.title || ''
      
      urls.push(`  <url>
    <loc>${esc(loc)}</loc>
    <video:video>
      <video:thumbnail_loc>${esc(thumb)}</video:thumbnail_loc>
      <video:title>${esc(work.title)}</video:title>
      <video:description>${esc(description)}</video:description>
      <video:content_loc>${esc(work.videoUrl)}</video:content_loc>
      <video:player_loc allow_embed="yes">${esc(work.videoUrl)}</video:player_loc>
      <video:publication_date>${work.year}-01-01</video:publication_date>
      <video:family_friendly>yes</video:family_friendly>
    </video:video>
  </url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"
>
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}

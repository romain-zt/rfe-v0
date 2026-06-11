function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}

const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || ''

export type RevalidatePayload = {
  collection?: string
  slug?: string
  global?: string
  /** Purge all CMS-driven routes (works, pages, layout data). */
  scope?: 'site'
}

export async function revalidateFrontend(body: RevalidatePayload = { scope: 'site' }) {
  try {
    const siteUrl = getSiteUrl()
    const res = await fetch(`${siteUrl}/next/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATION_SECRET,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      console.error(
        `[revalidateFrontend] ${res.status} ${res.statusText} for`,
        body,
        `— check NEXT_PUBLIC_SITE_URL (${siteUrl}) and REVALIDATION_SECRET`,
      )
    }
  } catch (error) {
    console.error('[revalidateFrontend] request failed:', error)
  }
}

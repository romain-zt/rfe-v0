export type RevalidatePayload = {
  collection?: string
  slug?: string
  global?: string
  /** Purge all CMS-driven routes (works, pages, layout data). */
  scope?: 'site'
}

type RevalidatorFn = (body: RevalidatePayload) => Promise<void>

let directRevalidator: RevalidatorFn | null = null

/** Register in-process revalidation (integrated Next.js app — avoids HTTP self-fetch). */
export function registerRevalidator(fn: RevalidatorFn) {
  directRevalidator = fn
}

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

/**
 * Purge Next.js caches after CMS edits. Always performs full-site revalidation so
 * list pages, layout data, and related media stay in sync.
 */
export async function revalidateFrontend(_body: RevalidatePayload = { scope: 'site' }) {
  const body: RevalidatePayload = { scope: 'site' }

  if (directRevalidator) {
    try {
      await directRevalidator(body)
      return
    } catch (error) {
      console.error('[revalidateFrontend] direct revalidation failed:', error)
    }
  }

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
        `[revalidateFrontend] ${res.status} ${res.statusText}`,
        `— check NEXT_PUBLIC_SITE_URL (${siteUrl}) and REVALIDATION_SECRET`,
      )
    }
  } catch (error) {
    console.error('[revalidateFrontend] request failed:', error)
  }
}

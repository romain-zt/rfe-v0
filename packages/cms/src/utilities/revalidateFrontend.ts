const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
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
    const res = await fetch(`${SITE_URL}/next/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATION_SECRET,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok && process.env.NODE_ENV !== 'production') {
      console.warn(
        `[revalidateFrontend] ${res.status} ${res.statusText} for`,
        body,
        '— check NEXT_PUBLIC_SITE_URL and REVALIDATION_SECRET',
      )
    }
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[revalidateFrontend] request failed:', error)
    }
  }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET || ''

export async function revalidateFrontend(body: {
  collection?: string
  slug?: string
  global?: string
}) {
  try {
    await fetch(`${SITE_URL}/next/revalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidate-secret': REVALIDATION_SECRET,
      },
      body: JSON.stringify(body),
    })
  } catch {
    // Silently fail — frontend may not be running
  }
}

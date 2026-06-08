import { revalidatePath, revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

const LOCALES = ['en']

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATION_SECRET && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }

  let body: { collection?: string; slug?: string; global?: string } = {}
  try {
    body = await request.json()
  } catch {
    // no body — revalidate everything
  }

  if (body.global) {
    revalidateTag(`cms:globals:${body.global}`)
    // Globals can affect any page — revalidate the whole layout
    revalidatePath('/', 'layout')
  } else if (body.collection === 'pages' && body.slug) {
    revalidateTag(`cms:pages:${body.slug}`)
    for (const locale of LOCALES) {
      const path = body.slug === 'home' ? `/${locale}` : `/${locale}/${body.slug}`
      revalidatePath(path)
    }
  } else if (body.collection && body.slug) {
    revalidateTag(`cms:${body.collection}:${body.slug}`)
    revalidatePath('/', 'layout')
  } else if (body.collection) {
    revalidateTag(`cms:${body.collection}`)
    revalidatePath('/', 'layout')
  } else {
    revalidateTag('cms')
    revalidatePath('/', 'layout')
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

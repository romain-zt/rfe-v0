import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'

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
    revalidateTag(`cms:globals:${body.global}`, 'max')
  } else if (body.collection && body.slug) {
    revalidateTag(`cms:${body.collection}:${body.slug}`, 'max')
  } else if (body.collection) {
    revalidateTag(`cms:${body.collection}`, 'max')
  } else {
    revalidateTag('cms', 'max')
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

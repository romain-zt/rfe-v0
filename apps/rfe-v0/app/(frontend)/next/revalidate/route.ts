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
    revalidateTag(`cms:globals:${body.global}`)
  } else if (body.collection && body.slug) {
    revalidateTag(`cms:${body.collection}:${body.slug}`)
  } else if (body.collection) {
    revalidateTag(`cms:${body.collection}`)
  } else {
    revalidateTag('cms')
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

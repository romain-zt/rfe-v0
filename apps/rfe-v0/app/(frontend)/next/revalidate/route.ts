import { revalidateTag } from 'next/cache'
import { NextResponse, type NextRequest } from 'next/server'
import {
  revalidateCmsDataTags,
  revalidatePageData,
  revalidateSitePaths,
  revalidateWorkData,
} from '@/lib/revalidate-paths'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATION_SECRET && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }

  let body: {
    collection?: string
    slug?: string
    global?: string
    scope?: 'site'
  } = {}

  try {
    body = await request.json()
  } catch {
    // no body — full site revalidation
  }

  if (body.scope === 'site' || (!body.collection && !body.global)) {
    await revalidateSitePaths()
  } else if (body.global) {
    revalidateTag(`cms:globals:${body.global}`, { expire: 0 })
    await revalidateSitePaths()
  } else if (body.collection === 'pages' && body.slug) {
    revalidateCmsDataTags()
    revalidatePageData(body.slug)
  } else if (body.collection === 'works' && body.slug) {
    revalidateCmsDataTags()
    revalidateWorkData(body.slug)
    await revalidateSitePaths()
  } else if (body.collection) {
    await revalidateSitePaths()
  } else {
    await revalidateSitePaths()
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

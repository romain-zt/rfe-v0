import { NextResponse, type NextRequest } from 'next/server'
import { revalidateSitePaths } from '@/lib/revalidate-paths'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATION_SECRET && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 403 })
  }

  await revalidateSitePaths()

  return NextResponse.json({ revalidated: true, now: Date.now() })
}

'use client'

import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'

export function LivePreviewListener() {
  const router = useRouter()
  const serverURL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={serverURL}
    />
  )
}

'use client'

import { useRouter } from 'next/navigation'
import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { getLivePreviewServerURL } from '@/lib/live-preview'

export function LivePreviewListener() {
  const router = useRouter()

  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={getLivePreviewServerURL()}
    />
  )
}

'use client'

import { useLivePreview } from '@payloadcms/live-preview-react'
import { RenderHero } from '@/components/blocks/RenderHero'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import type { PageData } from '@/lib/cms'

type Props = {
  initialData: PageData
}

export function PageContent({ initialData }: Props) {
  const serverURL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

  const { data: page } = useLivePreview<PageData>({
    initialData,
    serverURL,
    depth: 2,
  })

  return (
    <>
      <RenderHero hero={page.hero} />

      <div className="relative" style={{ background: 'var(--background)' }}>
        {page.hero?.type !== 'minimal' && (
          <div
            className="absolute top-0 left-0 right-0 -translate-y-full pointer-events-none"
            style={{
              height: '40vh',
              background: 'linear-gradient(to top, var(--background) 0%, rgba(7, 7, 8, 0.85) 30%, rgba(7, 7, 8, 0.4) 65%, transparent 100%)',
            }}
            aria-hidden="true"
          />
        )}

        <RenderBlocks blocks={page.layout} />
      </div>
    </>
  )
}

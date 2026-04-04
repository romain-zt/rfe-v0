import path from 'path'
import { buildConfig, type Config } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import sharp from 'sharp'
import { collections } from './collections'
import { globals } from './globals'
import { seedResetEndpoint } from './endpoints/seed-reset'
import { generatePreviewPath } from './utilities/generatePreviewPath'

export type RfeConfigOptions = {
  dirname: string
  secret: string
  databaseUrl: string
  s3: {
    bucket: string
    accessKeyId: string
    secretAccessKey: string
    region: string
    endpoint?: string
  }
  siteUrl?: string
  overrides?: Partial<Config>
}

export function buildRfeConfig(opts: RfeConfigOptions) {
  const siteUrl = opts.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return buildConfig({
    cors: [siteUrl, 'http://localhost:3000'],
    admin: {
      user: 'users',
      meta: { titleSuffix: '— RFE' },
      importMap: { baseDir: opts.dirname },
      livePreview: {
        breakpoints: [
          { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
          { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
          { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
        ],
      },
      components: {
        afterDashboard: ['@rfe/cms/components/ResetContentButton#ResetContentButton'],
      },
    },
    endpoints: [seedResetEndpoint],
    collections,
    globals,
    secret: opts.secret,
    db: postgresAdapter({
      pool: { connectionString: opts.databaseUrl },
    }),
    editor: lexicalEditor(),
    localization: {
      locales: [{ label: 'English', code: 'en' }],
      defaultLocale: 'en',
      fallback: true,
    },
    plugins: [
      s3Storage({
        collections: { media: { prefix: 'media' } },
        bucket: opts.s3.bucket,
        config: {
          credentials: {
            accessKeyId: opts.s3.accessKeyId,
            secretAccessKey: opts.s3.secretAccessKey,
          },
          region: opts.s3.region,
          endpoint: opts.s3.endpoint,
          forcePathStyle: !!opts.s3.endpoint,
        },
      }),
      seoPlugin({
        generateTitle: ({ doc }) =>
          doc?.title ? `${doc.title} — RFE` : 'RFE — a cinematic female gaze studio',
        generateURL: ({ doc }) =>
          doc?.slug ? `${siteUrl}/${doc.slug}` : siteUrl,
      }),
    ],
    sharp,
    typescript: {
      outputFile: path.resolve(opts.dirname, 'payload-types.ts'),
    },
    ...opts.overrides,
  })
}

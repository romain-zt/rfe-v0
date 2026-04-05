import path from 'path'
import { buildConfig, type Config } from 'payload'
import { postgresAdapter, type PostgresAdapterArgs } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import sharp from 'sharp'
import { collections } from './collections/index.ts'
import { globals } from './globals/index.ts'
import { seedResetEndpoint } from './endpoints/seed-reset.ts'
import { generatePreviewPath } from './utilities/generatePreviewPath.ts'

export type RfeConfigOptions = {
  dirname: string
  secret: string
  databaseUrl: string
  /** Bundled migrations for production runtime (import from app `migrations/index.ts`). */
  prodMigrations?: PostgresAdapterArgs['prodMigrations']
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
      migrationDir: path.join(opts.dirname, 'migrations'),
      ...(opts.prodMigrations ? { prodMigrations: opts.prodMigrations } : {}),
    }),
    editor: lexicalEditor(),
    localization: {
      locales: [{ label: 'English', code: 'en' }],
      defaultLocale: 'en',
      fallback: true,
    },
    plugins: [
      s3Storage({
        /** Allow local temp files so sharp can generate `imageSizes` before upload to S3. */
        disableLocalStorage: false,
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
      formBuilderPlugin({
        fields: {
          text: true,
          textarea: true,
          email: true,
          checkbox: true,
          message: true,
          select: false,
          radio: false,
          state: false,
          country: false,
          number: false,
          date: false,
          payment: false,
        },
        redirectRelationships: ['pages'],
        formOverrides: {
          admin: { group: 'Forms' },
        },
        formSubmissionOverrides: {
          admin: { group: 'Forms' },
        },
      }),
    ],
    sharp,
    typescript: {
      outputFile: path.resolve(opts.dirname, 'payload-types.ts'),
    },
    ...opts.overrides,
  })
}

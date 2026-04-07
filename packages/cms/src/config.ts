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

function normalizeDatabaseUrl(url: string): string {
  if (!url) return url
  try {
    const u = new URL(url)
    const mode = u.searchParams.get('sslmode')
    if (mode && ['prefer', 'require', 'verify-ca'].includes(mode)) {
      u.searchParams.set('sslmode', 'verify-full')
    }
    return u.toString()
  } catch {
    return url
  }
}

export function buildRfeConfig(opts: RfeConfigOptions) {
  const siteUrl = opts.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  return buildConfig({
    cors: [siteUrl, 'http://localhost:3000'],
    admin: {
      user: 'users',
      meta: {
        titleSuffix: '— RFE',
        favicon: '/icon.svg',
        ogImage: '/logo-rfe.svg',
      },
      importMap: { baseDir: opts.dirname },
      livePreview: {
        breakpoints: [
          { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
          { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
          { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
        ],
      },
      components: {
        graphics: {
          Icon: '@rfe/cms/components/Icon#Icon',
          Logo: '@rfe/cms/components/Logo#Logo',
        },
        beforeLogin: ['@rfe/cms/components/BeforeLogin#BeforeLogin'],
        afterDashboard: ['@rfe/cms/components/ResetContentButton#ResetContentButton'],
        providers: ['@rfe/cms/components/AIChat#AIChatProvider'],
      },
    },
    endpoints: [seedResetEndpoint],
    collections,
    globals,
    secret: opts.secret,
    db: postgresAdapter({
      pool: {
        connectionString: normalizeDatabaseUrl(opts.databaseUrl),
      },
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
    onInit: async (payload) => {
      // Auto-run pending migrations on cold start using the bundled prodMigrations.
      // This ensures the DB schema is always current before any request is served,
      // even if the build-time `payload migrate` step was skipped or ran against a
      // different database instance.
      const db = payload.db as unknown as { prodMigrations?: { up: (args: unknown) => Promise<void>; down: (args: unknown) => Promise<void>; name: string }[] }
      if (db.prodMigrations?.length) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await payload.db.migrate({ migrations: db.prodMigrations as any[] })
        } catch (err) {
          payload.logger.error({ err }, '[onInit] Auto-migration failed — DB schema may be out of date')
        }
      }
    },
    ...opts.overrides,
  })
}

import path from 'path'
import { buildConfig, type Config } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import sharp from 'sharp'
import { collections } from './collections'
import { globals } from './globals'

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
  overrides?: Partial<Config>
}

export function buildRfeConfig(opts: RfeConfigOptions) {
  return buildConfig({
    admin: {
      user: 'users',
      meta: { titleSuffix: '— RFE' },
      importMap: { baseDir: opts.dirname },
    },
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
          forcePathStyle: true,
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

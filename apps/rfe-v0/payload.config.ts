import { fileURLToPath } from 'url'
import path from 'path'
import { buildRfeConfig } from '@rfe/cms/config'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildRfeConfig({
  dirname,
  secret: process.env.PAYLOAD_SECRET || 'dev-secret-please-change',
  databaseUrl: process.env.DATABASE_URL || '',
  prodMigrations: migrations,
  s3: {
    bucket: process.env.S3_BUCKET || 'rfe-media',
    accessKeyId: process.env.S3_ACCESS_KEY || '',
    secretAccessKey: process.env.S3_SECRET_KEY || '',
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
  },
})

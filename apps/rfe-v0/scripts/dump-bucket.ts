import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from '@aws-sdk/client-s3'
import { createWriteStream, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { Readable } from 'stream'
import { pipeline } from 'stream/promises'
import * as dotenv from 'dotenv'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: join(__dirname, '../.env.local') })

const client = new S3Client({
  region: process.env.S3_REGION ?? 'us-east-1',
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: !!process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_KEY!,
  },
})

const BUCKET = process.env.S3_BUCKET
if (!BUCKET) throw new Error('S3_BUCKET is not set — check .env.local')

const OUT_DIR = join(process.cwd(), 'dump', BUCKET)

async function dump() {
  let continuationToken: string | undefined
  let total = 0

  console.log(`Dumping s3://${BUCKET} → ${OUT_DIR}`)

  do {
    const list = await client.send(
      new ListObjectsV2Command({
        Bucket: BUCKET,
        ContinuationToken: continuationToken,
      }),
    )

    for (const obj of list.Contents ?? []) {
      const key = obj.Key!
      const dest = join(OUT_DIR, key)
      mkdirSync(dirname(dest), { recursive: true })

      const { Body } = await client.send(
        new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      )
      await pipeline(Body as Readable, createWriteStream(dest))
      console.log(`  ✓ ${key}`)
      total++
    }

    continuationToken = list.NextContinuationToken
  } while (continuationToken)

  console.log(`\nDone — ${total} files saved to ${OUT_DIR}`)
}

dump().catch((err) => {
  console.error(err)
  process.exit(1)
})

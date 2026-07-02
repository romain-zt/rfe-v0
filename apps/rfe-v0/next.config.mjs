import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { withPayload } from '@payloadcms/next/withPayload'

const dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo root — lets Turbopack resolve workspace packages and hoisted CSS deps.
  turbopack: {
    root: path.join(dirname, '../..'),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Seed reads `public/assets` via fs; NFT does not infer those paths from the IMAGE_PATHS list.
  outputFileTracingIncludes: {
    '/api/**/*': ['./public/assets/**/*'],
  },
}

export default withPayload(nextConfig)

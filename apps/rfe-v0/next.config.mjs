import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
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

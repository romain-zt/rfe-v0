/** @type {import('next').NextConfig} */
const cmsUrl = (process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001').replace(/\/$/, '')

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/media/:path*',
        destination: `${cmsUrl}/api/media/:path*`,
      },
    ]
  },
}

export default nextConfig

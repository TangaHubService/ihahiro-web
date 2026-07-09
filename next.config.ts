import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

// Listing photos are served from the API's own host (local disk today, object storage
// later) — Next's image optimizer 400s on any origin not explicitly whitelisted here.
function apiRemotePattern() {
  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1')
    return {
      protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
      hostname: apiUrl.hostname,
      port: apiUrl.port,
      pathname: '/uploads/**',
    }
  } catch {
    return { protocol: 'http' as const, hostname: 'localhost', port: '4000', pathname: '/uploads/**' }
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      apiRemotePattern(),
    ],
  },
}

export default withNextIntl(nextConfig)

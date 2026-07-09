// Next's image optimizer refuses to fetch from any private/loopback IP as a built-in SSRF
// guard — since the local API runs on localhost in dev (and often in early self-hosted
// deploys too), that blocks every listing photo with a generic 400, regardless of
// remotePatterns config and regardless of NODE_ENV. Detect it from the actual media host
// rather than NODE_ENV, so a `next build && next start` run against a local API still works.
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0'])

function isLocalMediaHost(): boolean {
  try {
    const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1')
    return LOCAL_HOSTNAMES.has(apiUrl.hostname)
  } catch {
    return true
  }
}

export const UNOPTIMIZE_MEDIA = isLocalMediaHost()

/**
 * Origin used for Payload live-preview postMessage checks.
 * Must match `event.origin` from the admin parent / iframe peer.
 * Prefer the actual browser origin over NEXT_PUBLIC_SITE_URL so www/apex
 * or deployment-host mismatches do not silently break live reload.
 */
export function getLivePreviewServerURL(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin
  }
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
}

/** Append media updatedAt so browser fetches fresh file after crop/replace (same URL). */
export function withMediaVersion(url: string, updatedAt?: string | null): string {
  if (!url || !updatedAt) return url
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}v=${encodeURIComponent(updatedAt)}`
}

type SeenOnPlatform = {
  name: string
  logo?: { url?: string; updatedAt?: string } | number | null
}

export function mapSeenOnPlatforms(seenOn: (SeenOnPlatform | number)[] | null | undefined) {
  return (seenOn || []).flatMap((p) => {
    if (typeof p === 'number') return []
    const logo = p.logo && typeof p.logo === 'object' ? p.logo : null
    const logoUrl = logo?.url ? withMediaVersion(logo.url, logo.updatedAt) : undefined
    return [{ name: p.name, logoUrl }]
  })
}

type SeenOnItem = {
  name: string
  logoUrl?: string
}

type SeenOnBadgesProps = {
  items: SeenOnItem[]
  className?: string
}

export function SeenOnBadges({ items, className }: SeenOnBadgesProps) {
  if (items.length === 0) return null

  return (
    <div className={`grid grid-cols-3 gap-1.5 pt-2 pb-1 ${className ?? ''}`}>
      {items.map((channel, i) => (
        <div
          key={i}
          className="flex h-14 w-full items-center justify-center overflow-hidden p-1.5"
          style={{
            background: 'var(--tone-charcoal)',
            border: '1px solid rgba(245,240,235,0.08)',
          }}
          title={channel.name}
        >
          {channel.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={channel.logoUrl}
              alt={channel.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span
              className="text-[8px] uppercase tracking-[0.1em] font-light text-center line-clamp-2"
              style={{ color: 'rgba(245, 240, 235, 0.6)' }}
            >
              {channel.name}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

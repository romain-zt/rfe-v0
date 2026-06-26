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
    <div
      className={`flex items-center gap-3 pt-3 pb-1 ${className ?? ''}`}
    >
      {items.map((channel, i) => (
        <div
          key={i}
          className="flex h-7 items-center justify-center overflow-hidden opacity-50 transition-opacity duration-500 group-hover:opacity-70"
          title={channel.name}
        >
          {channel.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={channel.logoUrl}
              alt={channel.name}
              className="h-full w-auto max-w-[72px] object-contain brightness-90"
            />
          ) : (
            <span
              className="text-[8px] uppercase tracking-[0.15em] font-light whitespace-nowrap"
              style={{ color: 'rgba(245, 240, 235, 0.5)' }}
            >
              {channel.name}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}

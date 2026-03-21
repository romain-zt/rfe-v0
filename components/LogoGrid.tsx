'use client'

interface LogoGridProps {
  items: string[]
  subtle?: boolean
  isVisible?: boolean
  delay?: number
}

export function LogoGrid({ items, subtle = false, isVisible = true, delay = 0 }: LogoGridProps) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-x-14 gap-y-8 lg:gap-x-20 lg:gap-y-10">
      {items.map((item, index) => (
        <div
          key={item}
          className={`text-[11px] tracking-[0.2em] uppercase cursor-default transition-all duration-1000 ${
            subtle
              ? 'text-foreground/25 hover:text-foreground/40'
              : 'text-foreground/35 hover:text-foreground/60'
          }`}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(15px)',
            transition: `opacity 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay + index * 0.05}s, transform 1s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay + index * 0.05}s`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  )
}

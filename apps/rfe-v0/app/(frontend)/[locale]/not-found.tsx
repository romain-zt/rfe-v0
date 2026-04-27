import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-10rem)] px-6 lg:px-16 xl:px-24 py-24 flex items-center justify-center overflow-hidden">

      <section className="relative z-10 max-w-3xl text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-rfe-gold/80">Error 404</p>
        <h1 className="mt-6 font-serif font-light text-4xl sm:text-5xl lg:text-6xl text-foreground text-balance">
          This page slipped into the shadows.
        </h1>
        <p className="mt-6 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          The link may be outdated, or the page might have moved while the story is still being rewritten.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/en"
            className="inline-flex items-center justify-center rounded-md border border-rfe-gold/30 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-foreground hover:border-rfe-gold/60 hover:bg-rfe-gold/10 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/en/our-work"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground hover:border-rfe-rose/40 transition-colors"
          >
            Browse our work
          </Link>
        </div>
      </section>
    </main>
  )
}

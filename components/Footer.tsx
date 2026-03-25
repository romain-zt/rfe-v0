'use client'

export function Footer() {
  return (
    <footer className="relative px-6 py-24 lg:py-32 flex flex-col items-center justify-center text-center">
      {/* Logo — barely there */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logos/logo-rfe.png"
        alt="RFE"
        className="h-6 w-auto object-contain mb-8"
        style={{ opacity: 0.12 }}
      />

      <a
        href="mailto:elisabeth@rohmfeiferentertainment.com"
        className="text-xs tracking-[0.1em] transition-colors duration-700"
        style={{ color: 'rgba(245, 240, 235, 0.3)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rfe-rose)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(245, 240, 235, 0.3)')}
      >
        elisabeth@rohmfeiferentertainment.com
      </a>

      <p
        className="mt-10 text-[9px] tracking-[0.15em]"
        style={{ color: 'rgba(245, 240, 235, 0.08)' }}
      >
        © {new Date().getFullYear()} RFE
      </p>
    </footer>
  )
}

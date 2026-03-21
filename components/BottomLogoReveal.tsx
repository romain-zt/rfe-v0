'use client'

export function BottomLogoReveal() {
  return (
    <div
      className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none"
      style={{ background: 'var(--background)' }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/logos/logo-rfe-blackgold.png"
        alt=""
        className="w-auto max-w-[260px] md:max-w-[400px]"
        style={{ opacity: 0.45 }}
      />
    </div>
  )
}

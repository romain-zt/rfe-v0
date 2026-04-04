'use client'

import { useEffect, useState } from 'react'

export function GrainOverlay() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      {/* Film grain layer */}
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          animation: 'filmGrain 0.15s steps(1) infinite',
        }}
      />

      {/* Cinematic vignette */}
      <div
        className="pointer-events-none fixed inset-0 z-40"
        aria-hidden="true"
        style={{
          background: `
            radial-gradient(ellipse 120% 100% at 50% 50%, transparent 40%, rgba(0, 0, 0, 0.35) 100%)
          `,
        }}
      />

      {/* Subtle scanlines for film texture */}
      <div
        className="pointer-events-none fixed inset-0 z-40 opacity-[0.015]"
        aria-hidden="true"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.5) 2px,
            rgba(0, 0, 0, 0.5) 4px
          )`,
        }}
      />

      <style jsx>{`
        @keyframes filmGrain {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-0.5%, -0.5%); }
          20% { transform: translate(0.5%, 0.5%); }
          30% { transform: translate(-0.5%, 0.5%); }
          40% { transform: translate(0.5%, -0.5%); }
          50% { transform: translate(-0.25%, 0); }
          60% { transform: translate(0.25%, 0); }
          70% { transform: translate(0, 0.5%); }
          80% { transform: translate(0, -0.5%); }
          90% { transform: translate(0.5%, 0.25%); }
        }
      `}</style>
    </>
  )
}

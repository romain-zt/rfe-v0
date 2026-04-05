import type { CSSProperties } from 'react'

const BRAND_DEFAULTS = {
  background: '#070708',
  foreground: '#F5F0EB',
  rfeRed: '#8B1A1A',
  rfeRose: '#C4A0A0',
  rfeGold: '#B5975A',
} as const

const TONE_DEFAULTS = {
  deep: '#050506',
  charcoal: '#0a0a0c',
  slate: '#0c0d10',
  warm: '#0b0908',
  cool: '#080a0d',
  ember: '#0d0907',
  dusk: '#090810',
} as const

const EASING_DEFAULTS = {
  emerge: 'cubic-bezier(0.16, 1, 0.3, 1)',
  quiet: 'cubic-bezier(0.87, 0, 0.13, 1)',
  sharp: 'cubic-bezier(0.76, 0, 0.24, 1)',
} as const

type ThemeInput = {
  colors?: Partial<Record<keyof typeof BRAND_DEFAULTS, string | null | undefined>> | null
  sectionTones?: Partial<Record<keyof typeof TONE_DEFAULTS, string | null | undefined>> | null
  easings?: Partial<Record<keyof typeof EASING_DEFAULTS, string | null | undefined>> | null
  typography?: { radiusBase?: string | null } | null
} | null | undefined

/** Inline vars on `<html>` so they override `.dark` shadcn defaults and reflect Payload Site Config. */
export function siteThemeToStyleVars(siteConfig: ThemeInput): CSSProperties {
  const c = { ...BRAND_DEFAULTS, ...siteConfig?.colors }
  const st = { ...TONE_DEFAULTS, ...siteConfig?.sectionTones }
  const e = { ...EASING_DEFAULTS, ...siteConfig?.easings }
  const radius = siteConfig?.typography?.radiusBase || '0.25rem'

  return {
    '--background': c.background ?? BRAND_DEFAULTS.background,
    '--foreground': c.foreground ?? BRAND_DEFAULTS.foreground,
    '--rfe-red': c.rfeRed ?? BRAND_DEFAULTS.rfeRed,
    '--rfe-rose': c.rfeRose ?? BRAND_DEFAULTS.rfeRose,
    '--rfe-gold': c.rfeGold ?? BRAND_DEFAULTS.rfeGold,
    '--rfe-gold-dim': `color-mix(in srgb, ${c.rfeGold ?? BRAND_DEFAULTS.rfeGold} 60%, transparent)`,
    '--rfe-rose-dim': `color-mix(in srgb, ${c.rfeRose ?? BRAND_DEFAULTS.rfeRose} 50%, transparent)`,
    '--tone-deep': st.deep ?? TONE_DEFAULTS.deep,
    '--tone-charcoal': st.charcoal ?? TONE_DEFAULTS.charcoal,
    '--tone-slate': st.slate ?? TONE_DEFAULTS.slate,
    '--tone-warm': st.warm ?? TONE_DEFAULTS.warm,
    '--tone-cool': st.cool ?? TONE_DEFAULTS.cool,
    '--tone-ember': st.ember ?? TONE_DEFAULTS.ember,
    '--tone-dusk': st.dusk ?? TONE_DEFAULTS.dusk,
    '--ease-emerge': e.emerge ?? EASING_DEFAULTS.emerge,
    '--ease-quiet': e.quiet ?? EASING_DEFAULTS.quiet,
    '--ease-sharp': e.sharp ?? EASING_DEFAULTS.sharp,
    '--radius': radius,
  } as CSSProperties
}

export const colors = {
  background: '#070708',
  foreground: '#F5F0EB',
  rfeRed: '#8B1A1A',
  rfeRose: '#C4A0A0',
  rfeGold: '#B5975A',
  rfeGoldDim: 'rgba(181, 151, 90, 0.6)',
  rfeRoseDim: 'rgba(196, 160, 160, 0.5)',
} as const

export const tones = {
  deep: '#050506',
  charcoal: '#0a0a0c',
  slate: '#0c0d10',
  warm: '#0b0908',
  cool: '#080a0d',
  ember: '#0d0907',
  dusk: '#090810',
} as const

export const easings = {
  emerge: 'cubic-bezier(0.16, 1, 0.3, 1)',
  quiet: 'cubic-bezier(0.87, 0, 0.13, 1)',
  sharp: 'cubic-bezier(0.76, 0, 0.24, 1)',
} as const

export const radius = {
  base: '0.25rem',
} as const

export type Colors = typeof colors
export type Tones = typeof tones
export type Easings = typeof easings

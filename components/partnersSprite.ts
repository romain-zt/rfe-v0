/**
 * Partners Sprite Configuration
 * 
 * Sprite atlas: 1920x1080px image containing all partner logos
 * Uses CSS background-position technique for efficient rendering
 * 
 * Coordinates (x, y, w, h) are in pixels and represent logo bounding boxes
 * within the sprite atlas. Updating the atlas image requires updating these
 * coordinates to match the new logo positions.
 */

export const sprite = {
  src: '/assets/images/partners-and-client.webp',
  width: 1920,
  height: 1080,
}

export interface Logo {
  id: string
  label: string
  x: number // X position in sprite (px)
  y: number // Y position in sprite (px)
  w: number // Width in sprite (px)
  h: number // Height in sprite (px)
}

export const logos: Logo[] = [
  { id: 'dior', label: 'Dior', x: 228, y: 252, w: 270, h: 98 },
  { id: 'arte', label: 'arte', x: 546, y: 261, w: 327, h: 89 },
  { id: 'bbc', label: 'BBC', x: 929, y: 254, w: 334, h: 104 },
  { id: 'france2', label: 'France 2', x: 1315, y: 268, w: 380, h: 82 },

  { id: 'disneyplus', label: 'Disney+', x: 199, y: 387, w: 282, h: 158 },
  { id: 'appletv', label: 'Apple TV+', x: 546, y: 399, w: 334, h: 140 },
  { id: 'netflix', label: 'Netflix', x: 928, y: 416, w: 336, h: 100 },
  { id: 'france3', label: 'France 3', x: 1315, y: 394, w: 380, h: 88 },
  { id: 'france5', label: 'France 5', x: 1320, y: 513, w: 375, h: 80 },

  { id: 'hbo', label: 'HBO', x: 213, y: 594, w: 274, h: 120 },
  { id: 'mk2', label: 'mk2', x: 594, y: 581, w: 255, h: 130 },

  // Smithsonian was split in the atlas; merged here
  { id: 'smithsonian', label: 'Smithsonian Channel', x: 959, y: 554, w: 243, h: 136 },

  { id: 'francetvdistribution', label: 'france.tv distribution', x: 1449, y: 651, w: 268, h: 43 },

  { id: 'viacomcbs', label: 'ViacomCBS', x: 192, y: 802, w: 318, h: 51 },
  { id: 'natgeo', label: 'National Geographic Channel', x: 597, y: 743, w: 306, h: 118 },
  { id: 'sbs', label: 'SBS', x: 978, y: 718, w: 263, h: 172 },
  { id: 'showtime', label: 'Showtime', x: 1367, y: 743, w: 330, h: 126 },

  { id: 'rtbf', label: 'rtbf.be', x: 210, y: 925, w: 227, h: 71 },
  { id: 'chanel', label: 'Chanel', x: 541, y: 893, w: 192, h: 128 },
  { id: 'zdf', label: 'ZDF', x: 822, y: 910, w: 176, h: 104 },
  { id: 'discovery', label: 'Discovery Channel', x: 1081, y: 922, w: 351, h: 84 },
  { id: 'nhk', label: 'NHK', x: 1490, y: 918, w: 240, h: 78 },
]

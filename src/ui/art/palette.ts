// Picture-book colors. Flat fills, no outlines.
// Shapes use fill="var(--name)", and illustrationSvg sets these on the
// <svg>, so a theme can override any of them from CSS.
// tests/artContrast.test.ts checks ARC and the cue shapes stay 3:1
// against what sits behind them.

export const palette = {
  // Sky and weather
  sky: '#428fc4',
  cloud: '#ffffff',
  duskHigh: '#6a63ad',
  duskMiddle: '#c6b6e4',
  duskLow: '#f8cdb0',
  cloudDusk: '#f2d0e0',
  star: '#fff3c4',
  moon: '#f6e7a6',
  bird: '#3a4a6b',

  // Garden ground
  hillFar: '#8fc67a',
  hill: '#7aba62',
  grass: '#6aae52',
  grassDark: '#4a8f3c',
  hillFarDusk: '#86a879',
  hillDusk: '#73a363',
  grassDusk: '#679a57',
  leaf: '#3b7f33',
  soil: '#8a5a34',
  soilDark: '#6e4426',
  sprout: '#8ee05a',
  flower: '#ffffff',
  flowerMiddle: '#ffd23f',

  // ARC: weathered silver-white paint lit from the upper left, with a slate
  // shadow side, glowing blue eyes, a teal repair patch, and spring arms
  arcPaint: '#e8e4da',
  arcPaintDark: '#8d939b',
  arcRust: '#b0683a',
  arcScratch: '#a8a59c',
  arcShade: '#3a3f48',
  arcSpring: '#363a43',
  arcSpringRib: '#7d8494',
  arcPatch: '#2f7f7a',
  arcScreen: '#1e2a3a',
  arcEye: '#5fd0ff',
  arcPanel: '#f6e7c8',
  arcTread: '#2e2e38',
  arcWheel: '#6b6b7a',
  arcLightOff: '#6b5f45',
  arcLightOn: '#ffd23f',
  arcLeaf: '#4f9e44',
  arcMoss: '#6fbf55',
  lampGlow: '#fbe7a1',

  // Things in the garden
  chip: '#0b3f29',
  chipGold: '#ffd23f',
  chipLabel: '#f6e7c8',
  cardBack: '#2c3e66',
  cardMark: '#f6e7c8',
  shedWall: '#e3c28f',
  shedPlank: '#d1ab72',
  shedRoof: '#4c6b7a',
  shedRoofEdge: '#3b5563',
  shedDoor: '#8a5a2e',
  shedDoorDark: '#6b4423',
  shedInside: '#3b2a1e',
  shedWindow: '#9fd2e3',
  seedBox: '#d98c3f',
  ship: '#33373f',
  shipShade: '#272a31',
  shipWindow: '#bfe3f7',
  shipStripe: '#e8664a',
  shipRamp: '#8b919e',
  shipInside: '#ffe3a3',
  shadow: '#000000',
} as const;

export type PaletteName = keyof typeof palette;

/** CSS custom properties for the <svg> style attribute. */
export const paletteStyle = Object.entries(palette)
  .map(([name, value]) => `--${name}:${value}`)
  .join(';');

/** Shorthand for a fill from the palette. */
export const fill = (name: PaletteName) => `fill="var(--${name})"`;

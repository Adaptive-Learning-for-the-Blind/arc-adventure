// Picture-book colors. Flat fills, no outlines.
// Shapes use fill="var(--name)", and illustrationSvg sets these on the
// <svg>, so a theme can override any of them from CSS.
// tests/artContrast.test.ts checks ARC and the cue shapes stay 3:1
// against what sits behind them.

export const palette = {
  // Sky and weather
  sky: '#5aaee0',
  cloud: '#ffffff',
  duskHigh: '#6a63ad',
  duskMiddle: '#c6b6e4',
  duskLow: '#f8cdb0',
  cloudDusk: '#f2d0e0',
  star: '#fff3c4',
  moon: '#f6e7a6',
  bird: '#3a4a6b',

  // Garden ground
  hillFar: '#bfe6a6',
  hill: '#ade08d',
  grass: '#9fd97c',
  grassDark: '#6fbf55',
  hillFarDusk: '#b3c99a',
  hillDusk: '#9fcf86',
  grassDusk: '#92cc76',
  leaf: '#4f9e44',
  soil: '#8a5a34',
  soilDark: '#6e4426',
  sprout: '#8ee05a',
  flower: '#ffffff',
  flowerMiddle: '#ffd23f',

  // ARC: weathered orange paint with a teal repair patch
  arcPaint: '#8e3314',
  arcPaintDark: '#6a2610',
  arcRust: '#4f1c0a',
  arcPatch: '#2f7f7a',
  arcScreen: '#1e2a3a',
  arcEye: '#e9fbff',
  arcPanel: '#f6e7c8',
  arcTread: '#3a3a46',
  arcWheel: '#6b6b7a',
  arcLightOff: '#8b7d5c',
  arcLightOn: '#ffd23f',
  arcLeaf: '#4f9e44',
  arcMoss: '#6fbf55',
  lampGlow: '#fbe7a1',

  // Things in the garden
  chip: '#185c3f',
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
  ship: '#ffffff',
  shipShade: '#dfe3f2',
  shipWindow: '#4f7fbf',
  shipStripe: '#e8664a',
  shipRamp: '#9aa0bd',
  shipInside: '#3a3f5c',
  shadow: '#000000',
} as const;

export type PaletteName = keyof typeof palette;

/** CSS custom properties for the <svg> style attribute. */
export const paletteStyle = Object.entries(palette)
  .map(([name, value]) => `--${name}:${value}`)
  .join(';');

/** Shorthand for a fill from the palette. */
export const fill = (name: PaletteName) => `fill="var(--${name})"`;

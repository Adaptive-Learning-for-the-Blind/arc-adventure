import { describe, expect, it } from 'vitest';
import { palette, type PaletteName } from '../src/ui/art/palette';

// WCAG 1.4.11: ARC and the shapes that carry a cue need 3:1 against
// whatever sits behind them.

const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};

const ratio = (a: PaletteName, b: PaletteName) => {
  const [hi, lo] = [luminance(palette[a]), luminance(palette[b])].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
};

// ARC never reaches the top band of the evening sky (duskHigh, y < 56).
const gardenBehindArc: PaletteName[] = [
  'sky', 'cloud', 'hillFar', 'hill', 'grass',
  'duskMiddle', 'duskLow', 'cloudDusk', 'hillFarDusk', 'hillDusk', 'grassDusk',
];

const pairs: Array<[string, PaletteName, PaletteName[]]> = [
  ['ARC body', 'arcPaint', gardenBehindArc],
  ['ARC arms', 'arcPaintDark', gardenBehindArc],
  ['ARC treads and hands', 'arcTread', gardenBehindArc],
  ['ARC face screen on its body', 'arcScreen', ['arcPanel']],
  ['ARC lit lights on its panel and screen', 'arcLightOn', ['arcScreen', 'arcPaint']],
  ['held chip', 'chip', ['sky', 'cloud', 'hillFar']],
  ['dropped cards', 'cardBack', ['grass', 'hill']],
  ['open shed doorway', 'shedInside', ['shedWall']],
  ['shed door', 'shedDoor', ['shedWall', 'grass']],
  ['sprouts', 'sprout', ['soil']],
  ['moon', 'moon', ['duskHigh']],
  ['ship', 'ship', ['sky', 'hillFar', 'hill', 'grass']],
];

describe('art contrast', () => {
  for (const [what, shape, behind] of pairs) {
    it(`${what} stands out 3:1`, () => {
      for (const back of behind) expect(ratio(shape, back), `${shape} on ${back}`).toBeGreaterThanOrEqual(3);
    });
  }
});

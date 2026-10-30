import type { ArtId } from '../../domain/story';
import { arc } from './arc';
import { fill, type PaletteName } from './palette';

// Level 1: The Garden. Canvas is 320 x 200; ARC's wheels sit at y = 188.
// Each scene stacks the same layers, back to front:
//   sky -> hills -> props -> ARC -> foreground grass
// Motion follows the soundscape:
//   garden ambience (birds, breeze, leaves): grass and tree sway, birds fly by
//   waiting ambience (crickets, clock): the sky turns to evening, stars come out
//   creaky door cue: the shed door swings open
//   chime cue: sprouts pop up and ARC's lights blink
// Nothing here hints at a puzzle answer: no seed pictures, no card faces,
// no sun, water, or ocean.

const baseline = 188;

type Time = 'day' | 'dusk';

const colors: Record<Time, Record<'cloud' | 'hillFar' | 'hill' | 'grass', PaletteName>> = {
  day: { cloud: 'cloud', hillFar: 'hillFar', hill: 'hill', grass: 'grass' },
  dusk: { cloud: 'cloudDusk', hillFar: 'hillFarDusk', hill: 'hillDusk', grass: 'grassDusk' },
};

const cloud = (x: number, y: number, color: PaletteName, drift: boolean) => `
  <g class="${drift ? 'drift' : ''}" ${fill(color)}>
    <rect x="${x}" y="${y}" width="56" height="14" rx="7"/>
    <circle cx="${x + 18}" cy="${y + 2}" r="11"/>
    <circle cx="${x + 34}" cy="${y - 2}" r="14"/>
  </g>`;

const sky = (time: Time) =>
  time === 'day'
    ? `<rect width="320" height="200" ${fill('sky')}/>`
    : `<rect width="320" height="200" ${fill('duskLow')}/>
       <rect width="320" height="112" ${fill('duskMiddle')}/>
       <rect width="320" height="56" ${fill('duskHigh')}/>`;

const tree = (x: number, y: number, sway: boolean) => `
  <rect x="${x - 3}" y="${y - 24}" width="6" height="26" ${fill('soilDark')}/>
  <g class="${sway ? 'swayTree' : ''}" ${fill('leaf')}>
    <circle cx="${x}" cy="${y - 34}" r="15"/>
    <circle cx="${x - 12}" cy="${y - 26}" r="10"/>
    <circle cx="${x + 12}" cy="${y - 26}" r="10"/>
  </g>`;

/** Sky, clouds, hills, a tree, and the meadow. Everything behind the props. */
const backdrop = (time: Time, ambient: boolean) => {
  const c = colors[time];
  return `
    ${sky(time)}
    ${cloud(34, 34, c.cloud, ambient)}
    ${cloud(196, 22, c.cloud, ambient)}
    <path d="M0 122 C50 104 100 112 150 118 S250 100 320 110 V200 H0z" ${fill(c.hillFar)}/>
    ${tree(276, 108, ambient)}
    <path d="M0 146 C60 132 120 140 170 146 S270 132 320 140 V200 H0z" ${fill(c.hill)}/>
    <path d="M0 166 C80 160 240 160 320 166 V200 H0z" ${fill(c.grass)}/>`;
};

/** The evening sky fades in over the day: moon rises, stars come out. */
const nightfall = () => `
  <g class="nightfall">
    ${backdrop('dusk', false)}
    <g class="moonRise">
      <circle cx="252" cy="30" r="12" ${fill('moon')}/>
      <circle cx="258" cy="25" r="10" ${fill('duskHigh')}/>
    </g>
    <g ${fill('star')}>
      ${[
        [40, 18],
        [92, 40],
        [150, 14],
        [196, 44],
        [300, 22],
        [120, 50],
      ]
        .map(([x, y], i) => `<circle class="twinkle" style="animation-delay:${-i * 0.9}s" cx="${x}" cy="${y}" r="2"/>`)
        .join('')}
    </g>
  </g>`;

/** Three blades of tall grass. */
const tuft = (x: number, y: number, h: number, color: PaletteName, sway: boolean, delay = 0) => `
  <path class="${sway ? 'sway' : ''}" style="animation-delay:${-delay}s" ${fill(color)} d="
    M${x - 7} ${y} C${x - 8} ${y - h * 0.5} ${x - 12} ${y - h * 0.8} ${x - 15} ${y - h} C${x - 6} ${y - h * 0.7} ${x - 3} ${y - h * 0.4} ${x - 1} ${y} Z
    M${x - 3} ${y} C${x - 3} ${y - h * 0.6} ${x - 1} ${y - h * 1.1} ${x + 1} ${y - h * 1.25} C${x + 3} ${y - h} ${x + 4} ${y - h * 0.5} ${x + 4} ${y} Z
    M${x + 2} ${y} C${x + 5} ${y - h * 0.4} ${x + 9} ${y - h * 0.7} ${x + 15} ${y - h * 0.9} C${x + 11} ${y - h * 0.6} ${x + 9} ${y - h * 0.3} ${x + 8} ${y} Z"/>`;

const flower = (x: number, y: number) => `
  <rect x="${x - 1}" y="${y}" width="2" height="10" ${fill('leaf')}/>
  <g ${fill('flower')}>
    ${[0, 72, 144, 216, 288].map((deg) => `<circle cx="${x + 4 * Math.sin((deg * Math.PI) / 180)}" cy="${y - 4 * Math.cos((deg * Math.PI) / 180)}" r="2.6"/>`).join('')}
  </g>
  <circle cx="${x}" cy="${y}" r="2" ${fill('flowerMiddle')}/>`;

/** Tall grass and flowers along the bottom edge, kept clear of ARC. */
const meadow = (sway: boolean, gaps: Array<[number, number]>) => {
  const spots: Array<[number, number, PaletteName]> = [
    [8, 30, 'grassDark'],
    [30, 22, 'grassDark'],
    [52, 26, 'leaf'],
    [148, 20, 'grassDark'],
    [172, 26, 'leaf'],
    [196, 18, 'grassDark'],
    [262, 24, 'grassDark'],
    [286, 30, 'leaf'],
    [310, 24, 'grassDark'],
  ];
  const open = (x: number) => !gaps.some(([from, to]) => x >= from && x <= to);
  return `
    ${spots
      .filter(([x]) => open(x))
      .map(([x, h, color], i) => tuft(x, 200, h, color, sway, i * 0.7))
      .join('')}
    ${[[18, 182], [164, 186], [300, 180]]
      .filter(([x]) => open(x!))
      .map(([x, y]) => flower(x!, y!))
      .join('')}`;
};

const birds = () => `
  <g class="flyBy" fill="none" stroke="var(--bird)" stroke-width="2.2" stroke-linecap="round">
    <path d="M110 58 q4 -4 8 0 q4 -4 8 0"/>
    <path d="M132 48 q3 -3 6 0 q3 -3 6 0"/>
  </g>`;

/** The landing ship, sitting in the grass with its ramp down. */
const ship = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-42 -16 L-58 12 h9 L-34 -12z M42 -16 L58 12 h-9 L34 -12z" ${fill('shipShade')}/>
    <path d="M-50 0 C-50 -70 -30 -112 0 -112 C30 -112 50 -70 50 0 Z" ${fill('ship')}/>
    <path d="M0 -112 C30 -112 50 -70 50 0 H20 C24 -50 16 -96 0 -112Z" ${fill('shipShade')}/>
    <path d="M-48.6 -36 H48.6 L49.6 -26 H-49.6Z" ${fill('shipStripe')}/>
    <circle cx="-22" cy="-66" r="7" ${fill('shipWindow')}/>
    <circle cx="0" cy="-72" r="8" ${fill('shipWindow')}/>
    <circle cx="22" cy="-66" r="7" ${fill('shipWindow')}/>
    <circle cx="0" cy="-116" r="5" ${fill('shipStripe')}/>
    <path d="M-15 0 V-14 a15 15 0 0 1 30 0 V0 Z" ${fill('shipInside')}/>
    <path d="M-15 0 H15 L26 12 H-26 Z" ${fill('shipRamp')}/>
  </g>`;

/**
 * The small wooden shed. Its door swings open with the creak and stays
 * open; with reduced motion it is simply open.
 */
const shed = (x: number, y: number) => `
  <g transform="translate(${x} ${y})">
    <rect x="0" y="-66" width="100" height="66" ${fill('shedWall')}/>
    <g ${fill('shedPlank')}>
      ${[14, 30, 46, 62, 78].map((px) => `<rect x="${px}" y="-66" width="3" height="66"/>`).join('')}
    </g>
    <path d="M-10 -62 L50 -102 L110 -62 Z" ${fill('shedRoof')}/>
    <path d="M-10 -62 H110 V-56 H-10Z" ${fill('shedRoofEdge')}/>
    <rect x="12" y="-46" width="22" height="20" rx="2" ${fill('shedWindow')}/>
    <path d="M22 -46 h2 v20 h-2z M12 -37 h22 v2 h-22z" ${fill('shedWall')}/>

    <!-- inside, seen through the open door: a shelf and a box of seed packets -->
    <rect x="54" y="-48" width="34" height="48" ${fill('shedInside')}/>
    <rect x="56" y="-30" width="30" height="3" ${fill('shedDoorDark')}/>
    <rect x="60" y="-42" width="22" height="12" rx="2" ${fill('seedBox')}/>
    <g ${fill('chipLabel')}>
      <rect x="63" y="-46" width="5" height="7" rx="1"/><rect x="69" y="-47" width="5" height="8" rx="1"/><rect x="75" y="-45" width="5" height="6" rx="1"/>
    </g>

    <g class="shedDoor">
      <rect x="54" y="-48" width="34" height="48" ${fill('shedDoor')}/>
      <path d="M57 -44 L85 -6 L85 -2 L57 -40z" ${fill('shedDoorDark')}/>
      <circle cx="82" cy="-24" r="2.5" ${fill('shedDoorDark')}/>
    </g>
  </g>`;

/** A dug garden bed. sprouts: none yet, popping up now (chime), or already up. */
const bed = (x: number, y: number, sprouts: 'none' | 'grow' | 'grown') => `
  <path d="M${x - 50} ${y} Q${x} ${y - 24} ${x + 50} ${y} Z" ${fill('soil')}/>
  <path d="M${x - 30} ${y - 6} q4 -3 8 0 M${x - 4} ${y - 10} q4 -3 8 0 M${x + 22} ${y - 6} q4 -3 8 0" fill="none"
    stroke="var(--soilDark)" stroke-width="2.5" stroke-linecap="round"/>
  ${
    sprouts === 'none'
      ? ''
      : [-26, 0, 26]
          .map((dx, i) => {
            const sx = x + dx;
            const sy = y - (dx === 0 ? 11 : 6);
            return `
              <g class="${sprouts === 'grow' ? 'sproutGrow' : ''}" style="animation-delay:${0.2 + i * 0.18}s" ${fill('sprout')}>
                <rect x="${sx - 1.5}" y="${sy - 16}" width="3" height="16" rx="1.5"/>
                <path d="M${sx} ${sy - 12} q-12 -2 -13 -12 q11 1 13 12z"/>
                <path d="M${sx} ${sy - 15} q12 -2 13 -12 q-11 1 -13 12z"/>
              </g>`;
          })
          .join('')
  }`;

/** The four dropped cards, face down so they give nothing away. */
const droppedCards = () =>
  [
    [190, 172, -14],
    [224, 180, 8],
    [262, 172, -4],
    [296, 180, 16],
  ]
    .map(
      ([x, y, deg]) => `
      <g transform="translate(${x} ${y}) rotate(${deg})">
        <rect x="-14" y="-18" width="28" height="36" rx="4" ${fill('cardBack')}/>
        <path d="M0 9 C-9 2 -8 -8 0 -12 C8 -8 9 2 0 9Z" ${fill('cardMark')}/>
      </g>`,
    )
    .join('');

const day = (...layers: string[]) => `${backdrop('day', true)}${birds()}${layers.join('')}`;

export const gardenArt: Partial<Record<ArtId, string>> = {
  title: day(
    ship(64, 146, 0.5),
    arc({ x: 180, y: baseline, scale: 0.95, pose: 'wave' }),
    meadow(true, [[130, 230]]),
  ),

  landing: day(
    ship(76, 172),
    arc({ x: 226, y: baseline, scale: 0.95, pose: 'holdChip', flip: true }),
    meadow(true, [[30, 120], [176, 276]]),
  ),

  shed: `
    ${backdrop('day', true)}${birds()}
    ${shed(180, 174)}
    ${arc({ x: 94, y: baseline, scale: 0.95, pose: 'think' })}
    ${meadow(true, [[44, 300]])}`,

  cards: day(
    arc({ x: 96, y: baseline, scale: 0.95, pose: 'worried' }),
    droppedCards(),
    meadow(false, [[44, 320]]),
  ),

  wait: `
    ${backdrop('day', false)}
    ${nightfall()}
    ${bed(232, 184, 'none')}
    ${arc({ x: 112, y: baseline, scale: 0.95, pose: 'wait' })}
    ${meadow(false, [[60, 290]])}`,

  needs: day(
    bed(232, 184, 'none'),
    arc({ x: 112, y: baseline, scale: 0.95, pose: 'talk' }),
    meadow(true, [[60, 290]]),
  ),

  sprouts: day(
    bed(232, 184, 'grow'),
    arc({ x: 112, y: baseline, scale: 0.95, pose: 'proud', lights: 'blink' }),
    meadow(true, [[60, 290]]),
  ),

  chip: day(
    bed(232, 184, 'grown'),
    arc({ x: 112, y: baseline, scale: 0.95, pose: 'curious' }),
    meadow(true, [[60, 290]]),
  ),
};

import { fill } from './palette';

// ARC: a small, weathered garden robot on treads.
// Drawn around its own origin: (0, 0) is the ground under its middle,
// and it stands about 126 units tall at scale 1. Build a pose by
// picking arms, eyes, and a mouth; the body never changes.

type Point = readonly [number, number];

/** An arm from the shoulder, bending at the elbow, ending in a round hand. */
interface Arm {
  elbow: Point;
  hand: Point;
}

type Eyes = 'open' | 'happy' | 'wide' | 'lookUp' | 'lookDown' | 'lookSide';
type Mouth = 'smile' | 'talk' | 'grin' | 'o' | 'flat' | 'wobble';

interface Pose {
  left: Arm;
  right: Arm;
  eyes: Eyes;
  mouth: Mouth;
  /** ARC holds a memory chip in its right hand. */
  holdsChip?: boolean;
  /** Extra class on the right arm, for the wave. */
  rightArmClass?: string;
}

export type ArcPose = 'wave' | 'holdChip' | 'think' | 'worried' | 'wait' | 'talk' | 'proud' | 'curious' | 'nervous';

const relaxed = (side: 1 | -1): Arm => ({ elbow: [side * 37, -40], hand: [side * 38, -26] });

const poses: Record<ArcPose, Pose> = {
  // Title screen: hello!
  wave: {
    left: relaxed(-1),
    right: { elbow: [46, -62], hand: [48, -84] },
    eyes: 'happy',
    mouth: 'grin',
    rightArmClass: 'arcWave',
  },
  // 1.1: "ARC holds up a chip."
  holdChip: {
    left: { elbow: [-40, -44], hand: [-46, -54] },
    right: { elbow: [44, -64], hand: [42, -88] },
    eyes: 'happy',
    mouth: 'talk',
    holdsChip: true,
  },
  // 1.2: "I think. Probably."
  think: {
    left: relaxed(-1),
    right: { elbow: [48, -64], hand: [36, -84] },
    eyes: 'lookUp',
    mouth: 'wobble',
  },
  // 1.3: "Oh no! I dropped them."
  worried: {
    left: { elbow: [-44, -56], hand: [-33, -76] },
    right: { elbow: [44, -56], hand: [33, -76] },
    eyes: 'wide',
    mouth: 'o',
  },
  // 1.4: waiting, watching the soil.
  wait: {
    left: { elbow: [-32, -32], hand: [-9, -24] },
    right: { elbow: [32, -32], hand: [9, -24] },
    eyes: 'lookDown',
    mouth: 'flat',
  },
  // 1.5: chatty, hands open.
  talk: {
    left: { elbow: [-40, -42], hand: [-46, -52] },
    right: { elbow: [40, -42], hand: [46, -52] },
    eyes: 'open',
    mouth: 'talk',
  },
  // 1.6: "I remember now!"
  proud: {
    left: { elbow: [-44, -40], hand: [-28, -28] },
    right: { elbow: [44, -40], hand: [28, -28] },
    eyes: 'happy',
    mouth: 'grin',
  },
  // 1.7: "Oh! Another one!"
  curious: {
    left: { elbow: [-36, -36], hand: [-30, -26] },
    right: { elbow: [44, -64], hand: [42, -88] },
    eyes: 'wide',
    mouth: 'o',
    holdsChip: true,
  },
  // 2.1: "I do not like water."
  nervous: {
    left: { elbow: [-34, -34], hand: [-19, -46] },
    right: { elbow: [34, -34], hand: [19, -46] },
    eyes: 'lookSide',
    mouth: 'wobble',
  },
};

export interface ArcOptions {
  x: number;
  y: number;
  scale?: number;
  pose: ArcPose;
  /** Mirror ARC to face left. */
  flip?: boolean;
  /**
   * off: dim, the usual state.
   * blink: blinks three times, then stays lit ("ARC's lights blink").
   * With reduced motion they are simply lit.
   */
  lights?: 'off' | 'blink';
}

const arm = ({ elbow, hand }: Arm, side: 1 | -1, extraClass = '') => `
  <g class="${extraClass}">
    <path d="M${side * 25} -52 Q${elbow[0]} ${elbow[1]} ${hand[0]} ${hand[1]}" fill="none"
      stroke="var(--arcPaintDark)" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${hand[0]}" cy="${hand[1]}" r="6" ${fill('arcTread')}/>
  </g>`;

const eyes = (kind: Eyes) => {
  const round = (dx: number, dy: number, r = 5) =>
    `<g class="arcBlink">
      <circle cx="${-10 + dx}" cy="${-87 + dy}" r="${r}" ${fill('arcEye')}/>
      <circle cx="${10 + dx}" cy="${-87 + dy}" r="${r}" ${fill('arcEye')}/>
    </g>`;
  switch (kind) {
    case 'open':
      return round(0, 0);
    case 'wide':
      return round(0, -1, 6.5);
    case 'lookUp':
      return round(3, -3);
    case 'lookDown':
      return round(0, 3, 4.5);
    case 'lookSide':
      return round(-4, 0, 4.5);
    case 'happy':
      return `<path d="M-15 -85 q5 -8 10 0 M5 -85 q5 -8 10 0" fill="none" stroke="var(--arcEye)" stroke-width="3.5" stroke-linecap="round"/>`;
  }
};

const mouth = (kind: Mouth) => {
  const line = (d: string) => `<path d="${d}" fill="none" stroke="var(--arcEye)" stroke-width="3" stroke-linecap="round"/>`;
  switch (kind) {
    case 'smile':
      return line('M-6 -79 q6 5 12 0');
    case 'talk':
      return `<ellipse cx="0" cy="-77.5" rx="5" ry="3.5" ${fill('arcEye')}/>`;
    case 'grin':
      return `<path d="M-8 -80 h16 a8 6 0 0 1 -16 0z" ${fill('arcEye')}/>`;
    case 'o':
      return `<circle cx="0" cy="-77.5" r="3" ${fill('arcEye')}/>`;
    case 'flat':
      return line('M-5 -78 h10');
    case 'wobble':
      return line('M-7 -77 q2.5 -3 5 0 t5 0 t5 0');
  }
};

/** A memory chip, held up in ARC's hand. The label is blank: the story text says what it reads. */
export const heldChip = (x: number, y: number) => `
  <g transform="translate(${x} ${y}) rotate(-10)">
    <rect x="-10" y="-26" width="20" height="25" rx="3" ${fill('chip')}/>
    <rect x="-6.5" y="-22" width="13" height="8" rx="1.5" ${fill('chipLabel')}/>
    <path d="M-6 -1 v4 M-2 -1 v4 M2 -1 v4 M6 -1 v4" stroke="var(--chipGold)" stroke-width="2.5" stroke-linecap="round"/>
  </g>`;

/** ARC's three chest lights and its antenna bulb. */
const lights = (state: 'off' | 'blink') => {
  const cls = state === 'blink' ? 'arcLight arcLightBlink' : 'arcLight';
  const color = state === 'blink' ? 'arcLightOn' : 'arcLightOff';
  return `
    <g class="${cls}" ${fill(color)}>
      <circle cx="-9" cy="-41" r="4"/><circle cx="0" cy="-41" r="4"/><circle cx="9" cy="-41" r="4"/>
      <circle cx="0" cy="-125" r="5"/>
    </g>`;
};

export function arc({ x, y, scale = 1, pose, flip = false, lights: lightState = 'off' }: ArcOptions): string {
  const p = poses[pose];
  const shake = pose === 'nervous' ? ' arcShake' : '';
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})">
    <ellipse cx="0" cy="0" rx="40" ry="5" ${fill('shadow')} opacity="0.14"/>
    <g class="arc${shake}">
      <!-- antenna with a little leaf -->
      <rect x="-1.5" y="-124" width="3" height="22" ${fill('arcPaintDark')}/>
      <path d="M1.5 -112 q9 -10 17 -4 q-8 9 -17 4z" ${fill('arcLeaf')}/>

      <!-- treads -->
      <rect x="-34" y="-18" width="68" height="18" rx="9" ${fill('arcTread')}/>
      <circle cx="-22" cy="-9" r="5" ${fill('arcWheel')}/>
      <circle cx="0" cy="-9" r="5" ${fill('arcWheel')}/>
      <circle cx="22" cy="-9" r="5" ${fill('arcWheel')}/>

      <!-- body: old paint, a pocket, rust, and a teal repair patch -->
      <rect x="-27" y="-63" width="54" height="50" rx="16" ${fill('arcPaint')}/>
      <path d="M-24 -28 h14 v7 a4 4 0 0 1 -4 4 h-6 a4 4 0 0 1 -4 -4z" ${fill('arcPaintDark')}/>
      <g transform="translate(17 -24) rotate(9)">
        <rect x="-6" y="-6" width="12" height="11" rx="2" ${fill('arcPatch')}/>
        <circle cx="-3" cy="-3" r="1" ${fill('arcPanel')}/><circle cx="3" cy="-3" r="1" ${fill('arcPanel')}/>
        <circle cx="-3" cy="2" r="1" ${fill('arcPanel')}/><circle cx="3" cy="2" r="1" ${fill('arcPanel')}/>
      </g>
      <circle cx="-19" cy="-58" r="2.6" ${fill('arcRust')}/>
      <circle cx="-15" cy="-60" r="1.4" ${fill('arcRust')}/>
      <circle cx="21" cy="-56" r="1.8" ${fill('arcRust')}/>
      <rect x="-17" y="-53" width="34" height="22" rx="7" ${fill('arcPanel')}/>
      ${lights(lightState)}

      <!-- head -->
      <rect x="-6" y="-70" width="12" height="9" ${fill('arcPaintDark')}/>
      <circle cx="-32" cy="-85" r="5.5" ${fill('arcPaintDark')}/>
      <circle cx="32" cy="-85" r="5.5" ${fill('arcPaintDark')}/>
      <rect x="-32" y="-105" width="64" height="38" rx="18" ${fill('arcPaint')}/>
      <circle cx="24" cy="-72" r="2" ${fill('arcRust')}/>
      <path d="M-28 -99 a8 8 0 0 1 9 -7 a7 7 0 0 1 11 -1 a5 5 0 0 1 6 4z" ${fill('arcMoss')}/>
      <rect x="-24" y="-99" width="48" height="27" rx="11" ${fill('arcScreen')}/>
      ${eyes(p.eyes)}
      ${mouth(p.mouth)}
      ${pose === 'nervous' ? `<path d="M28 -100 q4 6 0 8 q-4 -2 0 -8z" ${fill('arcEye')}/>` : ''}

      <!-- arms go last so hands can sit in front of the body -->
      ${arm(p.left, -1)}
      ${arm(p.right, 1, p.rightArmClass)}
      ${p.holdsChip ? heldChip(p.right.hand[0], p.right.hand[1] - 2) : ''}
    </g>
  </g>`;
}

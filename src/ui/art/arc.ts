import { fill } from './palette';

// ARC: a small, round, weathered garden robot. A ball of a body on short
// treads, a round head with big lens eyes and a little tube snout, springy
// arms, and a leaf growing by its antenna. Worn silver-white paint, lit
// from the upper left, with a slate shadow side that keeps its shape clear
// against light hills and the blue sky.
// Drawn around its own origin: (0, 0) is the ground under its middle,
// and it stands about 134 units tall at scale 1. Build a pose by
// picking arms, eyes, and a snout shape; the body never changes.

type Point = readonly [number, number];

/** A spring arm from the shoulder, bending at the elbow, ending in a round hand. */
interface Arm {
  elbow: Point;
  hand: Point;
}

type Eyes = 'open' | 'happy' | 'wide' | 'lookUp' | 'lookDown' | 'lookSide';
/** The opening at the end of ARC's snout, which is how it talks. */
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

// A big round head on a smaller round body.
const shoulderX = 21;
const shoulderY = -40;
const head = { y: -92, r: 30 };
const body = { y: -36, r: 22 };
const eyeX = 12;
const eyeY = -96;

const relaxed = (side: 1 | -1): Arm => ({ elbow: [side * 34, -30], hand: [side * 36, -18] });

const poses: Record<ArcPose, Pose> = {
  // Title screen: hello!
  wave: {
    left: relaxed(-1),
    right: { elbow: [50, -58], hand: [50, -86] },
    eyes: 'happy',
    mouth: 'grin',
    rightArmClass: 'arcWave',
  },
  // 1.1: "ARC holds up a chip."
  holdChip: {
    left: { elbow: [-40, -36], hand: [-48, -46] },
    right: { elbow: [52, -60], hand: [44, -88] },
    eyes: 'happy',
    mouth: 'talk',
    holdsChip: true,
  },
  // 1.2: "I think. Probably."
  think: {
    left: relaxed(-1),
    right: { elbow: [54, -64], hand: [32, -104] },
    eyes: 'lookUp',
    mouth: 'wobble',
  },
  // 1.3: "Oh no! I dropped them."
  worried: {
    left: { elbow: [-46, -52], hand: [-30, -78] },
    right: { elbow: [46, -52], hand: [30, -78] },
    eyes: 'wide',
    mouth: 'o',
  },
  // 1.4: waiting, watching the soil.
  wait: {
    left: { elbow: [-30, -22], hand: [-10, -18] },
    right: { elbow: [30, -22], hand: [10, -18] },
    eyes: 'lookDown',
    mouth: 'flat',
  },
  // 1.5: chatty, hands open.
  talk: {
    left: { elbow: [-40, -34], hand: [-48, -46] },
    right: { elbow: [40, -34], hand: [48, -46] },
    eyes: 'open',
    mouth: 'talk',
  },
  // 1.6: "I remember now!"
  proud: {
    left: { elbow: [-42, -30], hand: [-22, -20] },
    right: { elbow: [42, -30], hand: [22, -20] },
    eyes: 'happy',
    mouth: 'grin',
  },
  // 1.7: "Oh! Another one!"
  curious: {
    left: { elbow: [-34, -28], hand: [-30, -16] },
    right: { elbow: [52, -60], hand: [44, -88] },
    eyes: 'wide',
    mouth: 'o',
    holdsChip: true,
  },
  // 2.1: "I do not like water."
  nervous: {
    left: { elbow: [-32, -24], hand: [-14, -40] },
    right: { elbow: [32, -24], hand: [14, -40] },
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

/** A coiled spring arm: a dark core with lighter coil ribs on top. */
const arm = ({ elbow, hand }: Arm, side: 1 | -1, extraClass = '') => {
  const d = `M${side * shoulderX} ${shoulderY} Q${elbow[0]} ${elbow[1]} ${hand[0]} ${hand[1]}`;
  return `
  <g class="${extraClass}">
    <path d="${d}" fill="none" stroke="var(--arcSpring)" stroke-width="8" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="var(--arcSpringRib)" stroke-width="8" stroke-dasharray="1.6 3.4"/>
    <circle cx="${hand[0]}" cy="${hand[1]}" r="6.5" ${fill('arcTread')}/>
  </g>`;
};

/** Big round lenses in pale rims. The dark lens stays; the light inside changes with the mood. */
const eyes = (kind: Eyes) => {
  const sockets = [-eyeX, eyeX]
    .map((cx) => `<circle cx="${cx}" cy="${eyeY}" r="11" ${fill('arcPaintDark')}/><circle cx="${cx}" cy="${eyeY}" r="9" ${fill('arcScreen')}/>`)
    .join('');
  const round = (dx: number, dy: number, r = 5.5) =>
    `<g class="arcBlink">
      <circle cx="${-eyeX + dx}" cy="${eyeY + dy}" r="${r}" ${fill('arcEye')}/>
      <circle cx="${eyeX + dx}" cy="${eyeY + dy}" r="${r}" ${fill('arcEye')}/>
    </g>`;
  const inside = (() => {
    switch (kind) {
      case 'open':
        return round(0, 0);
      case 'wide':
        return round(0, 0, 7);
      case 'lookUp':
        return round(2, -3);
      case 'lookDown':
        return round(0, 3, 5);
      case 'lookSide':
        return round(-3, 0, 5);
      case 'happy':
        return `<path d="M${-eyeX - 5} ${eyeY + 2} q5 -8 10 0 M${eyeX - 5} ${eyeY + 2} q5 -8 10 0" fill="none" stroke="var(--arcEye)" stroke-width="3.4" stroke-linecap="round"/>`;
    }
  })();
  return sockets + inside;
};

/** The snout: a short tube under the eyes. Its open end changes shape as ARC talks. */
const snout = (kind: Mouth) => {
  const opening: Record<Mouth, [number, number]> = {
    smile: [5.5, 3],
    talk: [5.5, 4.5],
    grin: [6.5, 4.5],
    o: [4, 4],
    flat: [5.5, 1.6],
    wobble: [4.5, 2],
  };
  const [rx, ry] = opening[kind];
  return `
    <rect x="-7" y="-84" width="14" height="9" ${fill('arcScratch')}/>
    <ellipse cx="0" cy="-75" rx="9" ry="6" ${fill('arcPaintDark')}/>
    <ellipse cx="0" cy="-75" rx="${rx}" ry="${ry}" ${fill('arcScreen')}/>`;
};

/** A memory chip, held up in ARC's hand. The label is blank: the story text says what it reads. */
export const heldChip = (x: number, y: number) => `
  <g transform="translate(${x} ${y}) rotate(-10)">
    <rect x="-10" y="-26" width="20" height="25" rx="3" ${fill('chip')}/>
    <rect x="-6.5" y="-22" width="13" height="8" rx="1.5" ${fill('chipLabel')}/>
    <path d="M-6 -1 v4 M-2 -1 v4 M2 -1 v4 M6 -1 v4" stroke="var(--chipGold)" stroke-width="2.5" stroke-linecap="round"/>
  </g>`;

/** ARC's three chest lights and its antenna bulb, each set in a dark mount so lit and dim both show. */
const lights = (state: 'off' | 'blink') => {
  const cls = state === 'blink' ? 'arcLight arcLightBlink' : 'arcLight';
  const color = state === 'blink' ? 'arcLightOn' : 'arcLightOff';
  return `
    <g class="${cls}" ${fill(color)}>
      <circle cx="-7" cy="-33" r="3"/><circle cx="0" cy="-33" r="3"/><circle cx="7" cy="-33" r="3"/>
      <circle cx="0" cy="-128" r="4"/>
    </g>`;
};

/** A ball lit from the upper left: the slate shadow shows as a crescent on the lower right. */
const shaded = (cx: number, cy: number, r: number) => `
  <circle cx="${cx}" cy="${cy}" r="${r}" ${fill('arcShade')}/>
  <circle cx="${cx - 3.5}" cy="${cy - 3.5}" r="${r - 2}" ${fill('arcPaint')}/>`;

const scratch = (d: string) => `<path d="${d}" fill="none" stroke="var(--arcScratch)" stroke-width="1.4" stroke-linecap="round"/>`;

export function arc({ x, y, scale = 1, pose, flip = false, lights: lightState = 'off' }: ArcOptions): string {
  const p = poses[pose];
  const shake = pose === 'nervous' ? ' arcShake' : '';
  return `
  <g transform="translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})">
    <ellipse cx="0" cy="0" rx="36" ry="5" ${fill('shadow')} opacity="0.14"/>
    <g class="arc${shake}">
      <!-- antenna with a leaf sprouting beside it -->
      <rect x="-1.5" y="-128" width="3" height="10" ${fill('arcPaintDark')}/>
      <circle cx="0" cy="-128" r="6" ${fill('arcScreen')}/>
      <path d="M2 -120 q10 -12 19 -6 q-9 10 -19 6z" ${fill('arcLeaf')}/>

      <!-- treads -->
      <rect x="-26" y="-15" width="52" height="15" rx="7.5" ${fill('arcTread')}/>
      <circle cx="-15" cy="-7.5" r="4.2" ${fill('arcWheel')}/>
      <circle cx="0" cy="-7.5" r="4.2" ${fill('arcWheel')}/>
      <circle cx="15" cy="-7.5" r="4.2" ${fill('arcWheel')}/>

      <!-- round body: old paint, a pocket, rust, scratches, and a teal repair patch -->
      <circle cx="-${shoulderX + 1}" cy="${shoulderY}" r="6" ${fill('arcPaintDark')}/>
      <circle cx="${shoulderX + 1}" cy="${shoulderY}" r="6" ${fill('arcPaintDark')}/>
      ${shaded(0, body.y, body.r)}
      <path d="M-18 -24 h11 v5 a4 4 0 0 1 -4 4 h-3 a4 4 0 0 1 -4 -4z" ${fill('arcPaintDark')}/>
      <g transform="translate(12 -20) rotate(12)">
        <rect x="-5" y="-5" width="10" height="9" rx="2" ${fill('arcPatch')}/>
        <circle cx="-2.4" cy="-2.4" r="0.9" ${fill('arcPanel')}/><circle cx="2.4" cy="-2.4" r="0.9" ${fill('arcPanel')}/>
        <circle cx="-2.4" cy="1.6" r="0.9" ${fill('arcPanel')}/><circle cx="2.4" cy="1.6" r="0.9" ${fill('arcPanel')}/>
      </g>
      ${scratch('M-16 -46 l7 -3 M15 -44 l-4 5')}
      <circle cx="17" cy="-30" r="1.5" ${fill('arcRust')}/>
      <rect x="-13" y="-41" width="26" height="16" rx="6" ${fill('arcPaintDark')}/>
      <rect x="-11.5" y="-38" width="23" height="10" rx="5" ${fill('arcScreen')}/>

      <!-- springy neck -->
      <g ${fill('arcSpring')}>
        <rect x="-7" y="-64" width="14" height="4" rx="2"/>
        <rect x="-6" y="-61" width="12" height="4" rx="2"/>
      </g>

      <!-- big round head, mossy on top -->
      <circle cx="-${head.r}" cy="${head.y + 4}" r="5" ${fill('arcPaintDark')}/>
      <circle cx="${head.r}" cy="${head.y + 4}" r="5" ${fill('arcPaintDark')}/>
      ${shaded(0, head.y, head.r)}
      <path d="M-26 -107 a12 12 0 0 1 10 -12 a9 9 0 0 1 12 -3 a7 7 0 0 1 7 4 q-12 2 -29 11z" ${fill('arcMoss')}/>
      ${scratch('M16 -113 l7 4 M18 -108 l5 2.5 M-22 -76 l5 -3')}
      <circle cx="21" cy="-74" r="1.8" ${fill('arcRust')}/>
      ${eyes(p.eyes)}
      ${snout(p.mouth)}
      ${pose === 'nervous' ? `<path d="M27 -112 q4 6 0 8 q-4 -2 0 -8z" ${fill('arcEye')}/>` : ''}

      ${lights(lightState)}

      <!-- arms go last so hands can sit in front of the body -->
      ${arm(p.left, -1)}
      ${arm(p.right, 1, p.rightArmClass)}
      ${p.holdsChip ? heldChip(p.right.hand[0], p.right.hand[1] - 2) : ''}
    </g>
  </g>`;
}

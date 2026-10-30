import type { ArtId } from '../../domain/story';

// The first, chalkboard-style art. Levels 2 and 3 still use it
// until their picture-book art is drawn (see garden.ts for level 1).
// Colors come from CSS classes (see styles.css) so themes and
// forced-colors mode can change them. The art is decorative:
// the wrapper is aria-hidden, so screen readers skip it.
// Canvas is 320 x 200. The ground line sits at y = 186.

const groundY = 186;

/** ARC on two wheels. About 100 wide and 160 tall at scale 1. */
const arc = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <line x1="50" y1="0" x2="50" y2="20" class="ink"/>
    <circle cx="50" cy="0" r="8" class="glow ink light"/>
    <rect x="5" y="20" width="90" height="60" rx="16" class="metal ink"/>
    <circle cx="30" cy="48" r="11" class="glow ink eye"/>
    <circle cx="70" cy="48" r="11" class="glow ink eye"/>
    <path d="M38 66 Q50 74 62 66" class="ink"/>
    <rect x="15" y="88" width="70" height="50" rx="10" class="metal ink"/>
    <rect x="35" y="104" width="30" height="10" rx="3" class="dark ink"/>
    <circle cx="30" cy="148" r="12" class="dark ink"/>
    <circle cx="70" cy="148" r="12" class="dark ink"/>
  </g>`;

const ground = (y = groundY) => `<line x1="0" y1="${y}" x2="320" y2="${y}" class="ink"/>`;

const grass = (from: number, to: number) => {
  const blades: string[] = [];
  for (let x = from; x <= to; x += 14) blades.push(`M${x} ${groundY} q-4 -22 -10 -${30 + ((x * 7) % 14)}`);
  return `<path d="${blades.join(' ')}" class="ink leafStroke"/>`;
};

const ship = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M0 146 V60 Q0 0 40 0 Q80 0 80 60 V146z" class="paper ink"/>
    <circle cx="40" cy="50" r="14" class="water ink"/>
    <rect x="26" y="96" width="28" height="50" rx="4" class="dark ink"/>
    <path d="M0 110 L-18 146 H0z M80 110 L98 146 H80z" class="roof ink"/>
  </g>`;

const sun = (x: number, y: number, r = 22) => `
  <g transform="translate(${x} ${y})">
    <circle r="${r}" class="glow ink"/>
    ${[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => `<line x1="${r + 8}" y1="0" x2="${r + 20}" y2="0" class="ink" transform="rotate(${deg})"/>`).join('')}
  </g>`;

const cloud = (x: number, y: number) =>
  `<path d="M${x} ${y} a20 20 0 0 1 20 -24 a28 28 0 0 1 50 -6 a22 22 0 0 1 30 30z" class="paper ink"/>`;

const sprout = (x: number, delay: number) => `
  <g class="grow" style="animation-delay:${delay}s">
    <path d="M${x} ${groundY - 16} V${groundY - 60}" class="ink leafStroke"/>
    <path d="M${x} ${groundY - 46} q-26 -4 -30 -26 q24 2 30 26z" class="leaf ink"/>
    <path d="M${x} ${groundY - 56} q26 -4 30 -26 q-24 2 -30 26z" class="leaf ink"/>
  </g>`;

const soilBand = `<rect x="0" y="${groundY - 16}" width="320" height="30" class="soil ink"/>`;

const chip = (x: number, y: number, highlight: boolean) => `
  <g transform="translate(${x} ${y})">
    <rect width="70" height="96" rx="8" class="${highlight ? 'glow' : 'metal'} ink"/>
    ${[0, 1, 2].map((row) => `<circle cx="27" cy="${24 + row * 14}" r="4" class="dot"/><circle cx="43" cy="${24 + row * 14}" r="4" class="dot"/>`).join('')}
    ${[12, 28, 44, 60].map((px) => `<line x1="${px}" y1="96" x2="${px}" y2="110" class="ink"/>`).join('')}
  </g>`;

const sea = (top: number, bottom = 200) => `
  <rect x="0" y="${top}" width="320" height="${bottom - top}" class="water"/>
  <path d="M0 ${top} ${Array.from({ length: 8 }, () => 'q20 -12 40 0').join(' ')}" class="ink"/>`;

const fish = (x: number, y: number) => `
  <g transform="translate(${x} ${y})">
    <ellipse cx="0" cy="0" rx="26" ry="14" class="glow ink"/>
    <path d="M24 0 L42 -14 V14z" class="glow ink"/>
    <circle cx="-12" cy="-3" r="3" class="dot"/>
  </g>`;

const crab = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M-30 6 l-14 12 M-26 14 l-10 14 M30 6 l14 12 M26 14 l10 14" class="ink"/>
    <path d="M-24 -8 l-18 -18 M24 -8 l18 -18" class="ink"/>
    <circle cx="-44" cy="-28" r="9" class="roof ink"/>
    <circle cx="44" cy="-28" r="9" class="roof ink"/>
    <ellipse cx="0" cy="4" rx="32" ry="20" class="roof ink"/>
    <circle cx="-9" cy="-4" r="4" class="paper"/><circle cx="9" cy="-4" r="4" class="paper"/>
  </g>`;

const whale = (x: number, y: number, scale = 1) => `
  <g transform="translate(${x} ${y}) scale(${scale})">
    <path d="M0 40 Q10 0 70 0 Q130 0 140 40 Q150 50 170 30 L176 70 Q150 56 140 60 Q120 80 60 80 Q0 80 0 40z" class="metal ink"/>
    <circle cx="40" cy="30" r="5" class="dot"/>
    <path d="M70 -6 V-26 M70 -16 L56 -30 M70 -16 L84 -30" class="ink waterStroke"/>
  </g>`;

const person = (x: number, scale: number, shirt: string) => `
  <g transform="translate(${x} ${groundY}) scale(${scale})">
    <circle cx="0" cy="-92" r="14" class="paper ink"/>
    <rect x="-16" y="-74" width="32" height="44" rx="8" class="${shirt} ink"/>
    <path d="M-8 -30 V0 M8 -30 V0 M-16 -66 L-28 -40 M16 -66 L28 -40" class="ink"/>
  </g>`;

export const chalkboardArt: Record<ArtId, string> = {
  title: `${arc(70, 22)}${chip(200, 50, true)}${ground()}`,

  landing: `${ship(214, 40)}${arc(40, 24, 0.97)}${grass(4, 316)}${ground()}`,

  shed: `
    <polygon points="50,90 160,24 270,90" class="roof ink"/>
    <rect x="70" y="90" width="180" height="96" class="wood ink"/>
    <rect x="140" y="118" width="40" height="68" class="dark ink"/>
    <rect x="86" y="108" width="36" height="46" rx="4" class="glow ink"/>
    <rect x="198" y="108" width="36" height="46" rx="4" class="leaf ink"/>
    ${grass(4, 60)}${grass(262, 316)}${ground()}`,

  cards: `
    <g transform="translate(14 46) rotate(-6)"><rect width="66" height="96" rx="8" class="paper ink"/><path d="M33 20 V60 M20 60 h26 l-4 18 h-18z" class="ink"/></g>
    <g transform="translate(90 40) rotate(3)"><rect width="66" height="96" rx="8" class="paper ink"/><ellipse cx="33" cy="50" rx="12" ry="18" class="soil ink"/></g>
    <g transform="translate(166 46) rotate(-3)"><rect width="66" height="96" rx="8" class="paper ink"/><path d="M33 22 C20 44 18 52 18 60 a15 15 0 0 0 30 0 C48 52 46 44 33 22z" class="water ink"/></g>
    <g transform="translate(242 40) rotate(5)"><rect width="66" height="96" rx="8" class="paper ink"/><circle cx="33" cy="50" r="20" class="glow ink"/><path d="M33 50 V36 M33 50 h10" class="ink"/></g>`,

  wait: `
    ${arc(30, 15, 0.97)}
    <circle cx="220" cy="84" r="54" class="paper ink"/>
    <path d="M220 84 V46 M220 84 L248 98" class="ink"/>
    <circle cx="220" cy="84" r="5" class="dot"/>
    ${soilBand}${ground(groundY - 16)}`,

  needs: `
    ${sun(60, 80, 26)}
    <path d="M160 40 C140 76 136 90 136 104 a24 24 0 0 0 48 0 C184 90 180 76 160 40z" class="water ink"/>
    <path d="M220 170 q40 -50 80 0z" class="soil ink"/>
    <line x1="20" y1="170" x2="300" y2="170" class="ink"/>`,

  sprouts: `
    ${sun(276, 40)}
    ${soilBand}
    ${arc(10, 32, 0.86)}
    ${sprout(150, 0)}${sprout(210, 0.4)}${sprout(270, 0.8)}`,

  chip: `${arc(40, 24, 0.97)}${chip(190, 40, true)}${ground()}`,

  beach: `
    ${sun(270, 36)}
    ${sea(70, 130)}
    <rect x="0" y="130" width="320" height="70" class="sand ink"/>
    ${arc(110, 30, 0.95)}`,

  tidePool: `
    <rect x="0" y="0" width="320" height="200" class="sand"/>
    <ellipse cx="160" cy="120" rx="140" ry="66" class="rock ink"/>
    <ellipse cx="160" cy="120" rx="104" ry="44" class="water ink"/>
    ${crab(160, 124, 0.9)}`,

  whale: `${sea(110)}${whale(70, 70)}`,

  sea: `${sea(30)}${fish(70, 80)}${fish(240, 130)}${whale(150, 50, 0.5)}${crab(110, 166, 0.6)}`,

  hill: `
    ${cloud(30, 60)}
    <path d="M0 200 Q160 40 320 200z" class="leaf ink"/>
    <rect x="130" y="70" width="60" height="50" rx="6" class="metal ink"/>
    <circle cx="146" cy="88" r="6" class="glow ink"/><circle cx="160" cy="88" r="6" class="glow ink"/><circle cx="174" cy="88" r="6" class="glow ink"/>
    <path d="M196 76 h20 l-4 22 h-12z" class="paper ink"/>
    <path d="M150 120 V140 M170 120 V140" class="ink"/>`,

  station: `
    <rect x="30" y="30" width="260" height="140" rx="14" class="metal ink"/>
    ${[90, 160, 230].map((cx, i) => `<circle cx="${cx}" cy="100" r="30" class="glow ink"/><text x="${cx}" y="114" text-anchor="middle" class="digit">${i + 1}</text>`).join('')}`,

  rainCup: `
    ${cloud(90, 60)}
    <path d="M120 74 l-6 16 M150 74 l-6 16 M180 74 l-6 16 M135 100 l-6 16 M165 100 l-6 16" class="ink waterStroke"/>
    <path d="M110 120 h100 l-12 66 h-76z" class="paper ink"/>
    <rect x="114" y="150" width="92" height="36" class="water"/>
    <path d="M110 120 h100 l-12 66 h-76z" class="ink"/>
    <path d="M200 140 h-14 M196 160 h-14" class="ink"/>
    ${ground()}`,

  thermometer: `
    ${sun(80, 70, 30)}
    <rect x="200" y="20" width="36" height="130" rx="18" class="paper ink"/>
    <rect x="210" y="50" width="16" height="110" class="roof"/>
    <circle cx="218" cy="166" r="24" class="roof ink"/>
    <path d="M236 50 h12 M236 80 h12 M236 110 h12" class="ink"/>`,

  end: `
    <rect x="262" y="120" width="58" height="66" class="water ink"/>
    ${ship(20, 40)}
    ${person(140, 1, 'glow')}${person(176, 0.7, 'leaf')}
    ${sprout(222, 0)}${grass(120, 250)}
    ${ground()}`,
};

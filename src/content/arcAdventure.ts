// ======================================================
// DRAFT CONTENT. Source: braille-puzzles/arc-adventure-script.md
// Writers: replace anything in the content folder.
// The engine reads only this data.
//
// Rules (checked by `npm test`):
// - Aim for 20 characters or fewer per line.
//   Many players use 14- to 20-cell braille displays.
//   `npm test` lists longer lines as warnings.
// - Plain text only. No braille symbols.
//   The screen reader turns text into braille.
// - Every answer must match a choice id.
// - Always write ARC in all caps.
// ======================================================

import type { GameContent } from '../domain/story';
import { level1Garden } from './level1Garden';
import { level2Ocean } from './level2Ocean';
import { level3Weather } from './level3Weather';

export const arcAdventure: GameContent = {
  status: 'draft',
  title: 'ARC Adventure',
  shuffleChoices: true,

  ui: {
    soundGroup: 'Sound',
    mute: 'Mute',
    volume: 'Volume',
    start: 'Start',
    next: 'Next',
    playAgain: 'Play again',
    draftNotice: 'Draft text.',
  },

  // Used when a right pick has no line of its own (like 2.4).
  defaultCorrect: ['"Yes!"'],
  defaultWrong: ['"Hmm. Let us read', 'it once more."'],

  levels: [level1Garden, level2Ocean, level3Weather],
};

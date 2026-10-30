// Shapes for game content. Writers fill these in under src/content.
// The engine reads them; it never hard-codes story text.

export type ArtId =
  | 'title'
  | 'landing'
  | 'shed'
  | 'cards'
  | 'wait'
  | 'needs'
  | 'sprouts'
  | 'chip'
  | 'beach'
  | 'tidePool'
  | 'whale'
  | 'sea'
  | 'hill'
  | 'station'
  | 'rainCup'
  | 'thermometer'
  | 'end';

// Sound cue names. What each one sounds like (a synthesized placeholder
// or a recorded file) is set in one place: src/infrastructure/soundCues.ts.

/** Looping background sound for a scene. */
export type AmbienceId =
  | 'garden-ambient'
  | 'waiting-ambient'
  | 'ocean-ambient'
  | 'whale-ambient'
  | 'wind-ambient'
  | 'rain-ambient';

/** One-time sound when a scene starts. */
export type CueId = 'shed-door' | 'chime' | 'splash';

export type SoundCueName = AmbienceId | CueId;

/**
 * One short line of text.
 * A plain string is narration or speech.
 * `{ before, label }` is a word the player reads, like a chip label.
 * The label shows in a box on screen. Screen readers read the whole
 * line as plain text: "It says: garden".
 */
export type StoryLine = string | { before?: string; label: string };

export type Lines = StoryLine[];

export interface Choice {
  id: string;
  label: string;
  /** What ARC says when this wrong choice is picked. */
  wrong?: Lines;
}

export interface Question {
  /**
   * pickOne: one right answer.
   * pickAll: every answer, any order. Picked choices leave the list.
   * pickInOrder: every answer, in order. Picked choices leave the list.
   */
  kind: 'pickOne' | 'pickAll' | 'pickInOrder';
  /** Shown when the question first appears, and again after a wrong pick. */
  prompt: Lines;
  /** Shown after a right pick when more answers are left, like "What is next?". */
  nextPrompt?: Lines;
  choices: Choice[];
  answers: string[];
  /** What ARC says after each right pick, in order. Missing entries use the game default. */
  correct?: Lines[];
  /** What ARC says for a wrong pick with no line of its own. Falls back to the game default. */
  wrong?: Lines;
}

export interface Scene {
  id: string;
  title: string;
  art: ArtId;
  /** Overrides the level's background sound. */
  ambience?: AmbienceId;
  cue?: CueId;
  lines: Lines;
  /** Asked one at a time, in order. */
  questions?: Question[];
}

export interface Level {
  title: string;
  ambience: AmbienceId;
  scenes: Scene[];
}

export interface UiText {
  soundGroup: string;
  mute: string;
  volume: string;
  start: string;
  next: string;
  playAgain: string;
  draftNotice: string;
}

export interface GameContent {
  status: 'draft' | 'final';
  title: string;
  ui: UiText;
  /** Shuffle choices each time a question appears. */
  shuffleChoices: boolean;
  defaultCorrect: Lines;
  defaultWrong: Lines;
  levels: Level[];
}

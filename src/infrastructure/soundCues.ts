import type { SoundCueName } from '../domain/story';
import * as synth from './synthSounds';
import type { SynthRecipe } from './synthSounds';

// EVERY SOUND IN THE GAME, by cue name. Scenes name a cue (in
// src/content); this table says what it sounds like.
//
// To use a recording instead of the synthesized placeholder:
//   1. Put the file in public/sounds/, for example public/sounds/chime.mp3.
//   2. Add `file: 'chime.mp3'` to that cue below.
// The file plays instead of the synth. If it is missing or will not
// decode, the synth plays and the browser console says why.
// Looping cues loop the file; make it loop cleanly. Keep `synth` as a
// fallback, or remove it once the recording is in.
//
// `volume` (0 to 1, default 1) balances a cue against the others.
// The player's volume slider and Mute still apply on top.

export type SoundCue =
  | { synth: SynthRecipe; file?: string; volume?: number }
  | { file: string; synth?: SynthRecipe; volume?: number };

export const soundCues: Record<SoundCueName, SoundCue> = {
  // Looping background, one per scene. Changes fade over 1.5 seconds.
  'garden-ambient': { synth: synth.garden }, // birds, soft breeze, leaves
  'waiting-ambient': { synth: synth.waiting }, // crickets, slow clock tick
  'ocean-ambient': { synth: synth.ocean }, // waves, gulls
  'whale-ambient': { synth: synth.whale }, // waves and a low whale song
  'wind-ambient': { synth: synth.wind }, // wind, distant thunder
  'rain-ambient': { synth: synth.rain }, // rain on a tin cup

  // One-time sounds when a scene starts.
  'shed-door': { synth: synth.shedDoor }, // creaky door, about 1.3 seconds
  chime: { synth: synth.chime }, // soft three-note chime
  splash: { synth: synth.splash }, // a big splash
};

/** Where recorded files live: public/sounds/, served under the app's base path. */
export const soundFileUrl = (file: string) => `${import.meta.env.BASE_URL}sounds/${file}`;

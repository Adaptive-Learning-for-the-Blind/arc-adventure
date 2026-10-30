// PLACEHOLDER AUDIO. Synthesized recipes for every sound, made with the
// Web Audio API so the prototype ships with no audio files.
// soundCues.ts picks which recipe (or recorded file) each cue uses.

export interface Stoppable {
  stop(): void;
}

/**
 * Plays a synthesized sound into `out`. Loops return a handle to stop
 * them; one-time cues end on their own. `noise` is a shared brown-noise
 * buffer for wind, waves, and rain.
 */
export type SynthRecipe = (ctx: AudioContext, out: AudioNode, noise: AudioBuffer) => Stoppable | void;

// ---- Building blocks -------------------------------------------------------

export function makeBrownNoise(ctx: AudioContext): AudioBuffer {
  const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

function noiseBed(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, type: BiquadFilterType, freq: number, level: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const gain = ctx.createGain();
  gain.gain.value = level;
  src.connect(filter).connect(gain).connect(out);
  src.start();
  return { gain, stop: () => src.stop() };
}

/** Slow wobble on a gain, like wind or a breathing hum. */
function wobble(ctx: AudioContext, target: AudioParam, rate: number, depth: number) {
  const lfo = ctx.createOscillator();
  lfo.frequency.value = rate;
  const amount = ctx.createGain();
  amount.gain.value = depth;
  lfo.connect(amount).connect(target);
  lfo.start();
  return { stop: () => lfo.stop() };
}

/** Calls `play` now and then, at random gaps. */
function every(minMs: number, maxMs: number, play: () => void) {
  let timer = 0;
  const schedule = () => {
    timer = window.setTimeout(() => {
      play();
      schedule();
    }, minMs + Math.random() * (maxMs - minMs));
  };
  schedule();
  return { stop: () => clearTimeout(timer) };
}

function blip(ctx: AudioContext, out: AudioNode, from: number, to: number, seconds: number, level: number, at = 0) {
  const t = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + seconds);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(level, t + seconds * 0.2);
  gain.gain.linearRampToValueAtTime(0, t + seconds);
  osc.connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + seconds + 0.05);
}

function tock(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, level: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 700;
  filter.Q.value = 4;
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(level, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
  src.connect(filter).connect(gain).connect(out);
  src.start(t, Math.random() * 3, 0.3);
}

function birdCall(ctx: AudioContext, out: AudioNode) {
  const base = 2400 + Math.random() * 1200;
  const notes = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < notes; i++) blip(ctx, out, base, base * 1.4, 0.09, 0.05, i * 0.14);
}

/** A short swell of filtered noise: leaves, a wave, or thunder. */
function swell(ctx: AudioContext, out: AudioNode, noise: AudioBuffer, type: BiquadFilterType, freq: number, level: number, seconds: number) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  const gain = ctx.createGain();
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(level, t + seconds * 0.4);
  gain.gain.linearRampToValueAtTime(0, t + seconds);
  src.connect(filter).connect(gain).connect(out);
  src.start(t, Math.random() * 3);
  src.stop(t + seconds + 0.1);
}

function cricket(ctx: AudioContext, out: AudioNode) {
  for (let i = 0; i < 3; i++) blip(ctx, out, 4400, 4500, 0.04, 0.02, i * 0.07);
}

function gull(ctx: AudioContext, out: AudioNode) {
  blip(ctx, out, 1500, 900, 0.35, 0.025);
  blip(ctx, out, 1400, 850, 0.3, 0.02, 0.45);
}

function whaleCall(ctx: AudioContext, out: AudioNode) {
  blip(ctx, out, 140, 260, 1.6, 0.05);
  blip(ctx, out, 260, 170, 1.8, 0.05, 1.6);
}

function ping(ctx: AudioContext, out: AudioNode) {
  const freq = 2200 + Math.random() * 1400;
  blip(ctx, out, freq, freq * 0.98, 0.07, 0.03);
}

function stopAll(...parts: Stoppable[]): Stoppable {
  return { stop: () => parts.forEach((part) => part.stop()) };
}

// ---- Looping ambience ------------------------------------------------------------

// Birds, soft breeze, leaves.
export const garden: SynthRecipe = (ctx, out, noise) => {
  const breeze = noiseBed(ctx, out, noise, 'bandpass', 600, 0.25);
  return stopAll(
    breeze,
    wobble(ctx, breeze.gain.gain, 0.08, 0.12),
    every(2000, 6000, () => birdCall(ctx, out)),
    every(3000, 7000, () => swell(ctx, out, noise, 'highpass', 3000, 0.08, 1.2)),
  );
};

// Crickets and a slow clock tick.
export const waiting: SynthRecipe = (ctx, out, noise) =>
  stopAll(
    noiseBed(ctx, out, noise, 'lowpass', 400, 0.06),
    every(600, 1400, () => cricket(ctx, out)),
    every(1500, 1500, () => tock(ctx, out, noise, 0.12)),
  );

// Waves and gulls.
export const ocean: SynthRecipe = (ctx, out, noise) => {
  const waves = noiseBed(ctx, out, noise, 'lowpass', 800, 0.3);
  return stopAll(waves, wobble(ctx, waves.gain.gain, 0.15, 0.25), every(5000, 10000, () => gull(ctx, out)));
};

// Waves with a low whale song.
export const whale: SynthRecipe = (ctx, out, noise) =>
  stopAll(ocean(ctx, out, noise) as Stoppable, every(6000, 12000, () => whaleCall(ctx, out)));

// Wind and distant thunder.
export const wind: SynthRecipe = (ctx, out, noise) => {
  const wind = noiseBed(ctx, out, noise, 'bandpass', 900, 0.3);
  return stopAll(
    wind,
    wobble(ctx, wind.gain.gain, 0.1, 0.2),
    every(10000, 18000, () => swell(ctx, out, noise, 'lowpass', 120, 0.6, 3)),
  );
};

// Rain on a tin cup.
export const rain: SynthRecipe = (ctx, out, noise) =>
  stopAll(noiseBed(ctx, out, noise, 'highpass', 2500, 0.12), every(80, 350, () => ping(ctx, out)));

// ---- One-time cues --------------------------------------------------------------

export const shedDoor: SynthRecipe = (ctx, out) => {
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(220, t);
  osc.frequency.linearRampToValueAtTime(340, t + 0.5);
  osc.frequency.linearRampToValueAtTime(180, t + 1.2);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 900;
  filter.Q.value = 6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(0.15, t + 0.1);
  gain.gain.linearRampToValueAtTime(0, t + 1.3);
  osc.connect(filter).connect(gain).connect(out);
  osc.start(t);
  osc.stop(t + 1.4);
};

export const chime: SynthRecipe = (ctx, out) => {
  [1047, 1319, 1568].forEach((freq, i) => {
    const t = ctx.currentTime + i * 0.18;
    const osc = ctx.createOscillator();
    osc.frequency.value = freq;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 2);
    osc.connect(gain).connect(out);
    osc.start(t);
    osc.stop(t + 2.1);
  });
};

export const splash: SynthRecipe = (ctx, out, noise) => {
  const t = ctx.currentTime;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(2500, t);
  filter.frequency.exponentialRampToValueAtTime(300, t + 1.2);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
  src.connect(filter).connect(gain).connect(out);
  src.start(t, 0, 1.5);
};


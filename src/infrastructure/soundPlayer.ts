import type { AmbienceId, CueId, SoundCueName } from '../domain/story';
import { soundCues, soundFileUrl, type SoundCue } from './soundCues';
import { makeBrownNoise, type Stoppable } from './synthSounds';

// Plays sound cues by name. What each cue sounds like is set in
// soundCues.ts; this class only handles timing, fades, and levels.

/** Loudest the whole mix can get. Keeps ambience quiet under speech. */
const maxLevel = 0.35;
const fadeSeconds = 1.5;

export class SoundPlayer {
  private ctx?: AudioContext;
  private master?: GainNode;
  private noise?: AudioBuffer;
  private current?: { id: AmbienceId; stop(): void };
  private wanted?: AmbienceId;
  private files = new Map<string, Promise<AudioBuffer | undefined>>();

  constructor(
    private volume: number,
    private muted: boolean,
    private readonly cues: Record<SoundCueName, SoundCue> = soundCues,
  ) {}

  /** Call from a user gesture. Audio never starts before this. */
  unlock(): void {
    if (this.ctx) {
      void this.ctx.resume();
      return;
    }
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    this.noise = makeBrownNoise(this.ctx);
    this.applyLevel();
    // Load recordings now, so one-time cues play on time later.
    for (const cue of Object.values(this.cues)) if (cue.file) void this.load(cue.file);
    if (this.wanted) this.startAmbience(this.wanted);
  }

  /** Switches the looping background sound, with a crossfade. */
  play(id: AmbienceId): void {
    this.wanted = id;
    if (this.ctx && this.current?.id !== id) this.startAmbience(id);
  }

  /** Plays a one-time sound. Skipped until audio is unlocked. */
  cue(id: CueId): void {
    if (this.master) void this.start(id, this.master, false);
  }

  setVolume(volume: number): void {
    this.volume = volume;
    this.applyLevel();
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    this.applyLevel();
  }

  private startAmbience(id: AmbienceId): void {
    const { ctx, master } = this;
    if (!ctx || !master) return;
    this.current?.stop();
    const bus = ctx.createGain();
    bus.gain.setValueAtTime(0, ctx.currentTime);
    bus.gain.linearRampToValueAtTime(1, ctx.currentTime + fadeSeconds);
    bus.connect(master);
    const playing = this.start(id, bus, true);
    this.current = {
      id,
      stop() {
        const now = ctx.currentTime;
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(bus.gain.value, now);
        bus.gain.linearRampToValueAtTime(0, now + fadeSeconds);
        setTimeout(() => {
          void playing.then((sound) => sound?.stop());
          bus.disconnect();
        }, fadeSeconds * 1000 + 100);
      },
    };
  }

  /** Starts a cue into `out`: its recording if it has one that loads, else its synth. */
  private async start(id: SoundCueName, out: AudioNode, loop: boolean): Promise<Stoppable | void> {
    const { ctx, noise } = this;
    if (!ctx || !noise) return;
    const cue = this.cues[id];
    const level = ctx.createGain();
    level.gain.value = cue.volume ?? 1;
    level.connect(out);

    const recording = cue.file ? await this.load(cue.file) : undefined;
    if (recording) {
      const source = ctx.createBufferSource();
      source.buffer = recording;
      source.loop = loop;
      source.connect(level);
      source.onended = () => level.disconnect();
      source.start();
      return { stop: () => source.stop() };
    }
    if (cue.synth) return cue.synth(ctx, level, noise);
    console.warn(`Sound cue "${id}" has no sound to play.`);
  }

  /** Fetches and decodes a recording once. Resolves undefined if it fails. */
  private load(file: string): Promise<AudioBuffer | undefined> {
    let loading = this.files.get(file);
    if (!loading) {
      loading = fetch(soundFileUrl(file))
        .then((response) => {
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          return response.arrayBuffer();
        })
        .then((data) => this.ctx!.decodeAudioData(data))
        .catch((error: unknown) => {
          console.warn(`Sound file "${file}" did not load (${String(error)}). Using the synthesized sound.`);
          return undefined;
        });
      this.files.set(file, loading);
    }
    return loading;
  }

  private applyLevel(): void {
    if (!this.ctx || !this.master) return;
    const target = this.muted ? 0 : this.volume * maxLevel;
    this.master.gain.setTargetAtTime(target, this.ctx.currentTime, 0.1);
  }
}

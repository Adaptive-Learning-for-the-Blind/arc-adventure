import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SoundCueName } from '../src/domain/story';
import { soundCues, type SoundCue } from '../src/infrastructure/soundCues';
import { SoundPlayer } from '../src/infrastructure/soundPlayer';

// Every file in public/sounds, as '../public/sounds/name.mp3'.
const soundFiles = Object.keys(import.meta.glob('../public/sounds/*', { query: '?url', eager: true }));

describe('sound cue table', () => {
  it('gives every cue a synth or a file, and every file exists', () => {
    for (const [name, cue] of Object.entries(soundCues)) {
      expect(cue.synth ?? cue.file, name).toBeTruthy();
      if (cue.file) expect(soundFiles, `public/sounds/${cue.file}`).toContain(`../public/sounds/${cue.file}`);
    }
  });
});

// A small stand-in for the Web Audio API: just enough to see what plays.
function fakeAudio() {
  const started: AudioBuffer[] = [];
  const param = () => ({ value: 0, setValueAtTime() {}, linearRampToValueAtTime() {}, setTargetAtTime() {}, cancelScheduledValues() {} });
  const node = () => ({ gain: param(), connect: (n: unknown) => n, disconnect() {} });
  class FakeContext {
    currentTime = 0;
    sampleRate = 100;
    destination = node();
    createGain = node;
    createBuffer = () => ({ getChannelData: () => new Float32Array(400) });
    createBufferSource = () => ({ ...node(), buffer: null as AudioBuffer | null, loop: false, start() { started.push(this.buffer!); }, stop() {} });
    decodeAudioData = async () => ({ decoded: true }) as unknown as AudioBuffer;
    resume = async () => {};
  }
  vi.stubGlobal('AudioContext', FakeContext);
  return started;
}

const playerWith = (cue: SoundCue) => {
  const player = new SoundPlayer(0.5, false, { ...soundCues, chime: cue } as Record<SoundCueName, SoundCue>);
  player.unlock();
  return player;
};

const settle = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('sound player', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('plays the synth when a cue has no file', async () => {
    fakeAudio();
    const synth = vi.fn();
    playerWith({ synth }).cue('chime');
    await settle();
    expect(synth).toHaveBeenCalledOnce();
  });

  it('plays the recording when the file loads', async () => {
    const started = fakeAudio();
    vi.stubGlobal('fetch', async () => ({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) }));
    const synth = vi.fn();
    playerWith({ file: 'chime.mp3', synth }).cue('chime');
    await settle();
    expect(started).toHaveLength(1);
    expect(synth).not.toHaveBeenCalled();
  });

  it('falls back to the synth when the file is missing', async () => {
    fakeAudio();
    vi.stubGlobal('fetch', async () => ({ ok: false, status: 404 }));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const synth = vi.fn();
    playerWith({ file: 'missing.mp3', synth }).cue('chime');
    await settle();
    expect(synth).toHaveBeenCalledOnce();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('missing.mp3'));
  });
});

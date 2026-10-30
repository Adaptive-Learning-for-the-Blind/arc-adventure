export interface SoundSettings {
  /** 0 to 1. */
  volume: number;
  muted: boolean;
}

const storageKey = 'brailleAdventure.sound';
const defaults: SoundSettings = { volume: 0.5, muted: false };

export function loadSoundSettings(): SoundSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) ?? 'null') as Partial<SoundSettings> | null;
    return {
      volume: typeof saved?.volume === 'number' ? Math.min(1, Math.max(0, saved.volume)) : defaults.volume,
      muted: typeof saved?.muted === 'boolean' ? saved.muted : defaults.muted,
    };
  } catch {
    return { ...defaults };
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  try {
    localStorage.setItem(storageKey, JSON.stringify(settings));
  } catch {
    // Storage can be blocked. Settings then last only for this visit.
  }
}

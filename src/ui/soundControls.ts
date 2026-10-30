import type { UiText } from '../domain/story';
import type { SoundSettings } from '../infrastructure/soundSettingsStore';
import { el } from './dom';

export interface SoundControlHandlers {
  onMutedChange(muted: boolean): void;
  onVolumeChange(volume: number): void;
}

/** A mute toggle and a volume slider. Both are native controls. */
export function mountSoundControls(root: HTMLElement, ui: UiText, settings: SoundSettings, handlers: SoundControlHandlers): void {
  const mute = el('button', { type: 'button', class: 'mute', 'aria-pressed': String(settings.muted) }, [ui.mute]);
  mute.addEventListener('click', () => {
    const muted = mute.getAttribute('aria-pressed') !== 'true';
    mute.setAttribute('aria-pressed', String(muted));
    handlers.onMutedChange(muted);
  });

  const percent = Math.round(settings.volume * 100);
  const volume = el('input', { type: 'range', id: 'volume', min: '0', max: '100', step: '10', value: String(percent), 'aria-valuetext': `${percent}%` });
  volume.addEventListener('input', () => {
    volume.setAttribute('aria-valuetext', `${volume.value}%`);
    handlers.onVolumeChange(Number(volume.value) / 100);
  });

  root.replaceChildren(
    el('div', { role: 'group', 'aria-labelledby': 'soundLabel', class: 'soundControls' }, [
      el('span', { id: 'soundLabel', class: 'soundLabel' }, [ui.soundGroup]),
      mute,
      el('label', { for: 'volume' }, [ui.volume]),
      volume,
    ]),
  );
}

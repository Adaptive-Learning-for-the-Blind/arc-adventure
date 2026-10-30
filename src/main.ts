// Composition root: wires content, game logic, audio, and UI together.
import { GameSession, type Screen } from './application/gameSession';
import { arcAdventure } from './content/arcAdventure';
import { SoundPlayer } from './infrastructure/soundPlayer';
import { loadSoundSettings, saveSoundSettings } from './infrastructure/soundSettingsStore';
import { SceneView } from './ui/sceneView';
import { mountSoundControls } from './ui/soundControls';
import './ui/styles.css';

const game = arcAdventure;
const session = new GameSession(game);

const settings = loadSoundSettings();
const sound = new SoundPlayer(settings.volume, settings.muted);

mountSoundControls(document.getElementById('sound')!, game.ui, settings, {
  onMutedChange(muted) {
    settings.muted = muted;
    sound.setMuted(muted);
    saveSoundSettings(settings);
  },
  onVolumeChange(volume) {
    settings.volume = volume;
    sound.setVolume(volume);
    saveSoundSettings(settings);
  },
});

const view = new SceneView(document.getElementById('scene')!, {
  choose: (choiceId) => session.choose(choiceId),
  continue: () => session.continue(),
});

const playSceneSound = (screen: Screen) => {
  sound.play(screen.ambience);
  if (screen.cue) sound.cue(screen.cue);
};

session.onChange((event) => {
  if (event.type === 'sceneChanged') {
    view.showScene(event.screen, { moveFocus: true });
    playSceneSound(event.screen);
  } else {
    view.showPick(event.screen);
  }
});

view.showScene(session.screen, { moveFocus: false });
sound.play(session.screen.ambience);

// Audio waits for the player's first click (or slider move).
// Browsers block sound before a user gesture, and players should
// not be surprised by sound over their screen reader.
for (const type of ['click', 'input']) {
  document.addEventListener(type, () => sound.unlock(), { capture: true });
}

if (game.status === 'draft') {
  document.getElementById('draftNotice')!.textContent = game.ui.draftNotice;
}

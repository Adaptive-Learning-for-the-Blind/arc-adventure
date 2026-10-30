// Dev-only page (artPreview.html): every scene's art on one sheet,
// with a button to replay each one's motion.
import { arcAdventure } from './content/arcAdventure';
import { el } from './ui/dom';
import { illustrationSvg } from './ui/illustrations';
import './ui/styles.css';

const sheet = document.getElementById('sheet')!;
const scenes = [
  { title: 'Title', art: 'title' as const, cue: undefined },
  ...arcAdventure.levels.flatMap((level) => level.scenes),
];

for (const scene of scenes) {
  const art = el('div', { class: 'art', 'aria-hidden': 'true' });
  const draw = () => (art.innerHTML = illustrationSvg(scene.art));
  draw();
  const replay = el('button', { type: 'button', class: 'next' }, [`Replay ${scene.title}`]);
  replay.addEventListener('click', draw);
  sheet.append(el('section', {}, [el('h2', {}, [`${scene.title} (${scene.art}${scene.cue ? `, ${scene.cue}` : ''})`]), art, replay]));
}

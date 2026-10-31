import { beforeEach, describe, expect, it } from 'vitest';
import { GameSession } from '../src/application/gameSession';
import { arcAdventure } from '../src/content/arcAdventure';
import { SceneView } from '../src/ui/sceneView';

function setup(random = Math.random) {
  document.body.innerHTML = '<main id="scene"></main>';
  const root = document.getElementById('scene')!;
  const session = new GameSession(arcAdventure, { random });
  const view = new SceneView(root, { choose: (id) => session.choose(id), continue: () => session.continue() });
  session.onChange((event) =>
    event.type === 'sceneChanged' ? view.showScene(event.screen, { moveFocus: true }) : view.showPick(event.screen),
  );
  view.showScene(session.screen, { moveFocus: false });
  return root;
}

const buttons = (root: HTMLElement) => [...root.querySelectorAll('button')];
const focused = () => document.activeElement?.textContent;

describe('SceneView', () => {
  let root: HTMLElement;
  let press: (...names: string[]) => void;
  beforeEach(() => {
    root = setup();
    press = (...names) =>
      names.forEach((name) => {
        const button = buttons(root).find((b) => b.textContent === name);
        if (!button) throw new Error(`No button "${name}" on "${root.querySelector('h1')?.textContent}"`);
        button.click();
      });
  });

  it('moves focus to the heading on a new scene and names the level', () => {
    press('Start');
    expect(document.activeElement?.tagName).toBe('H1');
    expect(focused()).toBe('The Landing');
    expect(root.querySelector('.levelTitle')?.textContent).toBe('Level 1: The Garden');
    expect(document.title).toBe('The Landing - Level 1: The Garden - ARC Adventure');
  });

  it('reads labels as one plain line', () => {
    press('Start');
    const label = root.querySelector('.readLabel')!;
    expect(label.textContent).toBe('garden');
    expect(label.parentElement?.textContent).toBe('It says: garden');
  });

  it('uses real buttons, no application role, and hides the art', () => {
    press('Start');
    const choices = root.querySelectorAll('.choices button');
    expect(choices).toHaveLength(3);
    choices.forEach((b) => expect(b.getAttribute('type')).toBe('button'));
    expect(document.querySelector('[role="application"]')).toBeNull();
    expect(root.querySelector('.art')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps the markup flat: one heading, no lists, no extra roles', () => {
    press('Start');
    expect(root.querySelectorAll('h1, h2, h3, h4, h5, h6')).toHaveLength(1);
    expect(root.querySelectorAll('ul, ol, li, section, article, header, footer, nav, aside')).toHaveLength(0);
    expect(root.querySelectorAll('[role], [aria-label], [aria-describedby], [aria-roledescription], [aria-live]')).toHaveLength(0);
    root.querySelectorAll('.story > *').forEach((line) => expect(line.tagName).toBe('P'));
    const choices = [...root.querySelector('.choices')!.children];
    expect(choices).toHaveLength(3);
    choices.forEach((child) => expect(child.tagName).toBe('BUTTON'));
  });

  it('focuses ARC\'s reply, repeats the question after a wrong pick, and hides Next until solved', () => {
    press('Start');
    expect(buttons(root).some((b) => b.textContent === 'Next')).toBe(false);
    press('Swim with fish');
    expect(focused()).toBe('"Hmm. Let us read');
    expect(root.querySelector('.prompt')?.textContent).toBe('What will you do here?');
    press('Plant seeds');
    expect(focused()).toBe('"Yes! Seeds!');
    expect(root.querySelector('.choices')).toBeNull();
    expect(buttons(root).map((b) => b.textContent)).toEqual(['Next']);
  });

  it('uses per-choice wrong lines', () => {
    press('Start', 'Plant seeds', 'Next', 'bean', 'pea', 'corn', 'Next');
    press('dig', 'plant', 'water', 'wait', 'Next', 'Next', 'candy');
    expect(focused()).toBe('"Candy? Oh my.');
  });

  it('asks for another pick until all three are found', () => {
    press('Start', 'Plant seeds', 'Next', 'bean', 'pea', 'corn', 'Next');
    press('dig', 'plant', 'water', 'wait', 'Next', 'Next', 'sun');
    expect(focused()).toBe('"Yes!"');
    expect(root.querySelector('.prompt')?.textContent).toBe('"Pick another one."');
    press('water');
    expect(root.querySelector('.prompt')?.textContent).toBe('"Pick another one."');
    press('soil');
    expect(focused()).toBe('"That is all three!"');
    expect(root.querySelector('.prompt')).toBeNull();
  });

  it('removes picked cards and asks what is next', () => {
    press('Start', 'Plant seeds', 'Next', 'bean', 'pea', 'corn', 'Next', 'dig');
    expect(focused()).toBe('"Dig! Of course!"');
    expect(root.querySelector('.prompt')?.textContent).toBe('"What is next?"');
    expect(buttons(root).map((b) => b.textContent).sort()).toEqual(['plant', 'wait', 'water']);
  });

  it('plays all three levels and restarts', () => {
    press('Start', 'Plant seeds', 'Next');
    press('bean', 'pea', 'corn', 'Next');
    press('dig', 'plant', 'water', 'wait', 'Next');
    press('Next');
    press('sun', 'water', 'soil', 'Next');
    press('Next');
    press('Swim with fish', 'Next');
    expect(root.querySelector('.levelTitle')?.textContent).toBe('Level 2: The Ocean');
    press('Next', 'crab', 'Next', 'whale', 'Next', 'fish', 'crab', 'whale', 'Next', 'Next', 'Watch the rain', 'Next');
    expect(root.querySelector('.levelTitle')?.textContent).toBe('Level 3: The Weather');
    press('Next', '2', 'Next', '2', 'Next', 'shorts', 'Next', 'Next');
    expect(focused()).toBe('The End of the Demo');
    press('Play again');
    expect(focused()).toBe('ARC Adventure');
  });
});

describe('shuffled choices', () => {
  it('reshuffles when the question repeats', () => {
    let n = 0;
    const root = setup(() => [0.9, 0.1, 0.5, 0.2, 0.7, 0.3][n++ % 6]!);
    root.querySelector('button')!.click();
    const order = () => [...root.querySelectorAll('.choices button')].map((b) => b.textContent);
    const before = order();
    [...root.querySelectorAll<HTMLButtonElement>('.choices button')].find((b) => b.textContent !== 'Plant seeds')!.click();
    expect(order()).not.toEqual(before);
  });
});

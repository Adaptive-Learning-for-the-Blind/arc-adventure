import type { Screen } from '../application/gameSession';
import type { StoryLine } from '../domain/story';
import { el } from './dom';
import { illustrationSvg } from './illustrations';

export interface SceneActions {
  choose(choiceId: string): void;
  continue(): void;
}

/**
 * Draws the current screen into <main>.
 * Focus rules:
 * - New scene: focus moves to the scene heading.
 * - After a pick: focus moves to the first line of ARC's reply,
 *   which sits just above the question and choices, so the player
 *   can read it at their own pace on a braille display.
 */
export class SceneView {
  private questionRegion?: HTMLElement;

  constructor(
    private readonly root: HTMLElement,
    private readonly actions: SceneActions,
  ) {}

  showScene(screen: Screen, { moveFocus }: { moveFocus: boolean }): void {
    document.title = screen.documentTitle;

    const art = el('div', { class: 'art', 'aria-hidden': 'true' });
    art.innerHTML = illustrationSvg(screen.art);
    const heading = el('h1', { tabindex: '-1' }, [screen.heading]);
    this.questionRegion = el('div', { class: 'question' });

    // The title screen is a cover: the picture fills the page and the
    // title and Start button sit on top of it (wide screens only).
    this.root.classList.toggle('cover', screen.art === 'title');
    this.root.replaceChildren(
      art,
      el('div', { class: 'sceneText' }, [
        heading,
        ...(screen.levelTitle ? [el('p', { class: 'levelTitle' }, [screen.levelTitle])] : []),
        el('div', { class: 'story' }, screen.lines.map(storyLine)),
        this.questionRegion,
      ]),
    );
    this.renderQuestion(screen);
    if (moveFocus) heading.focus();
  }

  showPick(screen: Screen): void {
    this.renderQuestion(screen)?.focus();
  }

  /** Redraws ARC's reply, the question, and the buttons. Returns the first reply line. */
  private renderQuestion(screen: Screen): HTMLElement | undefined {
    if (!this.questionRegion) return undefined;
    const feedback = screen.feedback ? screen.feedback.lines.map(storyLine) : [];
    feedback[0]?.setAttribute('tabindex', '-1');

    const next = screen.nextLabel ? el('button', { type: 'button', class: 'next' }, [screen.nextLabel]) : undefined;
    next?.addEventListener('click', () => this.actions.continue());

    this.questionRegion.replaceChildren(
      ...(feedback.length ? [el('div', { class: `feedback ${screen.feedback!.kind}` }, feedback)] : []),
      ...(screen.prompt ? [el('div', { class: 'prompt' }, screen.prompt.map(storyLine))] : []),
      // Plain buttons in a plain <div>: no list role for the screen
      // reader to call out before each set of choices.
      ...(screen.choices
        ? [
            el(
              'div',
              { class: 'choices' },
              screen.choices.map((choice) => {
                const button = el('button', { type: 'button', class: 'choice' }, [choice.label]);
                button.addEventListener('click', () => this.actions.choose(choice.id));
                return button;
              }),
            ),
          ]
        : []),
      ...(next ? [next] : []),
    );
    return feedback[0];
  }
}

function storyLine(line: StoryLine): HTMLElement {
  if (typeof line === 'string') return el('p', {}, [line]);
  return el('p', {}, [line.before ?? '', el('span', { class: 'readLabel' }, [line.label])]);
}

import { pick, shuffle, startPuzzle, type PuzzleState } from '../domain/puzzle';
import type { AmbienceId, ArtId, Choice, CueId, GameContent, Level, Lines, Question, Scene } from '../domain/story';

/** Everything the UI needs to draw the current moment. No DOM here. */
export interface Screen {
  heading: string;
  documentTitle: string;
  /** Set on the first scene of each level. */
  levelTitle?: string;
  art: ArtId;
  ambience: AmbienceId;
  cue?: CueId;
  lines: Lines;
  feedback?: { kind: 'right' | 'wrong'; lines: Lines };
  prompt?: Lines;
  choices?: Choice[];
  /** Set when the player may move on. */
  nextLabel?: string;
}

export type SessionEvent = { type: 'sceneChanged'; screen: Screen } | { type: 'picked'; screen: Screen };

interface Stop {
  scene: Scene;
  level?: Level;
  isLevelStart: boolean;
}

export interface SessionOptions {
  random?: () => number;
}

/** Tracks where the player is in the game. Knows nothing about the DOM or audio. */
export class GameSession {
  private readonly stops: Stop[];
  private readonly random: () => number;
  private readonly listeners = new Set<(event: SessionEvent) => void>();
  private index = 0;
  private questionIndex = 0;
  private puzzle: PuzzleState = startPuzzle();
  private feedback?: Screen['feedback'];
  private showFullPrompt = true;
  private order: string[] = [];

  constructor(
    private readonly game: GameContent,
    { random = Math.random }: SessionOptions = {},
  ) {
    this.random = random;
    const title: Stop = { scene: { id: 'title', title: game.title, art: 'title', lines: [] }, isLevelStart: false };
    this.stops = [
      title,
      ...game.levels.flatMap((level) => level.scenes.map((scene, i) => ({ scene, level, isLevelStart: i === 0 }))),
    ];
    this.resetScene();
  }

  get screen(): Screen {
    const { scene, level, isLevelStart } = this.stop;
    const question = this.question;
    const isLast = this.index === this.stops.length - 1;
    const remaining = question ? this.order.filter((id) => !this.puzzle.found.includes(id)) : [];

    return {
      heading: scene.title,
      documentTitle: [...new Set([scene.title, level?.title, this.game.title].filter(Boolean))].join(' - '),
      levelTitle: isLevelStart ? level?.title : undefined,
      art: scene.art,
      ambience: scene.ambience ?? level?.ambience ?? this.game.levels[0]!.ambience,
      cue: scene.cue,
      lines: scene.lines,
      feedback: this.feedback,
      prompt: question ? (this.showFullPrompt ? question.prompt : question.nextPrompt) : undefined,
      choices: question ? remaining.map((id) => question.choices.find((choice) => choice.id === id)!) : undefined,
      nextLabel: question ? undefined : this.index === 0 ? this.game.ui.start : isLast ? this.game.ui.playAgain : this.game.ui.next,
    };
  }

  onChange(listener: (event: SessionEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  choose(choiceId: string): void {
    const question = this.question;
    if (!question) return;
    const result = pick(question, this.puzzle, choiceId);
    if (result.outcome === 'alreadyFound') return;

    if (result.outcome === 'wrong') {
      const choice = question.choices.find((c) => c.id === choiceId);
      this.feedback = { kind: 'wrong', lines: choice?.wrong ?? question.wrong ?? this.game.defaultWrong };
      this.showFullPrompt = true;
    } else {
      const count = result.state.found.length;
      this.feedback = { kind: 'right', lines: question.correct?.[count - 1] ?? this.game.defaultCorrect };
      this.puzzle = result.state;
      this.showFullPrompt = false;
      if (result.state.complete) {
        this.questionIndex++;
        this.puzzle = startPuzzle();
        this.showFullPrompt = true;
      }
    }
    this.shuffleChoices();
    this.emit({ type: 'picked', screen: this.screen });
  }

  continue(): void {
    if (this.question) return;
    this.index = (this.index + 1) % this.stops.length;
    this.resetScene();
    this.emit({ type: 'sceneChanged', screen: this.screen });
  }

  private get stop(): Stop {
    return this.stops[this.index]!;
  }

  private get question(): Question | undefined {
    return this.stop.scene.questions?.[this.questionIndex];
  }

  private resetScene(): void {
    this.questionIndex = 0;
    this.puzzle = startPuzzle();
    this.feedback = undefined;
    this.showFullPrompt = true;
    this.shuffleChoices();
  }

  private shuffleChoices(): void {
    const ids = this.question?.choices.map((choice) => choice.id) ?? [];
    this.order = this.game.shuffleChoices ? shuffle(ids, this.random) : ids;
  }

  private emit(event: SessionEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}

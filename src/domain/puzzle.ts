import type { Question } from './story';

export interface PuzzleState {
  /** Answer ids found so far, in the order they were found. */
  found: string[];
  complete: boolean;
}

export type PickOutcome = 'correct' | 'wrong' | 'complete' | 'alreadyFound';

export interface PickResult {
  outcome: PickOutcome;
  choiceId: string;
  state: PuzzleState;
}

export const startPuzzle = (): PuzzleState => ({ found: [], complete: false });

export function pick(question: Question, state: PuzzleState, choiceId: string): PickResult {
  if (state.complete || state.found.includes(choiceId)) {
    return { outcome: 'alreadyFound', choiceId, state };
  }

  const { answers } = question;
  const isRight = question.kind === 'pickInOrder' ? answers[state.found.length] === choiceId : answers.includes(choiceId);
  if (!isRight) {
    return { outcome: 'wrong', choiceId, state };
  }

  const found = [...state.found, choiceId];
  const complete = question.kind === 'pickOne' || found.length === answers.length;
  return { outcome: complete ? 'complete' : 'correct', choiceId, state: { found, complete } };
}

/** Fisher-Yates shuffle. Takes the random source so tests can fix it. */
export function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

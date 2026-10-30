import { describe, expect, it } from 'vitest';
import { pick, shuffle, startPuzzle } from '../src/domain/puzzle';
import type { Question } from '../src/domain/story';

const choices = ['a', 'b', 'c', 'x'].map((id) => ({ id, label: id }));
const question = (kind: Question['kind'], answers: string[]): Question => ({ kind, prompt: [], choices, answers });

describe('pick', () => {
  it('solves a pickOne question with the answer only', () => {
    const q = question('pickOne', ['b']);
    expect(pick(q, startPuzzle(), 'a').outcome).toBe('wrong');
    expect(pick(q, startPuzzle(), 'b')).toMatchObject({ outcome: 'complete', state: { complete: true } });
  });

  it('accepts pickAll answers in any order', () => {
    const q = question('pickAll', ['a', 'b', 'c']);
    let state = startPuzzle();
    for (const id of ['c', 'x', 'a', 'a', 'b']) state = pick(q, state, id).state;
    expect(state).toEqual({ found: ['c', 'a', 'b'], complete: true });
  });

  it('reports a repeated pick without changing state', () => {
    const q = question('pickAll', ['a', 'b']);
    const first = pick(q, startPuzzle(), 'a');
    const again = pick(q, first.state, 'a');
    expect(again.outcome).toBe('alreadyFound');
    expect(again.state).toBe(first.state);
  });

  it('requires pickInOrder answers in order', () => {
    const q = question('pickInOrder', ['a', 'b', 'c']);
    let state = startPuzzle();
    expect(pick(q, state, 'b').outcome).toBe('wrong');
    state = pick(q, state, 'a').state;
    expect(pick(q, state, 'c').outcome).toBe('wrong');
    state = pick(q, state, 'b').state;
    expect(pick(q, state, 'c').outcome).toBe('complete');
  });
});

describe('shuffle', () => {
  it('keeps every item and does not change the input', () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items, () => 0);
    expect([...result].sort()).toEqual(items);
    expect(result).not.toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });
});

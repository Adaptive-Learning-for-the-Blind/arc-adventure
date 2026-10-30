// Checks writers can rely on when they edit src/content.
import { describe, expect, it } from 'vitest';
import type { GameContent, Lines } from '../src/domain/story';
import { arcAdventure } from '../src/content/arcAdventure';

const game: GameContent = arcAdventure;
const targetLineLength = 20;
const brailleBlock = /[⠀-⣿]/;

const flat = (lines: Lines = []) => lines.map((line) => (typeof line === 'string' ? line : `${line.before ?? ''}${line.label}`));

function playerText(): string[] {
  return [
    ...flat(game.defaultCorrect),
    ...flat(game.defaultWrong),
    ...game.levels.flatMap((level) => [
      level.title,
      ...level.scenes.flatMap((scene) => [
        scene.title,
        ...flat(scene.lines),
        ...(scene.questions ?? []).flatMap((q) => [
          ...flat(q.prompt),
          ...flat(q.nextPrompt),
          ...flat(q.wrong),
          ...(q.correct ?? []).flatMap(flat),
          ...q.choices.flatMap((choice) => [choice.label, ...flat(choice.wrong)]),
        ]),
      ]),
    ]),
  ];
}

describe(game.title, () => {
  it(`lists lines over ${targetLineLength} characters (warning only)`, () => {
    const long = [...new Set(playerText().filter((line) => line.length > targetLineLength))];
    if (long.length) {
      console.warn(`Lines over ${targetLineLength} characters:\n${long.map((line) => `  ${line.length}  ${line}`).join('\n')}`);
    }
    expect(long.every((line) => line.length <= 30)).toBe(true);
  });

  it('uses plain text, not braille characters', () => {
    const all = [...playerText(), ...Object.values(game.ui)];
    expect(all.filter((line) => brailleBlock.test(line))).toEqual([]);
  });

  it('has unique scene ids', () => {
    const ids = game.levels.flatMap((level) => level.scenes.map((scene) => scene.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('only uses answers that are choices', () => {
    for (const scene of game.levels.flatMap((level) => level.scenes)) {
      for (const q of scene.questions ?? []) {
        const ids = q.choices.map((choice) => choice.id);
        expect(new Set(ids).size, scene.id).toBe(ids.length);
        for (const answer of q.answers) expect(ids, scene.id).toContain(answer);
        if (q.kind === 'pickOne') expect(q.answers, scene.id).toHaveLength(1);
      }
    }
  });

  it('writes ARC in all caps', () => {
    expect(playerText().filter((line) => /\barc\b/i.test(line) && !/\bARC\b/.test(line))).toEqual([]);
  });
});

import type { ArtId } from '../domain/story';
import { chalkboardArt } from './art/chalkboard';
import { gardenArt } from './art/garden';
import { paletteStyle } from './art/palette';

// Picture-book art for each scene. It is decorative: the wrapper and the
// <svg> are aria-hidden, so screen readers skip it, and it only shows what
// the story text and sound already say.
// Levels 2 and 3 still use the older chalkboard art until theirs is drawn.

const pictureBook: Partial<Record<ArtId, string>> = { ...gardenArt };

export function illustrationSvg(id: ArtId): string {
  const book = pictureBook[id];
  return book
    ? `<svg class="pictureBook" viewBox="0 0 320 200" style="${paletteStyle}" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${book}</svg>`
    : `<svg class="chalkboard" viewBox="0 0 320 200" focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">${chalkboardArt[id]}</svg>`;
}

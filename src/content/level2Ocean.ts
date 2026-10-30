// DRAFT. Level 2: alphabetic wordsigns
// (but, can, do, just, like, not, so, very, will, it, you, have).
import type { Level } from '../domain/story';

export const level2Ocean: Level = {
  title: 'Level 2: The Ocean',
  ambience: 'ocean-ambient',
  scenes: [
    {
      id: 'beach',
      title: 'The Beach',
      art: 'beach',
      lines: [
        'You and ARC reach',
        'the beach.',
        'The waves go swish.',
        '"Oh dear. I do not',
        'like water. I will',
        'rust. But I will be',
        'very brave!"',
      ],
    },

    {
      id: 'tidePool',
      title: 'The Tide Pool',
      art: 'tidePool',
      lines: [
        'You find a small pool',
        'in the rocks.',
        '"Something is in it!',
        'Can you guess?"',
        '"It has a shell.',
        'It can walk, but',
        'just to the side."',
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['What is it?'],
          choices: [
            { id: 'crab', label: 'crab' },
            { id: 'whale', label: 'whale', wrong: ['"A whale? Not in a', 'pool so small!"'] },
            { id: 'bird', label: 'bird', wrong: ['"A bird? It can not', 'fly. Read it again."'] },
          ],
          answers: ['crab'],
          correct: [['"A crab! It waved', 'at me. I think."']],
        },
      ],
    },

    {
      id: 'bigSplash',
      title: 'The Big Splash',
      art: 'whale',
      ambience: 'whale-ambient',
      cue: 'splash',
      lines: [
        'Splash! A big shape',
        'rises from the sea.',
        '"It is very big.',
        'It is not a fish.',
        'It can sing."',
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['What is it?'],
          choices: [
            { id: 'whale', label: 'whale' },
            { id: 'crab', label: 'crab', wrong: ['"A crab? It is very', 'big, not small."'] },
            { id: 'fish', label: 'fish', wrong: ['"Read it again.', 'It is not a fish."'] },
          ],
          answers: ['whale'],
          correct: [['"A whale! So big!', 'I feel so small."']],
        },
      ],
    },

    {
      id: 'oceanOrNot',
      title: 'Ocean or Not',
      art: 'sea',
      lines: [],
      questions: [
        {
          kind: 'pickAll',
          prompt: ['"Let us help my', 'memory. What will', 'you find in the sea?', 'Pick three."'],
          choices: [
            { id: 'fish', label: 'fish' },
            { id: 'crab', label: 'crab' },
            { id: 'whale', label: 'whale' },
            { id: 'cow', label: 'cow', wrong: ['"A cow? Cows do', 'not swim. I hope."'] },
            { id: 'cat', label: 'cat', wrong: ['"A cat? Cats do not', 'like water. Just', 'like me!"'] },
          ],
          answers: ['fish', 'crab', 'whale'],
        },
      ],
    },

    {
      id: 'arcRemembersSea',
      title: 'ARC Remembers',
      art: 'beach',
      cue: 'chime',
      lines: ["ARC's lights blink.", '"I remember now!', 'The sea is full of', 'life. Thank you!"'],
    },

    {
      id: 'nextChip2',
      title: 'The Next Chip',
      art: 'chip',
      lines: ['"Oh! One more chip!"', { before: 'It says: ', label: 'weather' }],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['What will you do here?'],
          choices: [
            { id: 'plant', label: 'Plant seeds' },
            { id: 'swim', label: 'Swim with fish' },
            { id: 'rain', label: 'Watch the rain' },
          ],
          answers: ['rain'],
          correct: [['"Up the hill we go!"']],
        },
      ],
    },
  ],
};

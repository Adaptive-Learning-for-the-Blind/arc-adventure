// DRAFT. Level 1: letters and simple words.
import type { Level } from '../domain/story';

export const level1Garden: Level = {
  title: 'Level 1: The Garden',
  ambience: 'garden-ambient',
  scenes: [
    {
      id: 'landing',
      title: 'The Landing',
      art: 'landing',
      lines: [
        'You step off the ship.',
        'The grass is tall.',
        'The air smells new.',
        'A robot rolls up.',
        '"Hello! Hello!',
        'I am ARC.',
        'I kept Earth safe',
        'while you were away."',
        '"Oh dear.',
        'My memory has gaps.',
        'These chips can help.',
        'Can you read one?"',
        'ARC holds up a chip.',
        { before: 'It says: ', label: 'garden' },
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['What will you do here?'],
          choices: [
            { id: 'plant', label: 'Plant seeds' },
            { id: 'swim', label: 'Swim with fish' },
            { id: 'rain', label: 'Watch the rain' },
          ],
          answers: ['plant'],
          correct: [['"Yes! Seeds!', 'Follow me!"']],
        },
      ],
    },

    {
      id: 'shed',
      title: 'The Shed',
      art: 'shed',
      cue: 'shed-door',
      lines: [
        'ARC rolls to a shed.',
        'The door creaks open.',
        '"Seeds live in here.',
        'I think. Probably."',
        'You find a box of',
        'seed packets.',
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['"We need beans', 'first! Which one', 'says bean?"'],
          choices: [
            { id: 'pea', label: 'pea' },
            { id: 'bean', label: 'bean' },
            { id: 'corn', label: 'corn' },
          ],
          answers: ['bean'],
          correct: [['"Bean! Splendid!"']],
        },
        {
          kind: 'pickOne',
          prompt: ['"Now the peas!', 'Which one says pea?"'],
          choices: [
            { id: 'pea', label: 'pea' },
            { id: 'bean', label: 'bean' },
            { id: 'corn', label: 'corn' },
          ],
          answers: ['pea'],
          correct: [['"Pea! Well done!"']],
        },
        {
          kind: 'pickOne',
          prompt: ['"Last, the corn!', 'Which one says', 'corn?"'],
          choices: [
            { id: 'pea', label: 'pea' },
            { id: 'bean', label: 'bean' },
            { id: 'corn', label: 'corn' },
          ],
          answers: ['corn'],
          correct: [['"Corn! Oh, I do', 'love corn. I think."']],
        },
      ],
    },

    {
      id: 'cards',
      title: 'The Cards',
      art: 'cards',
      lines: ['ARC finds four cards.', '"Oh no! I dropped', 'them. Now they are', 'all mixed up."'],
      questions: [
        {
          kind: 'pickInOrder',
          prompt: ['"What do we do first?"'],
          nextPrompt: ['"What is next?"'],
          choices: [
            { id: 'dig', label: 'dig' },
            { id: 'plant', label: 'plant' },
            { id: 'water', label: 'water' },
            { id: 'wait', label: 'wait' },
          ],
          answers: ['dig', 'plant', 'water', 'wait'],
          correct: [
            ['"Dig! Of course!"'],
            ['"Plant! In they go!"'],
            ['"Water! Not too', 'much!"'],
            ['"Wait! Hmm. I am not', 'good at that."'],
          ],
        },
      ],
    },

    {
      id: 'wait',
      title: 'The Wait',
      art: 'wait',
      ambience: 'waiting-ambient',
      lines: ['You wait.', 'ARC waits.', '"Is it growing yet?"', '"How about now?"', '"Now?"'],
    },

    {
      id: 'needs',
      title: 'What Plants Need',
      art: 'needs',
      lines: [],
      questions: [
        {
          kind: 'pickAll',
          prompt: ['"While we wait,', 'let us help it grow.', 'What do seeds need?', 'Pick three."'],
          choices: [
            { id: 'sun', label: 'sun' },
            { id: 'rock', label: 'rock', wrong: ['"A rock? Seeds can', 'not eat rocks!"'] },
            { id: 'water', label: 'water' },
            { id: 'candy', label: 'candy', wrong: ['"Candy? Oh my.', 'Seeds do not', 'have teeth!"'] },
            { id: 'soil', label: 'soil' },
          ],
          answers: ['sun', 'water', 'soil'],
          correct: [['"Yes!"'], ['"Good!"'], ['"That is all three!"']],
        },
      ],
    },

    {
      id: 'sprouts',
      title: 'Sprouts',
      art: 'sprouts',
      cue: 'chime',
      lines: [
        'Look! Little green',
        'sprouts pop up!',
        "ARC's lights blink.",
        '"I remember now!',
        'Seeds need sun,',
        'water, and soil.',
        'Thank you, friend!"',
      ],
    },

    {
      id: 'nextChip1',
      title: 'The Next Chip',
      art: 'chip',
      lines: [
        'ARC finds a new chip',
        'in its pocket.',
        '"Oh! Another one!',
        'Can you read it?"',
        { before: 'It says: ', label: 'ocean' },
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['What will you do here?'],
          choices: [
            { id: 'plant', label: 'Plant seeds' },
            { id: 'swim', label: 'Swim with fish' },
            { id: 'rain', label: 'Watch the rain' },
          ],
          answers: ['swim'],
          correct: [['"To the sea!"']],
        },
      ],
    },
  ],
};

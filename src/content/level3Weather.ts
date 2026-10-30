// DRAFT. Level 3: numbers and the number sign.
import type { Level } from '../domain/story';

export const level3Weather: Level = {
  title: 'Level 3: The Weather',
  ambience: 'wind-ambient',
  scenes: [
    {
      id: 'hill',
      title: 'The Hill',
      art: 'hill',
      lines: [
        'You climb a hill.',
        'The wind blows hard.',
        'A small box sits',
        'on top. It has',
        'buttons and a cup.',
        '"A weather station!',
        'Oh, but it is broken."',
        'ARC turns around.',
        '"Can you read the',
        'label on my back?"',
        { before: 'It says: ', label: 'ARC-7' },
        '"ARC-7! That is my',
        'whole name! I forgot!"',
      ],
    },

    {
      id: 'buttons',
      title: 'The Buttons',
      art: 'station',
      lines: ['The station has', 'a chart.', '1 sun', '2 rain', '3 wind'],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['"The garden needs', 'rain. Which button?"'],
          choices: [
            { id: '1', label: '1', wrong: ['"Button 1 is sun.', 'Read the chart', 'again."'] },
            { id: '2', label: '2' },
            { id: '3', label: '3', wrong: ['"Button 3 is wind.', 'Read the chart', 'again."'] },
          ],
          answers: ['2'],
          correct: [['"Button 2!', 'I hear thunder!"']],
        },
      ],
    },

    {
      id: 'rainCup',
      title: 'The Rain Cup',
      art: 'rainCup',
      ambience: 'rain-ambient',
      lines: ['Rain falls in the cup.', { before: 'The cup says: ', label: '4' }],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['"The garden needs 6.', 'How many more?"'],
          choices: [
            { id: '1', label: '1' },
            { id: '2', label: '2' },
            { id: '3', label: '3' },
          ],
          answers: ['2'],
          correct: [['"2 more! Clever!"']],
          wrong: ['"Hmm. Count up', 'from 4 to 6."'],
        },
      ],
    },

    {
      id: 'hotOrCold',
      title: 'Hot or Cold',
      art: 'thermometer',
      lines: [
        'The station shows',
        { before: 'a number: ', label: '90' },
        '"Big numbers are hot.',
        'Small numbers are cold."',
      ],
      questions: [
        {
          kind: 'pickOne',
          prompt: ['"What should we wear?"'],
          choices: [
            { id: 'shorts', label: 'shorts' },
            { id: 'coat', label: 'a coat' },
            { id: 'mittens', label: 'a hat and mittens' },
          ],
          answers: ['shorts'],
          correct: [['"Shorts! I will just', 'wear my paint."']],
          wrong: ['"Brr? No.', '90 is hot!"'],
        },
      ],
    },

    {
      id: 'arcRemembersWeather',
      title: 'ARC Remembers',
      art: 'sprouts',
      ambience: 'garden-ambient',
      lines: [
        "ARC's lights blink.",
        '"I remember now!',
        'Rain helps the garden.',
        'Sun warms the sea.',
        'It all fits!"',
        'Down the hill, the',
        'sprouts drink the rain.',
      ],
    },

    {
      id: 'end',
      title: 'The End of the Demo',
      art: 'end',
      ambience: 'garden-ambient',
      lines: [
        'The families come out',
        'of the ship.',
        'They see the garden.',
        'They see the sea.',
        '"You did it, friend!',
        'Earth is waking up.',
        'More chips soon!"',
      ],
    },
  ],
};

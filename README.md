# ARC Adventure (demo prototype)

A choice-based text adventure that teaches braille reading to kids ages 5 to 7.
A three-level demo for Adaptive Learning for the Blind.

People are coming back to Earth after generations in space. A robot named ARC
stayed behind. Its memory is on chips with braille labels. The player reads
each chip, solves reading puzzles, and helps ARC remember.

- Level 1, The Garden: letters and simple words.
- Level 2, The Ocean: alphabetic wordsigns.
- Level 3, The Weather: numbers and the number sign.

**All story text is a DRAFT.** It comes from
`braille-puzzles/arc-adventure-script.md`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # puzzle rules, content rules, focus behavior
npm run build      # type check + production build in dist/
```

## Editing the story (writers)

Everything the player reads is in `src/content/`:

- `arcAdventure.ts`: game title, button and sound-control labels, ARC's default right and wrong lines, and the level order.
- `level1Garden.ts`, `level2Ocean.ts`, `level3Weather.ts`: one file per level.

The engine never hard-codes story text.

**How a scene works.** Each scene has a title, story lines, and optional
questions. Questions are asked one at a time. After each pick, ARC replies, and:

- Right pick: the next question, or "What is next?" for cards, or a Next button when the scene is done.
- Wrong pick: ARC's reply, then the same question again. Wrong answers never end the game.
- Choices are shuffled each time a question appears. Turn this off with `shuffleChoices: false`.

**Question types.**

- `pickOne`: one right answer.
- `pickAll`: every answer, any order. Picked choices leave the list.
- `pickInOrder`: every answer, in order. Picked choices leave the list.

**Lines.**

- Aim for 20 characters or fewer per line. `npm test` lists longer lines as a warning.
- `{ before: 'It says: ', label: 'garden' }` marks a word the player reads. It shows in a box on screen. Screen readers read the whole line as plain text.
- `correct` lists ARC's reply for each right pick, in order. `wrong` on a choice is ARC's reply for that choice. Anything missing uses the defaults in `arcAdventure.ts`.
- Plain text only. `npm test` fails on Unicode braille characters and on "arc" not in all caps.
- Set `status: 'final'` in `arcAdventure.ts` to remove the "Draft text." notice.

**Sound and art ids.** Each scene names an `art` id and can override the
level's `ambience` or add a one-time `cue`, by cue name (`garden-ambient`,
`shed-door`, `chime`...). The names are listed in `src/domain/story.ts`.

## Sounds

Every sound is in one table, `src/infrastructure/soundCues.ts`, by cue name:

| Cue | Used in | Placeholder sound |
| --- | --- | --- |
| `garden-ambient` | Level 1, end of level 3 | birds, soft breeze, leaves |
| `waiting-ambient` | 1.4 The Wait | crickets, slow clock tick |
| `ocean-ambient` | Level 2 | waves, gulls |
| `whale-ambient` | 2.3 The Big Splash | waves, low whale song |
| `wind-ambient` | Level 3 | wind, distant thunder |
| `rain-ambient` | 3.3 The Rain Cup | rain on a tin cup |
| `shed-door` | 1.2 The Shed | creaky door |
| `chime` | 1.6 Sprouts, 2.5 ARC Remembers | soft chime |
| `splash` | 2.3 The Big Splash | big splash |

Each cue plays a synthesized placeholder (`src/infrastructure/synthSounds.ts`) or a recorded file. To use a recording:

1. Put the file in `public/sounds/`, for example `public/sounds/chime.mp3`. MP3 or M4A plays in every browser.
2. In `soundCues.ts`, add the file to the cue: `chime: { file: 'chime.mp3', synth: synth.chime }`.

The recording plays instead of the synth. If the file is missing or won't decode, the synth plays and the browser console says why. `*-ambient` cues loop the whole file, so trim it to loop without a click. `volume` (0 to 1) on a cue balances it against the others. No game code changes.

## Code layout

| Folder | Role | Depends on |
| --- | --- | --- |
| `src/domain` | Content types, puzzle rules, shuffle | nothing |
| `src/application` | `GameSession`: where the player is, and a `Screen` model for the UI | domain |
| `src/content` | Story data (draft) | domain types |
| `src/infrastructure` | Sound cue table, synth placeholders, sound player, saved sound settings | domain types |
| `src/ui` | DOM rendering, focus, SVG art, sound controls, CSS | application, domain |
| `src/main.ts` | Wires everything together | all |

## Accessibility decisions

- **Reading mode stays on.** No `role="application"`. Story lines are plain `<p>` elements, so players read them with braille display panning in normal reading mode.
- **Focus on a new scene** moves to the scene's `<h1>`. The page title changes too, for example "The Landing - Level 1: The Garden - ARC Adventure".
- **Focus after a pick** moves to the first line of ARC's reply, not a live region. Live-region messages show briefly on a braille display and then vanish. A focused line stays until the player pans away. The question and choices come right after the reply.
- **Choices are native `<button>`s** in a list, so screen readers say how many there are.
- **Next appears only when the scene is done**, so there is one way forward.
- **Level names** show under the heading on the first scene of each level.
- **Art is decorative** (`aria-hidden="true"`). It only shows what the story text and sound already say, and never an answer (cards stay face down, no seed pictures, no sun or sea in level 1). Level 1 is picture-book art in `src/ui/art/` (flat colors, no outlines); levels 2 and 3 still use the older chalkboard art. `npm test` checks ARC and the cue shapes are 3:1 against what is behind them. Preview every scene at `/artPreview.html` while `npm run dev` runs.
- **Motion** follows the sound: grass and tree sway and birds fly in the garden, the sky turns to evening during the crickets, the shed door opens with the creak, sprouts pop up and ARC's lights blink (3 times, under 2 a second) with the chime. With `prefers-reduced-motion: reduce` nothing moves and each picture shows its end state.
- **Sound** starts only after the first click. It is quiet by default. Mute (`aria-pressed`) and a volume slider sit at the top of the page. Settings are saved in this browser.
- **Placeholder audio.** All sound is synthesized with the Web Audio API for now. Recordings can replace any cue; see Sounds above.
- **Size.** 24px base text. Choice buttons are at least 64px tall. No horizontal scroll at 320px wide.

## Test results (October 30, 2026)

- Unit and DOM tests: 33 passed. They cover puzzle rules, art contrast, the sound cue table, recording-or-synth playback, shuffling, content rules, heading and reply focus, per-choice replies, removed cards, a full play-through of all three levels, and restart.
- axe-core (WCAG 2.0, 2.1, and 2.2 A and AA, plus best practices): 0 violations in 28 game states, including after wrong answers.
- Reflow at 320px wide: no horizontal scroll.
- **VoiceOver: not tested yet.** Automated runs need "Allow VoiceOver to be controlled with AppleScript" turned on in VoiceOver Utility > General.

## Lines over 20 characters

These lines come from the script and are kept as written. They pan on a 20-cell display.

| Chars | Line |
| --- | --- |
| 24 | Small numbers are cold." |
| 23 | sprouts drink the rain. |
| 22 | You step off the ship. |
| 22 | What will you do here? |
| 22 | "What do we do first?" |
| 22 | Oh, but it is broken." |
| 22 | whole name! I forgot!" |
| 22 | Rain falls in the cup. |
| 22 | "What should we wear?" |
| 22 | Rain helps the garden. |
| 21 | while you were away." |
| 21 | These chips can help. |
| 21 | The door creaks open. |
| 21 | ARC finds four cards. |
| 21 | You find a small pool |
| 21 | "Big numbers are hot. |
| 21 | The families come out |

## Notes for the writer

- The script has no right-answer reply for 2.4 (Ocean or Not). For now ARC says "Yes!" (`defaultCorrect`).
- The title screen ("ARC Adventure", "Start") is not in the script. It is there because sound can't start before the first click.
- ARC's one-line replies in the script are split into short lines, for example "Corn! Oh, I do" / "love corn. I think."
- Choices are reshuffled after a wrong answer, as the script says. Watch whether this confuses kids who try the buttons one by one.

## VoiceOver script (Safari, macOS)

1. Run `npm run dev` and open the page in Safari. Press Cmd+F5 to turn on VoiceOver.
2. Expect "ARC Adventure, heading level 1" and a Start button. Press Start (VO+Space).
3. Expect focus on "The Landing, heading level 1", then "Level 1: The Garden". Birds and breeze start.
4. VO+Right through the story. "It says: garden" should read as one line. Then "What will you do here?" and a list of 3 buttons.
5. Press "Swim with fish". Expect "Hmm. Let us read" right away, then the question again and the 3 buttons in a new order.
6. Press "Plant seeds". Expect "Yes! Seeds!", "Follow me!", then a Next button.
7. In The Shed, a creak plays. Answer the three seed questions. Each right answer should be read, followed by the next question.
8. In The Cards, press "dig". Expect "Dig! Of course!", then "What is next?" and only 3 cards left.
9. In What Plants Need, press "candy". Expect "Candy? Oh my."
10. In Level 2 and 3, check the level name is read on the first scene. Check that "ARC-7", "1 sun", and "It says: 90" read well.
11. On The End of the Demo, press "Play again". Focus should return to "ARC Adventure".
12. VO+Shift+Up to the top. Check "Mute, toggle button" and "Volume, 50%, slider" work.
13. Turn on Reduce Motion (System Settings > Accessibility > Display) and reload. Nothing should move.

## Needs a human with a braille display

1. **Braille code.** Level 2's wordsigns only show in contracted braille. Contracted braille also shortens "the", "and", "you", "can", "garden" (ar, en), and "water" (er) in level 1. Decide which table each level expects and tell parents or teachers.
2. **Line fit with role markers.** VoiceOver adds markers like "h1" or "btn". "Swim with fish btn" is 18 cells. Check headings, buttons, and replies on 14- and 20-cell displays.
3. **Heading focus.** On each new scene, does the display jump to the heading, and does panning read the story in order?
4. **Reply focus.** After a pick, does ARC's reply stay on the display until the child pans? Is it clear the question follows?
5. **Shuffled and removed buttons.** Is it confusing when buttons change order, or when a card leaves the list?
6. **Routing keys.** Do cursor routing keys press the choices and Next?
7. **Read labels.** "It says: garden" is one plain line on the display. Is the label word easy to find?
8. **Numbers and the number sign.** Check "ARC-7", "1 sun", "4", "6", and "90" in level 3.
9. **Quotes and punctuation.** ARC's speech uses quote marks across several lines. Check they don't confuse young readers.
10. **ARC in caps.** Check how "ARC" shows (capital indicators) and how VoiceOver says it.
11. **Sound controls.** Can the child find and use Mute and the volume slider from the display?
12. **Other screen readers.** With JAWS and NVDA, confirm the page stays in browse mode and heading focus works.
13. **Sound level.** At the default volume, does the ambience stay below speech?

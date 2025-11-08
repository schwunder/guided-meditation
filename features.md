## Sequence Presentation

- Sequence lives in a single stage: `presentSequenceItem` loads media, `activateStage` swaps it in, CSS handles fades/holds.
- Checkpoint dwell comes from CSS `--checkpoint-hold-ms`; transitions end when the cached `<video>` fires `ended`.
- Stage teardown listens to the same CSS fade duration, keeping visuals + JS timing aligned.

## Captions

- Caption element sits below `.media-wrapper` and is reused for every checkpoint or transition.
- Text stays static per step; JS doesn’t update copy yet.
- Keep caption styling subtle so it complements the media focus.

## Caption Copy

- Checkpoint `Meditation room`: caption text “Meditation room”.
- Transition between checkpoints: caption text “Things change” while moving toward the next state.
- Checkpoint `Communal meditation`: caption text “Communal meditation”, followed by the choice prompts:
  - “Choice A: Go to the kitchen.”
  - “Choice B: Go to the bathroom.”
- Checkpoint `I do`: caption text “I do”, followed by the choice prompts:
  - “Choice A: Read in the backyard.”
  - “Choice B: Go to a workshop.”
- Checkpoint `I love`: caption text “I love — Have a chat with one of the meditation teachers.”, followed by the choice prompts:
  - “Choice A: Join the chaplain study hall.”
  - “Choice B: Continue the conversation.”
- Checkpoint `I talk`: caption text “I talk”, followed by the choice prompts:
  - “Choice A: Discuss meditation apps at Casa Chola with Tessa over steak.”
  - “Choice B: Go on a hike with Consciousness on the eightfold path.”


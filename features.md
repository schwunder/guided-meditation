## Active context

- Architecture uses three layers: asset loader (media readiness), stage manager (DOM swaps + transitions), sequence controller (timeline flow). Keep notes aligned with that terminology for other agents.
- CSS variables (`--transition-duration-fade`, `--checkpoint-hold-ms`) remain the timing contract; JS reads them, so update both sides in sync.

## Completed sequence work

- Unified everything under `presentSequenceItem`, reusing the stage manager for checkpoints and transitions.
- Shifted dwell/advance timing to CSS variables (`--checkpoint-hold-ms`, `--transition-duration-fade`) so JS just reads the contract.
- Removed bespoke helpers (`playCheckpointItem`, `playTransitionItem`, `SEQUENCE_HANDLERS`) in favor of the stage manager orchestrating all media swaps.

## Upcoming: extended hue sequence

- Stretch the timeline to: checkpoint → transition → checkpoint → transition → checkpoint.
- After the second checkpoint, flip a CSS hue variable so the border/glow accent shifts for the remaining steps.
- Keep captions and asset loader behavior unchanged; only the stage visuals and color accent respond to the new hue.

## Captions

- Caption element sits below `.media-wrapper`, reused per checkpoint/transition.
- Text remains static per step; caption updates are pending (another agent is wiring copy changes).
- Styling should stay subtle so it complements the media focus.

## Caption copy

- Checkpoint `Meditation room`: “Meditation room”.
- Transition between checkpoints: “Things change” while moving toward the next state.
- Checkpoint `Communal meditation`: “Communal meditation”.
  - “Choice A: Go to the kitchen.”
  - “Choice B: Go to the bathroom.”
- Checkpoint `I do`: “I do”.
  - “Choice A: Read in the backyard.”
  - “Choice B: Go to a workshop.”
- Checkpoint `I love`: “I love — Have a chat with one of the meditation teachers.”
  - “Choice A: Join the chaplain study hall.”
  - “Choice B: Continue the conversation.”
- Checkpoint `I talk`: “I talk”.
  - “Choice A: Discuss meditation apps at Casa Chola with Tessa over steak.”
  - “Choice B: Go on a hike with Consciousness on the eightfold path.”
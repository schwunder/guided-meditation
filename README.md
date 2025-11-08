# Guided Meditation

Interactive guided meditation experience served from `public/index.html` with image checkpoints and video transitions.

## Project Folders
- `public/` – static entrypoint and player script.
- `public/assets/` – media library used by the sequence.
- `public/assets/archive/` – longer-form background videos.
- `public/assets/chakras/` – chakra imagery.
- `public/assets/checkpoints/` – still checkpoints.
- `public/assets/transitions/` – motion transitions between checkpoints.

## How the player works
- `runSequence` walks the meditation timeline; each item is rendered by `presentSequenceItem`.
- Media elements are cached once via `ensureMediaEntry`, then reused so transitions never flicker.
- Stage swaps live in `activateStage`, which coordinates the active layer and lets CSS fades dictate timing.
- Checkpoint dwell and fade durations come from CSS (`--checkpoint-hold-ms`, `--transition-duration-fade`), keeping presentation rules declarative.
- Captions sit directly in the HTML below the stage and stay static per checkpoint.


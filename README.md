# Guided Meditation
Interactive guided meditation experience served from `public/index.html` with checkpoint images and transition videos.
## Architecture Overview
| Layer | Responsibilities |
| --- | --- |
| HTML & CSS shell | `public/index.html` defines the single-page layout (`#asset-container`) and global styling; CSS variables such as `--transition-duration-fade` and `--checkpoint-hold-ms` keep JavaScript in sync; animations like `radiateBorder` live here so visuals can update without touching the player logic. |
| JavaScript orchestration (`public/main.js`) | `ensureMediaEntry` builds and caches `<img>`/`<video>` elements while surfacing preload errors; `buildStage`/`activateStage`/`scheduleStageRemoval` swap stages, rely on CSS fades, and clean up even when `transitionend` misfires; `runSequence` iterates `MEDITATION_SEQUENCE`, with `presentSequenceItem` and `waitForStage` blocking on checkpoint holds or video playback. |
## Working with the project
Add media to `public/assets/...` and reference it in `MEDITATION_SEQUENCE`; tune presentation by adjusting CSS variables or animations in `index.html` (JavaScript reads the updated timing); extend the orchestration layer to pause `runSequence`, react to events, or branch the sequence.
## Project folders
`public/` static entry point and player script; `public/assets/` full media library; `public/assets/archive/` background or experimental footage; `public/assets/chakras/` chakra imagery; `public/assets/checkpoints/` still checkpoint images; `public/assets/transitions/` motion transitions between checkpoints.


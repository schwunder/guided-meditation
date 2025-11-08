# Guided Meditation

Interactive guided meditation experience delivered from `public/index.html` with checkpoint images and transition videos.

## Architecture Overview

### HTML & CSS shell
- `public/index.html` defines the single-page layout (`#asset-container`) and global styling.
- CSS variables such as `--transition-duration-fade` and `--checkpoint-hold-ms` act as the presentation contract that JavaScript reads to stay in sync with fades and holds.
- Animations (e.g., `radiateBorder`) live here, so visual tweaks can ship without touching the player logic.

### JavaScript orchestration (`public/main.js`)
- **Asset loading** – `ensureMediaEntry` builds/cache `<img>` and `<video>` elements, resolving when they are ready or surfacing preload errors early.
- **Stage lifecycle** – `buildStage`, `activateStage`, and `scheduleStageRemoval` swap stages, rely on CSS for fades, and clean up old nodes even when `transitionend` misfires.
- **Sequence control** – `runSequence` iterates through `MEDITATION_SEQUENCE`, using `presentSequenceItem` and `waitForStage` to block on checkpoint holds or video playback.

## Working with the project
- Add new media to `public/assets/…` and reference it in `MEDITATION_SEQUENCE`.
- Tune presentation by adjusting CSS variables/animations in `index.html`; JS will automatically respect updated timing.
- Introduce interactivity by extending the orchestration layer (e.g., pause `runSequence`, react to user events, branch the sequence).

## Project folders
- `public/` – static entry point and player script.
- `public/assets/` – full media library used by the sequence.
- `public/assets/archive/` – background or experimental footage.
- `public/assets/chakras/` – chakra imagery collection.
- `public/assets/checkpoints/` – still checkpoint images.
- `public/assets/transitions/` – motion transitions between checkpoints.


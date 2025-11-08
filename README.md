# Guided Meditation
Interactive guided meditation experience served from `public/index.html`, powered by a JSON-driven sequence and template-cloned stages.

## Architecture Overview
| Layer | Responsibilities |
| --- | --- |
| HTML & CSS shell | `public/index.html` defines the single-page layout (`#experience`, `#asset-container`), embeds the `<template id="stage">`, and exposes timing/visuals through CSS variables such as `--transition-duration-fade`, `--checkpoint-hold-ms`, and `--accent-hue-*`. Utility classes (`.radiant-border`, `.caption`, `.choices`) keep styling declarative. |
| Data pipeline | `public/sequence.json` lists the playback order, while `public/checkpoint-metadata.json` enriches each asset with captions and descriptions. |
| JavaScript orchestration (`public/main.js`) | Bootstraps by fetching JSON, merging metadata, and streaming items through an async `timeline()` iterator. `createMediaFactory()` preloads and caches media, the stage composer clones the HTML template, the hue controller mirrors CSS palette shifts, and a tiny status store drives the banner UI for progress/errors. |
| Dev server (`server.js`) | Bun server that serves the HTML shell, `main.js`, JSON feeds, and any static asset under `public/`, including future metadata files. |

## Working with the project
- Add or reorder scenes in `public/sequence.json`; enrich assets via `public/checkpoint-metadata.json` to surface `title`/`description` in captions and `alt` text.
- Drop new media files under `public/assets/...`; the media factory reads the same paths you reference in the sequence.
- Adjust timing, hues, and layout directly in `public/index.html` with CSS custom properties; the JavaScript reads these values at runtime.
- The status banner surfaces preload progress or failures via the observable store—extend it by subscribing additional UI elements if needed.

## Project folders
`public/` static entry point and player script; `public/assets/` full media library; `public/assets/archive/` background or experimental footage; `public/assets/chakras/` chakra imagery; `public/assets/checkpoints/` still checkpoint images; `public/assets/transitions/` motion transitions between checkpoints.


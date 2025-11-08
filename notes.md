- **Refactor checkpoint flow** — Consolidated orchestration into `timeline()` + `initTimeline()`. Choice handling now lives in the HTML template, and CSS still dictates timing/layout through custom properties.
- **Repo essentials** — `public/index.html` hosts the stage template, utility classes, and CSS variables. `public/main.js` handles data loading, media factory caching, template composition, hue shifts, and status publishing. `server.js` serves every static file under `public/`, including new JSON feeds.
- **Asset metadata** — `public/checkpoint-metadata.json` enriches each asset with `title`/`description` used for captions and `alt` text. Sequence entries live in `public/sequence.json`.
- **Current technical model** — the **media factory** normalizes preload/reset across media types; the **stage composer** clones `<template id="stage">` and toggles `has-choices`; the **status store** fans out preload/progress messages; the **hue controller** still flips `--accent-hue` after the second checkpoint.
- **Next investigations**
  - Branching logic or conditional timelines that pause the base iterator.
  - Ambient audio layering support (preload, sync, fade control).
  - Telemetry hook for skipped assets and fatal errors.
  - Progressive enhancement for browsers with limited `fetch`/template support.



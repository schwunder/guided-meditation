# Aggressive Refactor Playbook

## Guardrails we keep
- Single timeline controller: sequence orchestration stays in one module; helpers exist only if they shrink the loop.
- CSS owns timing: JavaScript may read `--transition-duration-fade` / `--checkpoint-hold-ms` but never restates milliseconds.
- Log deletion targets: whenever a helper becomes redundant, leave a breadcrumb so the next sweep can delete it.

## Slash `public/main.js`
- Import data, don’t author it: shift `MEDITATION_SEQUENCE` into `public/sequence.json`, enrich with `checkpoint-metadata.json` on load, and delete the hand-authored array.
- One media factory: collapse image/video setup into `createMediaEntry(asset, type)` returning `{element, ready, reset}`; replace `ensureMediaEntry`, duplicated listeners, and special-case state.
- Template-driven DOM: scrap `buildCaptionBlock`, `buildStage`, `activateStage`; instead clone a `<template id="stage">` defined in HTML that already contains caption and choice slots.
- Linear async pipeline: distill preload + play into `for await (item of timeline(sequence))`, letting one iterator handle hue shifts, stage swaps, and errors.
- Observable status: expose a tiny `{subscribe, publish}` store for the status banner so error/reporting code shrinks to one-liners.

## Shrink `public/index.html`
- Inline CSS discipline: keep styling inside `public/index.html`, prune duplicate declarations, and lean on custom properties + utility classes instead of copy-pasted rules.
- Utility classes over properties: define `.radiant-border`, `.caption`, `.choices` to express styling via custom properties instead of repeated declarations.
- Embed stage template: add `<template id="stage">` with the figure/media/caption skeleton; JavaScript only clones and fills text.
- Minimal markup skeleton: reduce the body to `<main id="experience">`, `#asset-container`, and `#status-banner`; push decorative layers into CSS pseudo-elements.

## Extend `server.js`
- Serve JSON assets: add routes for `/sequence.json` and `/checkpoint-metadata.json` (and future JSON under `public/`) using the same static response pathing as other assets.

## Execution bursts
- **Burst 1 — Data plumbing:** author `sequence.json`, wire lazy fetch + metadata merge, drop the JS literal, keep cache keys by asset path.
- **Burst 2 — Media factory:** implement unified preload/reset logic and update all callers, logging the branches removed.
- **Burst 3 — Template flow:** migrate DOM assembly to template cloning, gate optional choices via fragments, and confirm CSS variables still own layout.
- **Burst 4 — Timeline tighten:** collapse preload/run/status controllers into a sub-100 LOC module exporting `initTimeline({container, status})`.
- **Burst 5 — HTML/CSS diet:** tighten inline CSS, collapse markup, introduce utility classes, and leave TODOs for any styles still duplicative.
- **Burst 6 — Server coverage:** extend `server.js` routing to serve JSON assets alongside existing static mappings.


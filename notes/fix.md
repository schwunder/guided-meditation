# Fixes Documentation

## Completed Fixes

**Architecture (2025-11-08):** Transitioned from JSON-driven to HTML-embedded `SCENES` array; removed `main.js`, obsolete HTML files, and external JSON fetching. **Media (2025-11-08):** Introduced `mediaCache` Map with preloading and fail-open timeouts (2000ms). **UI/UX (2025-11-09):** Fixed caption spelling, simplified choice UI, improved semantic HTML and CSS organization. **Deployment (2025-11-09):** Converted absolute to relative asset paths for GitHub Pages; added automated deployment workflow. **Code Quality (2025-11-07):** Refactored into semantic sections; removed gallery view.

## Outstanding Fixes

| Issue | Observed · Impact · Fix |
| --- | --- |
| Skipped asset telemetry | Observed: media preloading errors only log to console via `console.error`; Impact: production incidents go undetected; Fix: forward failed asset metadata to a reporting endpoint or persist to local diagnostics for later analysis. |
| Coarse preload feedback | Observed: no visual feedback during media preload; Impact: long video fetches leave users on blank page unsure if app is loading; Fix: add progress indicator showing X/Y assets loaded, or per-asset progress events. |
| Path state visualization | Observed: branching choices work but users can't see which paths they've taken; Impact: users may forget their choices through 8 scenes; Fix: add visual breadcrumb or summary showing path taken (e.g., "left → right → left"). |

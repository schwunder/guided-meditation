# Static Sequence Architecture (Completed)

## Current State
The refactor to static HTML inline architecture is **complete**. All code is now inline in `public/index.html` (CSS, JavaScript, and HTML structure all in one file).

## Architecture Principles (Achieved)

### HTML-First Flow ✅
- All sequences encoded directly in `public/index.html` within the `SCENES` JavaScript array
- Scene data, captions, and media references are defined inline
- JavaScript never fabricates DOM - only manipulates existing elements

### CSS for Presentation ✅
- All styling in CSS (`<style>` block)
- Visual changes (layout, transitions, colors) handled via CSS
- JavaScript only toggles class names and updates `dataset.scene` attribute
- CSS custom properties control theming (`--hue`, `--sat`, `--lum`, `--breath`, etc.)
- Scene-specific theming via `:root[data-scene="N"]` attributes (N = 1-8)

### Lean JavaScript ✅
- JavaScript in `<script>` block
- No ternaries; uses straightforward `if`/`else` blocks
- Logic focused on progression (`runShow()`, `playStep()`) and event wiring (`waitForArrowChoice()`)
- Media caching via `mediaCache` Map
- Choice system via `choiceByKey` object

### Quiet Logging ✅
- Only `console.error()` for real failures
- No status banners, success toasts, or verbose diagnostics
- Fail-open error handling (media preload timeouts, graceful degradation)

## Implementation Details

### Scene Structure
- 8 scenes defined in `SCENES` array: 'one' through 'eight'
- Each scene has `{ id, phases: { intro, transition, outro } }`
- Step types: simple, interactive (choice), conditional (dependsOn), compound (reveal + choice)

### Media Handling
- Single `mediaCache` Map stores all preloaded assets (url → Image|HTMLVideoElement)
- `preload()` function with fail-open 2000ms timeout per video
- Boot script collects all URLs before calling `runShow()`

### Server Setup ✅
- `server.js` serves static files only (no JSON routes)
- Serves `/` → `index.html`, `/assets/*` → asset files
- No dynamic endpoints needed

## Follow-up Ideas
- Revisit accessibility (ARIA labels, keyboard focus management)
- Add per-asset progress feedback during preload
- Implement touch/pointer events for mobile choice interaction
- Build out 7-chakra sequence plan (see `notes/features.md`)


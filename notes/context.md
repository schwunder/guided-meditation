# Domain Context

**Project**: Interactive guided meditation with inline JavaScript `SCENES` array and CSS-based theming  
**Target**: Modern web browsers (Chrome, Firefox, Safari, Edge)

## Browser Constraints

**Works:** HTML5 video (`playsinline`, `muted`, `autoplay`), CSS custom properties, animations, Map-based caching, arrow key navigation.

**Edge Cases:** Video autoplay policies (muted + gesture fallback), large video preloading (network dependent), CSS backdrop-filter (Safari needs `-webkit-`), mobile playback (`playsinline`).

**Not Used:** Web Audio API, Service Workers, IndexedDB, Pointer/Touch events (keyboard only).

## Feature Readiness

| Feature | Status | Notes |
|---------|--------|-------|
| Scene playback | ✅ | `runShow()` iterates 8 scenes |
| Media preload | ✅ | `mediaCache` Map with fail-open timeouts |
| Caption display | ✅ | Dynamic rendering per step |
| Choice interaction | ✅ | Arrow keys (← / →) |
| Hue transitions | ✅ | CSS `:root[data-scene="N"]` theming |
| Branching paths | ✅ | 3 choice points with conditional rendering |
| Ambient audio | 🚫 | Not implemented |
| Progress persistence | 🚫 | Not implemented |

## Data Schema

**Scene Structure:** Defined in `SCENES` array within `public/index.html`. Each scene has `{ id, phases: { intro, transition, outro } }`.

**Step Types:**
- **Simple:** `{ type: 'image'|'video', src, caption }`
- **Interactive:** `{ type, caption, left, right, choiceKey, captionLeft, captionRight }`
- **Conditional:** `{ type, left, right, dependsOn }` (follows previous choice)
- **Compound:** `{ type, caption, left, right, dependsOn, choiceKey }` (reveal result + prompt next)

## Asset Organization

**Checkpoints:** `public/assets/checkpoints/` - PNG images (`1-1.png` through `8-2.png` with branching variants `2-2a.png`, `2-2b.png`, etc.)

**Transitions:** `public/assets/transitions/` - MP4 videos (`1.mp4`, `2a.mp4`, `2b.mp4`, etc., numbered to match scenes)

**Naming:** Checkpoints `{scene}-{phase}.png`; Transitions `{scene}{variant}.mp4` (a/b variants for branching).

## Performance & Compatibility

**Performance:** Initial load < 1s (inline code), first scene < 3s (preload dependent), transitions < 500ms (CSS fade), low memory (Map cache), eager preload strategy.

**Compatibility:** Tested on Chrome/Edge, Firefox, Safari (latest). Requires ES2020 (Maps, async/await), CSS custom properties, HTML5 video, arrow key events, `dataset` API. No polyfills needed.

## Architecture Principles

**Single-File Inline:** All code in `public/index.html` (CSS in `<style>`, JS in `<script>`), no external files or JSON fetching.

**Scene Flow:** 8 scenes ('one' through 'eight'), each with 3 phases (`intro`, `transition`, `outro`). `runShow()` iterates sequentially, `playStep()` handles phases, `rootEl.dataset.scene` triggers CSS theme changes.

**Media Caching:** `mediaCache` Map (url → Image|HTMLVideoElement), `preload()` with 2000ms fail-open timeout, boot script collects URLs before `runShow()`.

**Choice System:** `choiceByKey` stores choices ('left'|'right'), `waitForArrowChoice()` listens for ArrowLeft/ArrowRight, `dependsOn` reads from `choiceByKey`. Patterns: choice-only, reveal-only, compound.

**CSS-Driven Theming:** Colors via `:root[data-scene="1"]` through `:root[data-scene="8"]`, sets `--hue`, `--sat`, `--lum`. JS only updates `dataset.scene`, CSS handles rest.

**Quiet Logging:** Only `console.error()` for failures, no success banners, fail gracefully.

**Server:** `server.js` serves static files from `public/`, no dynamic endpoints, serves `/` → `index.html`, `/assets/*` → assets.

## Follow-up Ideas

Per-asset preload feedback, touch/pointer events for mobile, ambient audio (Web Audio API), progress persistence (localStorage), 7-chakra sequences (see `notes/features.md`), accessibility improvements (ARIA, keyboard focus).

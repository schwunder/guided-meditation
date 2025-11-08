# Domain Context

**Project**: Interactive guided meditation experience with HTML-embedded sequences and data-attribute-driven rendering
**Target Environment**: Modern web browsers (Chrome, Firefox, Safari, Edge)

## Browser Constraints

**Works:**
- ✅ HTML5 video with `playsinline`, `muted`, `autoplay`
- ✅ CSS custom properties for runtime theming
- ✅ Data attributes for markup-driven configuration
- ✅ CSS animations and transitions
- ✅ Map-based caching for media elements

**Edge Cases:**
- 🟡 Video autoplay policies (requires muted + user gesture fallback)
- 🟡 Large video preloading (network dependent)
- 🟡 CSS backdrop-filter support (Safari needs `-webkit-`)
- 🟡 Mobile video playback (needs `playsinline` attribute)

**Not Used (Yet):**
- ⚪ Web Audio API (future: ambient audio layers)
- ⚪ Service Workers (future: offline support)
- ⚪ IndexedDB (future: progress persistence)
- ⚪ Pointer/Touch events (choice interaction not implemented)

## Feature Readiness

| Feature | Status | Notes |
|---------|--------|-------|
| Sequence playback | ✅ Ready | HTML parsing + timeline iteration |
| Media preload | ✅ Ready | Map-based cache for images/videos |
| Caption display | ✅ Ready | Data-attribute-driven rendering |
| Choice rendering | ✅ Ready | Choices display but no interaction |
| Hue transitions | ✅ Ready | Per-sequence CSS variable theming |
| Multiple sequences | ✅ Ready | 2 sequences: "arrival" and "kitchen" |
| Skipped asset tracking | 🟡 Partial | Logs to console, no telemetry endpoint |
| Choice interactivity | 🚫 Not implemented | UI exists but no branching logic |
| Ambient audio | 🚫 Not implemented | No audio support yet |
| Progress persistence | 🚫 Not implemented | No save/resume capability |

## Data Schema

### HTML Sequence Structure
Sequences are defined directly in HTML markup with data attributes:

```html
<div data-sequence-source hidden>
  <section data-sequence-id="arrival" style="--accent-hue-base:215; --accent-hue-shift:320;">
    <article
      data-sequence-item
      data-type="checkpoint"
      data-asset="checkpoints/image-sunrise-meditation-room.png"
      data-caption="Meditation room"
      data-alt="Dawn light fills a tidy meditation room with four cushions arranged on the wooden floor and a digital clock glowing 6:00."
      data-hold="5000"
    >
      <ul data-choice-list>
        <li>Choice A: Go to the kitchen.</li>
        <li>Choice B: Go to the bathroom.</li>
      </ul>
    </article>
  </section>
</div>
```

### Data Attributes

**Sequence Container:**
- `data-sequence-source` - Marks the container holding all sequences

**Sequence Section:**
- `data-sequence-id` - Unique identifier for the sequence (e.g., "arrival", "kitchen")
- `style` - Inline CSS variables for theme: `--accent-hue-base`, `--accent-hue-shift`

**Sequence Item:**
- `data-sequence-item` - Marks an individual checkpoint or transition
- `data-type` - Either "checkpoint" (pause on image) or "transition" (play video)
- `data-asset` - Relative path to media file (e.g., "checkpoints/image.png")
- `data-caption` - Text displayed in caption area
- `data-alt` - Accessibility alt text for images
- `data-hold` - Optional override for checkpoint hold duration (milliseconds)

**Choices:**
- `data-choice-list` - Marks the `<ul>` containing choice options
- Each `<li>` inside represents a choice (text content becomes the choice label)

### Parsed Timeline Item
`readTimeline()` parses HTML and returns:
```javascript
{
  type: 'checkpoint' | 'transition',
  asset: 'checkpoints/filename.png',
  caption: 'Text displayed in caption area',
  alt: 'Alt text for accessibility',
  choices: ['Choice A: ...', 'Choice B: ...'],
  theme: {
    id: 'arrival',
    base: 215,    // --accent-hue-base
    shift: 320    // --accent-hue-shift
  },
  holdMs: 5000 | null
}
```

## Asset Organization

```
public/assets/
├── checkpoints/     # Still images for meditation pauses
├── transitions/     # Video clips between checkpoints
├── chakras/         # Chakra-specific imagery (for future 7-sequence plan)
└── archive/         # Experimental or unused assets
```

Naming convention: `{type}-{subject}.{ext}`
- Example: `image-sunrise-meditation-room.png`
- Example: `choice-communal-beach-circle.jpg`
- Example: `1-video-1.mp4` (transitions)

## Performance Characteristics

| Metric | Target | Current |
|--------|--------|---------|
| Initial load | < 1s | ✅ Minimal HTML/CSS/JS (344 lines) |
| First scene ready | < 2s | 🟡 Depends on first asset size |
| Scene transition | < 500ms | ✅ CSS fade duration |
| Memory footprint | Low | ✅ Map-based cache reuses elements |
| HTML parsing | Instant | ✅ Single DOM query at startup |

## Browser Compatibility

**Tested:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest macOS/iOS)

**Minimum Requirements:**
- ES2020 support (Maps, optional chaining, nullish coalescing)
- CSS custom properties
- HTML5 video/audio
- Data attributes
- `getComputedStyle()` API

**Polyfills:** None currently needed for target browsers

## Architecture Principles

### Static Sequences
- The flow is now baked into `public/index.html` as `<section data-sequence-id>` blocks
- No JSON fetching - all sequence data in HTML markup
- Currently 2 sequences: "arrival" (meditation room → things change → communal beach) and "kitchen" (kitchen welcome → things change → evening reflections)
- Each sequence can define its own theme via inline CSS variables

### Lean Controller
- `public/main.js` is 344 lines (down from original 739-line JSON-based version)
- Reads markup via `readTimeline()`, manages cache via Map
- No template cloning - creates stage DOM directly from item data
- Uses straightforward conditionals (no ternaries for readability)

### CSS-First Styling
- All styling lives in CSS (inline `<style>` in `public/index.html`)
- JavaScript only toggles classes and updates `--accent-hue` variable
- Timing values read from CSS custom properties via `getComputedStyle()`
- Per-sequence theming via inline styles on `<section>` elements

### Minimal Logging
- Assumes local, single-dev usage
- Only calls `console.error()` when something definitively fails (missing elements, media load errors)
- No success banners or verbose diagnostics
- Skipped assets logged but don't halt progression

### Server Expectations
- `server.js` serves static HTML/CSS/JS and media assets from `public/`
- No dynamic endpoints, no JSON routes
- Simple Bun file server with fallback handling

## Follow-up Ideas

- Review each checkpoint's markup for accessibility once HTML structure is finalized
- Audit CSS animations to ensure they work smoothly across both sequences
- Consider extracting repeated DOM lookups into helper functions if controller grows
- Add per-item progress tracking for preload feedback
- Implement choice interaction logic (pause timeline, branch to different sequences)
- Build out 7-chakra sequence plan (see `notes/features.md`)

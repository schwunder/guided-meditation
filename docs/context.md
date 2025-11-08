# Domain Context

**Project**: Interactive guided meditation experience with JSON-driven sequences and template-based stages
**Target Environment**: Modern web browsers (Chrome, Firefox, Safari, Edge)

## Browser Constraints

**Works:**
- ✅ HTML5 video with `playsinline`, `muted`, `autoplay`
- ✅ CSS custom properties for runtime theming
- ✅ Template element cloning for dynamic DOM
- ✅ Async/await and async generators
- ✅ CSS animations and transitions
- ✅ `fetch` API for JSON loading

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
| Sequence playback | ✅ Ready | Timeline iterator + stage manager |
| Media preload | ✅ Ready | Media factory caches images/videos |
| Caption display | ✅ Ready | Template-based caption rendering |
| Choice rendering | ✅ Ready | Choices display but no interaction |
| Hue transitions | ✅ Ready | CSS variable updates after checkpoint 2 |
| Status banner | ✅ Ready | Observable store drives UI updates |
| Skipped asset tracking | 🟡 Partial | Logs to console, no telemetry endpoint |
| Choice interactivity | 🚫 Not implemented | UI exists but no branching logic |
| Ambient audio | 🚫 Not implemented | No audio support yet |
| Progress persistence | 🚫 Not implemented | No save/resume capability |

## Data Schema

### Sequence Item (`sequence.json`)
```json
{
  "type": "checkpoint" | "transition",
  "asset": "checkpoints/filename.png",
  "caption": "Text displayed in caption area",
  "choices": ["Choice A: ...", "Choice B: ..."]
}
```

### Metadata Entry (`checkpoint-metadata.json`)
```json
{
  "filename": "filename.png",
  "asset_type": "image" | "choice" | "video",
  "short_name": "kebab-case-identifier",
  "title": "Display Title",
  "description": "Alt text for accessibility"
}
```

## Asset Organization

```
public/assets/
├── checkpoints/     # Still images for meditation pauses
├── transitions/     # Video clips between checkpoints
├── chakras/         # Chakra-specific imagery
└── archive/         # Experimental or unused assets
```

Naming convention: `{type}-{subject}.{ext}`
- Example: `image-sunrise-meditation-room.png`
- Example: `choice-communal-beach-circle.jpg`
- Example: `1-video-1.mp4` (transitions)

## Performance Characteristics

| Metric | Target | Current |
|--------|--------|---------|
| Initial load | < 1s | ✅ Minimal HTML/CSS/JS |
| First scene ready | < 2s | 🟡 Depends on first asset size |
| Scene transition | < 500ms | ✅ CSS fade duration |
| Memory footprint | Low | ✅ Cached media reused |

## Browser Compatibility

**Tested:**
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest macOS/iOS)

**Minimum Requirements:**
- ES2020 support (async generators, optional chaining)
- CSS custom properties
- HTML5 video/audio
- Template element
- Fetch API

**Polyfills:** None currently needed for target browsers


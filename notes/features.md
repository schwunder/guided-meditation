## Implemented Features
| Area | Highlights |
| --- | --- |
| Sequence Flow | HTML-embedded sequences via `[data-sequence-source]` and `[data-sequence-item]` attributes. `readTimeline()` in `public/main.js` parses the markup and streams items through a simplified iteration loop. Checkpoints honor per-item `data-hold` or fall back to `--checkpoint-hold-ms`; transitions rely on video playback end events. |
| Stage Presentation | `ensureMedia()` preloads and caches `<img>`/`<video>` elements in a Map, refreshing `alt` text from data attributes. `renderStage()` creates stage DOM from item data, and `activateStage()` toggles `is-active` to let CSS handle fades and cleanup. |
| Styling Contract | CSS variables (`--transition-duration-fade`, `--checkpoint-hold-ms`, `--accent-hue-base`, `--accent-hue-shift`) in `public/index.html` keep JavaScript in sync. Each sequence section can define its own hue palette inline. Utility classes (`.radiant-border`, `.caption`, `.choices`) express layout and animations without duplicating rules. |
| Dynamic Hue Accent | Each `[data-sequence-id]` section defines `--accent-hue-base` and `--accent-hue-shift` inline styles. JavaScript updates `--accent-hue` on `document.documentElement` as the experience progresses, creating smooth color transitions for the radiant border animation. |
| Asset Library | Media lives under `public/assets/` with subfolders for checkpoints, transitions, chakras, and archived experiments. Asset paths are URL-encoded and referenced via `data-asset` attributes in the HTML markup. |
| Multiple Sequences | Currently supports 2 sequences: "arrival" (blue/magenta hues) and "kitchen" (orange/teal hues), each defined as `<section data-sequence-id>` with distinct theming. |

## Planned Features

| Area | Vision |
| --- | --- |
| 7-Chakra Daily Sequence | Meditation experience will evolve into 7 distinct HTML sequence sections—one for each chakra affirmation (I AM, I FEEL, I DO, I LOVE, I TALK, I SEE, I UNDERSTAND). Each sequence maps to a chakra color (Red, Orange, Yellow, Green, Blue, Indigo, Violet) and daily activity (grounding, stretching, focus work, gratitude, communication, reflection, integration). Currently has 2 sequences in HTML; will expand to 7 sections that users can eventually choose between based on their daily practice or time of day. |
| User-Selectable Sequences | Allow users to choose which chakra sequence to experience, either manually or automatically based on time of day. The 7 HTML sequences will be pre-built in `index.html` but selectively activated based on user choice or smart defaults. |
| Chakra Color Theming | Each of the 7 sequences already has inline CSS variable support for custom hues. Extend this pattern to ensure each chakra maps to its corresponding color (Red → Orange → Yellow → Green → Blue → Indigo → Violet), creating smooth color transitions that align with the affirmation and activity focus. |

### 7-Chakra Sequence Details

Each chakra sequence will incorporate available checkpoint assets to create immersive meditation experiences aligned with daily activities:

**1. I AM (Red) — Grounding & Wake Up**
- Activity: Wake up and ground yourself; take slow breaths or stand barefoot on the floor/earth
- Potential checkpoints: Sunrise Meditation Room (morning grounding), Breath Practice Circle (breath awareness), choice between Kitchen Welcome or Backyard Reading (grounding activities)

**2. I FEEL (Orange) — Sensation & Movement**
- Activity: Start meditation or gentle stretching; notice sensations and emotions
- Potential checkpoints: Teachers Portrait (guidance), Breath Practice Circle (meditation practice), choice between Chaplain Study Hall or Backyard Reading (reflective spaces)

**3. I DO (Yellow) — Action & Focus**
- Activity: Eat a nourishing breakfast or tackle a clear task with focus
- Potential checkpoints: Kitchen Welcome (nourishment), Workshop Presentation (focused work), choice between Steakhouse Conversation or Teacher Conversation (meaningful engagement)

**4. I LOVE (Green) — Gratitude & Kindness**
- Activity: Express gratitude or do a small act of kindness for someone
- Potential checkpoints: Teachers Portrait (connection), Communal Beach Circle (community), choice between Kitchen Welcome or Teacher Conversation (acts of kindness)

**5. I TALK (Blue) — Communication & Expression**
- Activity: Journal, voice your needs, or have an honest conversation
- Potential checkpoints: Backyard Reading (journaling), Teacher Conversation (honest dialogue), choice between Steakhouse Conversation or Workshop Presentation (expressive spaces)

**6. I SEE (Indigo) — Reflection & Insight**
- Activity: Take 5 minutes for reflection or mindful observation; notice patterns and insights
- Potential checkpoints: Lakeside Overlook (observation), Starry Night Vigil (reflection), choice between Rooftop Meditators or Sun Spiral Overlook (contemplative views)

**7. I UNDERSTAND (Violet) — Integration & Stillness**
- Activity: Close the day with stillness, prayer, or a few silent breaths; integrate what you learned
- Potential checkpoints: Starry Night Vigil (evening stillness), Rooftop Meditators (contemplation), choice between Sun Spiral Overlook or Lakeside Overlook (peaceful integration)

Each sequence will use the chakra-specific color theming (via CSS custom properties in inline styles) and incorporate transitions between checkpoints, creating a cohesive daily meditation journey that aligns with the chakra's affirmation and activity focus.

## Potential Future Sequences

Based on available checkpoint metadata, the following sequences could be generated as standalone `<section data-sequence-id>` blocks within `index.html`:

### Meditation Journey Sequences

**Morning Practice Sequence**
- Sunrise Meditation Room (image checkpoint)
- Teachers Portrait (image checkpoint)
- Breath Practice Circle (image checkpoint)
- Choice: Chaplain Study Hall, Kitchen Welcome, or Backyard Reading

**Evening Reflection Sequence**
- Starry Night Vigil (image checkpoint)
- Sun Spiral Overlook (image checkpoint)
- Rooftop Meditators (image checkpoint)
- Lakeside Overlook (image checkpoint)
- Choice: Communal Beach Circle, Steakhouse Conversation, or Teacher Conversation

**Workshop Experience Sequence**
- Teachers Portrait (image checkpoint)
- Workshop Presentation (choice checkpoint)
- Breath Practice Circle (image checkpoint)
- Choice: Teacher Conversation, Kitchen Welcome, or Backyard Reading

### Available Checkpoint Assets

**Image Checkpoints** (non-interactive meditation pauses):
- Sunrise Meditation Room — Dawn light fills a tidy meditation room with four cushions arranged on the wooden floor
- Teachers Portrait — Two meditation teachers sit cross-legged on a sofa, framed by a window of swirling pastel light
- Breath Practice Circle — A cozy practice room where several people meditate together, guiding their breath with alternate-nostril hand mudras
- Starry Night Vigil — A guide stands before a sea of reclining seekers beneath a night sky alive with swirling stars and candlelight
- Sun Spiral Overlook — Hundreds meditate on a hillside overlooking a lakeside town while a fiery spiral sunset blooms overhead
- Rooftop Meditators — Meditators sit on rooftops across a twilight village as a luminous spiral hovers in the deep-blue sky
- Lakeside Overlook — A sweeping aerial view of a lakeside town, winding shoreline roads, and boats tracing gentle patterns in the water

**Choice Checkpoints** (interactive decision points):
- Chaplain Study Hall — Haloed practitioners meditate in rows before a golden hilltop chapel, bathed in soft morning light
- Communal Beach Circle — Friends sit shoulder to shoulder on a sandy beach, laughing together as the forest rises behind them
- Steakhouse Conversation — A smiling friend points across a candlelit table set with steak, red wine, and notebooks ready for a lively chat
- Kitchen Welcome — A cheerful host in a patterned coat offers a warm bowl outside a rustic kitchen cabin in the cool morning air
- Workshop Presentation — A presenter introduces the Meditation Research Program to an engaged audience in a vivid, lantern-lit hall
- Backyard Reading — Two retreatants unwind on picnic blankets, one journaling and the other reading beneath a sun-dappled canopy
- Teacher Conversation — Two teachers share an easy smile beside a warmly lit window, ready to continue a heartfelt discussion

These sequences can be added as new `<section data-sequence-id="...">` blocks in `public/index.html`, each with their own theme CSS variables and checkpoint/transition markup.

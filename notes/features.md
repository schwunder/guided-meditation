## Implemented Features

| Area | Highlights |
| --- | --- |
| Scene Flow | 8 scenes in inline `SCENES` array ('one' through 'eight'). `runShow()` iterates scenes, `playStep()` handles phases (intro, transition, outro). Checkpoints hold 2500ms; transitions play until `ended`. |
| Interactive Branching | Choice points with `left`/`right` assets. Arrow keys (← / →) choose paths. `choiceByKey` stores choices; `dependsOn` conditionally renders. 3 choice points across 8 scenes. |
| Media Preloading | Boot script collects URLs, `preload()` populates `mediaCache` Map. Waits for all media before `runShow()`. Fail-open timeout 2000ms per video. |
| Stage Presentation | `mountMedia()` swaps DOM nodes, updates captions. CSS `fadeIn` handles transitions. Videos use muted autoplay. |
| Styling & Theming | CSS variables (`--hue`, `--sat`, `--lum`, `--breath`, etc.) control colors/timing. Scene theming via `:root[data-scene="N"]` (N = 1-8). `radiate` animation creates pulsing border glow. |
| Asset Library | Media in `public/assets/checkpoints/` (PNG) and `public/assets/transitions/` (MP4). Referenced by URL in `SCENES` array. |

## Planned Features

| Area | Vision |
| --- | --- |
| 7-Chakra Daily Sequence | Expand `SCENES` to 7 sequences—one per chakra (I AM, I FEEL, I DO, I LOVE, I TALK, I SEE, I UNDERSTAND). Each maps to color (Red, Orange, Yellow, Green, Blue, Indigo, Violet) and daily activity. Reorganize from 1 linear sequence to 7 selectable sequences. |
| User-Selectable Sequences | Users choose chakra sequence manually (menu) or automatically (time-based). 7 sequences pre-defined in `SCENES` with metadata; `runShow()` filters/activates chosen sequence. |
| Chakra Color Theming | Extend `:root[data-scene="N"]` theming for distinct palettes per chakra. Map colors (Red→Orange→Yellow→Green→Blue→Indigo→Violet) with smooth transitions. CSS-based, no JS color arrays. |

### 7-Chakra Sequence Details

**1. I AM (Red) — Grounding:** Wake up, slow breaths, barefoot grounding. Checkpoints: Sunrise Meditation Room, Breath Practice Circle, Kitchen/Backyard choice.

**2. I FEEL (Orange) — Sensation:** Meditation/stretching, notice sensations. Checkpoints: Teachers Portrait, Breath Practice Circle, Chaplain Study Hall/Backyard choice.

**3. I DO (Yellow) — Action:** Nourishing breakfast, focused tasks. Checkpoints: Kitchen Welcome, Workshop Presentation, Steakhouse/Teacher Conversation choice.

**4. I LOVE (Green) — Gratitude:** Express gratitude, acts of kindness. Checkpoints: Teachers Portrait, Communal Beach Circle, Kitchen/Teacher Conversation choice.

**5. I TALK (Blue) — Communication:** Journal, voice needs, honest conversation. Checkpoints: Backyard Reading, Teacher Conversation, Steakhouse/Workshop choice.

**6. I SEE (Indigo) — Reflection:** 5-minute reflection, mindful observation. Checkpoints: Lakeside Overlook, Starry Night Vigil, Rooftop Meditators/Sun Spiral choice.

**7. I UNDERSTAND (Violet) — Integration:** Evening stillness, prayer, silent breaths. Checkpoints: Starry Night Vigil, Rooftop Meditators, Sun Spiral/Lakeside choice.

Each sequence uses chakra-specific CSS theming and transitions between checkpoints.

## Potential Future Sequences

**Morning Practice:** Sunrise Meditation Room → Teachers Portrait → Breath Practice Circle → Choice (Chaplain Study Hall, Kitchen, Backyard).

**Evening Reflection:** Starry Night Vigil → Sun Spiral Overlook → Rooftop Meditators → Lakeside Overlook → Choice (Communal Beach Circle, Steakhouse, Teacher Conversation).

**Workshop Experience:** Teachers Portrait → Workshop Presentation → Breath Practice Circle → Choice (Teacher Conversation, Kitchen, Backyard).

## Available Checkpoint Assets

**Scenes 1-8:** Files `1-1.png` through `8-2.png` with branching variants (e.g., `2-2a.png`, `2-2b.png`). Content: morning meditation, maté/breakfast choices, cold plunge/garden reading, breathwork, teacher conversations, cooking, workshop talks, evening reflection.

**Transitions:** Videos `1.mp4`, `2a.mp4`, `2b.mp4`, etc., numbered to match scenes with a/b variants for branching paths.

To modify scenes, edit the `SCENES` array in `public/index.html`.

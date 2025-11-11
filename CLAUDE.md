# CLAUDE.md

**Goal**: Interactive guided meditation experience with inline single-file architecture, branching paths, and dynamic visual effects

**Stack**: Bun (server), single HTML file with all code inline, no dependencies

## Repository Structure

```
.claude/{hooks,skills} → notes/ → public/{index.html,assets/} → server.js
```

## Project Overview

A single-file meditation experience (`public/index.html`) that:
- Contains all code inline: CSS in `<style>` block, JavaScript in `<script>` block
- 8 scenes with branching paths based on arrow key choices (← / →)
- Scene data defined in `SCENES` JavaScript array with phases: intro, transition, outro
- Preloads and caches all media (images/videos) in `mediaCache` Map before starting
- Interactive choice system: users choose between 2 paths at decision points
- CSS-driven fades, animations, and radial border effects
- Per-scene hue theming via CSS `:root[data-scene="N"]` attributes
- Simple Bun server serves static files

## Current Implementation (single HTML file)

**Everything is inline in `public/index.html`:**

### CSS Styling
- Scene-specific theming via `:root[data-scene="N"]` attributes (N = 1-8)
- Each scene defines `--hue`, `--sat`, `--lum` values
- CSS variables: `--breath`, `--surface-bg`, `--caption-bg`, `--text`, `--shadow`
- `radiate` keyframe animation for pulsing border glow
- Responsive layout with `fadeIn` animation for media nodes

### Scene Data
- `SCENES` array: 8 scenes ('one' through 'eight')
- Each scene has `{ id, phases: { intro, transition, outro } }`
- Step types:
  - Simple: `{ type, src, caption }` - single asset
  - Interactive: `{ type, left, right, choiceKey, captionLeft, captionRight }` - user chooses path
  - Conditional: `{ type, left, right, dependsOn }` - follows previous choice

### Media Preloading
- `preload()` function populates `mediaCache` Map (url → Image|HTMLVideoElement)
- Waits for all media with fail-open timeout (2000ms per video)
- Boot script collects all URLs and calls `runShow()` after preload completes

### Playback Logic
- `runShow()` iterates through all 8 scenes
- `playStep()` handles intro/transition/outro phases
- Three step patterns: reveal-only, choice-only, or compound (reveal then choose)
- `waitForArrowChoice()` listens for arrow key input and stores choice in `choiceByKey` object
- `playAsset()` handles both images (with STILL_IMAGE_MS delay) and videos (play until ended)
- `mountMedia()` swaps DOM nodes and triggers CSS fade via `fadeIn` animation

### Theming
- No JavaScript array - all theming is CSS-based
- `rootEl.dataset.scene` updated per scene to trigger CSS `:root[data-scene="N"]` rules
- Smooth color transitions between scenes via CSS custom properties

## Skills Workflow

**Available Skills:**

1. **design-variation-logic** - Design branching logic and choice interactions
2. **design-terminal-render** - Design UI layouts, caption styles, visual effects
3. **explore-implementation-options** - Test browser APIs, video handling, CSS patterns
4. **integrate-features** - Wire features and ensure browser compatibility
5. **check-code-quality** - Run Biome lint (configured in `biome.json`)

**When to skip skills**: Bug fixes, minor tweaks, caption updates, adding scenes to `SCENES` array

## Project Structure

```
.claude/
├── hooks/                      # Automated event hooks
└── skills/                     # Specialized agent skills
notes/
├── context.md                  # Browser constraints & technical context
├── cursor-setup.md             # Cursor IDE setup guide
├── features.md                 # Implemented & planned features
├── fix.md                      # Outstanding fixes
└── refactor.md                 # Refactor notes
public/
├── index.html                  # Single HTML file with all code inline
└── assets/
    ├── checkpoints/            # Still images (1-1.png through 8-2.png)
    └── transitions/            # Videos (1.mp4, 2a.mp4, 2b.mp4, etc.)
server.js                       # Bun HTTP server
biome.json                      # Biome linter configuration
```

## Key Architecture Patterns

### Scene Data Structure
Scenes are defined in the `SCENES` JavaScript array:
```javascript
{
  id: 'two',
  phases: {
    intro: {
      type: 'image',
      caption: "Drink maté at home or get breakfast with a friend?",
      left: 'assets/checkpoints/2-1.png',
      right: 'assets/checkpoints/2-1.png',
      choiceKey: 'two-start',
      captionLeft: "Drink maté at home",
      captionRight: "Get breakfast with a friend"
    },
    transition: {
      type: 'video',
      left: 'assets/transitions/2a.mp4',
      right: 'assets/transitions/2b.mp4',
      dependsOn: 'two-start'
    },
    outro: {
      type: 'image',
      caption: "Cold plunge or read in the garden?",
      left: 'assets/checkpoints/2-2a.png',
      right: 'assets/checkpoints/2-2b.png',
      captionLeft: "I love maté!",
      captionRight: "My favorite food at Casa Chola.",
      dependsOn: 'two-start',
      choiceKey: 'two-end'
    }
  }
}
```

### CSS Variables for Theming
`public/index.html` uses CSS custom properties for timing and colors:
- `--hue`, `--sat`, `--lum`: Hue, saturation, lightness (set per scene via CSS `:root[data-scene="N"]`)
- `--breath`: Border animation duration (8.5s)
- `--surface-bg`, `--caption-bg`: Background colors with transparency
- `--text`, `--shadow`: Text and shadow styling

JavaScript updates `rootEl.dataset.scene` per scene, which triggers CSS rules to set color values.
No JavaScript array needed - all theming is CSS-based.

## Hooks

**Automation via Claude Code hooks (.claude/hooks/)**

Files trigger automatically:
- `user-prompt-submit` - Enhances prompts with project context
- `pre-tool-use` - Validates before Write/Edit
- `post-tool-use` - Runs linting after code changes
- `pre-skill-use` - Context injection before skill execution
- `post-skill-use` - Validates skill outputs

Before modifying hooks: Read `.claude/settings.json` and existing scripts, apply same patterns.

## Skills Architecture

Skills employ a **progressive disclosure architecture** optimizing context usage:

**Level 1 - Metadata (Always Loaded)**
YAML frontmatter provides discovery information. Claude loads this at startup to understand which skills exist and when to invoke them.

**Level 2 - Instructions (Triggered)**
The SKILL.md body contains procedural knowledge and workflows. Claude reads this only when a user request matches the skill's description.

**Level 3 - Resources (On-Demand)**
Additional markdown files and scripts load only when referenced. This keeps context usage minimal.

### Skill Benefits
- **Specialization**: Tailored for meditation experience features
- **Reusability**: Create once, use across sessions
- **Composition**: Combine multiple skills for complex workflows
- **Efficiency**: Only load content when needed

## Development

### Local Development
```bash
# Requires Bun runtime (no dependencies to install)
bun server.js  # Start the meditation server on port 8080
# Visit http://localhost:8080
```

### GitHub Pages Deployment

Automated deployment via `.github/workflows/deploy.yml`:
- Triggers on push to `main` or manual workflow dispatch
- Copies `public/*` to `dist/` (no build step)
- Injects `<base href="/repo-name/">` for subpath routing
- Deploys to GitHub Pages automatically

**Important:** All asset paths in `public/index.html` use relative paths (`assets/...` not `/assets/...`) to work with GitHub Pages subpath routing.

## Documentation Organization

- **CLAUDE.md** - This file (Claude Code workflow & architecture overview)
- **README.md** - User-facing project overview and dev setup
- **notes/** - Detailed development documentation
  - `features.md` - Implemented & planned features (including 7-chakra vision)
  - `fix.md` - Outstanding fixes and issues
  - `context.md` - Browser constraints and technical context
  - `refactor.md` - Refactor notes and principles
  - `cursor-setup.md` - Cursor IDE setup guide

## Outstanding Work

See `notes/fix.md` for known issues and planned improvements.

See `notes/features.md` for the feature roadmap and `notes/refactor.md` for architecture principles.

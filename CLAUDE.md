# CLAUDE.md

**Goal**: Interactive guided meditation experience with inline single-file architecture, branching paths, and dynamic visual effects

**Stack**: Bun (server), single HTML file (480 lines total: ~100 CSS + ~365 JS), no dependencies

## Repository Structure

```
.claude/{hooks,skills,settings} → notes/ → docs/ → public/{index.html,assets/} → server.js
```

## Project Overview

A single-file meditation experience (`public/index.html`) that:
- Contains all code inline: CSS in `<style>` block, JavaScript in `<script>` block
- 8 scenes with branching paths based on arrow key choices (← / →)
- Scene data defined in `SCENES` JavaScript array (not data attributes)
- Preloads and caches all media (images/videos) in Map objects before starting
- Interactive choice system: users choose between 2 paths at decision points
- CSS-driven fades, animations, and radial border effects
- Per-scene hue theming via `SCENE_HUES` array
- Simple Bun server (23 lines) serves static files

## Current Implementation (single HTML file)

**Everything is inline in `public/index.html`:**

### Scene Data (~130 lines)
- `SCENES` array: 8 scenes ('one' through 'eight')
- Each scene has `start`, `video`, `end` items
- Items can be:
  - Simple: single `src` and `caption`
  - Interactive: `left`/`right` assets with `captionLeft`/`captionRight` and a `key`
  - Conditional: `follow` property uses previous choice to determine which asset/caption to show

### Media Preloading (~60 lines)
- `collectUrls()` gathers all asset URLs from `SCENES`
- `preloadImage()` and `preloadVideo()` populate `imgCache` and `vidCache` Maps
- Waits for all media before calling `play()`

### Playback Logic (~175 lines)
- `play()` iterates through scenes, calling `showStill()` and `playVideo()`
- `showStill()` handles checkpoints, interactive choices, and conditional rendering
- `awaitChoice()` listens for arrow key input and stores path in `path` object
- `urlFor()` and `captionFor()` resolve conditional assets based on previous choices
- `render()` swaps DOM nodes and triggers CSS fade transitions

### Theming (~10 lines)
- `SCENE_HUES` array: 8 color triplets [h, s, l]
- `applyHue()` updates CSS custom properties `--h`, `--s`, `--l` per scene
- CSS `radiate` animation uses these properties for pulsing border glow

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
├── hooks/                      # Automated event hooks (8 files)
├── skills/                     # Specialized agent skills (10 skills)
└── settings.json              # Claude Code configuration
docs/
├── fix.md                      # Outstanding fixes (summary)
└── refactor.md                 # Refactor notes (summary)
notes/
├── context.md                  # Browser constraints & technical context
├── cursor-setup.md             # Cursor IDE setup guide
├── features.md                 # Implemented & planned features
├── fix.md                      # Detailed outstanding fixes
└── refactor.md                 # Detailed refactor plan
public/
├── index.html                  # Single HTML file (~480 lines: CSS + JS inline)
└── assets/
    ├── checkpoints/            # Still images (PNG)
    └── transitions/            # Videos (MP4)
server.js                       # Bun HTTP server (23 lines)
biome.json                      # Biome linter configuration
```

## Key Architecture Patterns

### Scene Data Structure
Scenes are defined in the `SCENES` JavaScript array:
```javascript
{
  id: 'two',
  items: {
    start: {
      type: 'img',
      caption: "Drink maté at home or get breakfast with a friend?",
      left: '/assets/checkpoints/2-1.png',
      right: '/assets/checkpoints/2-1.png',
      key: 'two-start',
      captionLeft: "Drink maté at home",
      captionRight: "Get breakfast with a friend"
    },
    video: {
      type: 'vid',
      left: '/assets/transitions/2a.mp4',
      right: '/assets/transitions/2b.mp4',
      follow: 'two-start'
    },
    end: {
      type: 'img',
      caption: "Cold plunge or read in the garden?",
      left: '/assets/checkpoints/2-2a.png',
      right: '/assets/checkpoints/2-2b.png',
      key: 'two-end',
      follow: 'two-start'
    }
  }
}
```

### CSS Variables for Theming
`public/index.html` uses CSS custom properties for timing and colors:
- `--h`, `--s`, `--l`: Hue, saturation, lightness (updated per scene by JavaScript)
- `--fade`: Fade transition duration (0.5s)
- `--border`: Border animation duration (8.5s)
- `--surface-bg`, `--caption-bg`: Background colors with transparency
- `--text`, `--shadow`: Text and shadow styling

JavaScript updates hue values via `root.style.setProperty()` from `SCENE_HUES` array.

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
  - `context.md` - Browser constraints, data schemas, performance
  - `refactor.md` - Refactor notes and principles
  - `cursor-setup.md` - Cursor IDE setup guide
- **docs/** - Summary documentation (shorter versions)
  - `fix.md` - Outstanding fixes summary
  - `refactor.md` - Refactor summary

## Outstanding Work

See `notes/fix.md` and `docs/fix.md` for known issues and planned improvements.

See `notes/features.md` for the feature roadmap and `notes/refactor.md` for architecture principles.

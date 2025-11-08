# CLAUDE.md

**Goal**: Interactive guided meditation experience with HTML-embedded sequences, data-attribute-driven staging, and dynamic visual effects

**Stack**: Bun (server), HTML, CSS, JavaScript, no external dependencies

## Repository Structure

```
.claude/{hooks,skills,settings} → notes/ → docs/ → public/ → server.js
```

## Project Overview

A single-page meditation experience that:
- Reads sequences directly from HTML markup via `data-sequence-source` and `data-sequence-item` attributes
- No JSON fetching - all sequence data embedded in `public/index.html`
- Iterates through sequence items with a simplified timeline controller
- Preloads and caches media (images/videos) in a Map-based cache
- Manages stage activation with CSS-driven fades and animations
- Reads timing/theming from CSS custom properties per sequence
- Currently has 2 sequences: "arrival" and "kitchen", each with distinct hue themes
- Displays choices (informational only, no branching yet)

## Current Implementation (344 lines)

The codebase has been refactored from the original JSON-based architecture to a leaner HTML-based approach:

### Data Flow
1. `readTimeline()` parses `[data-sequence-source]` container in HTML
2. Extracts sequence sections `[data-sequence-id]` with theme CSS variables
3. Reads sequence items `[data-sequence-item]` with data attributes for asset, caption, alt, type, choices
4. Returns flat array of enriched items with theme metadata

### Media Handling
- `ensureMedia()` function manages Map-based cache
- Creates `<img>` or `<video>` elements on demand
- Tracks preload promises and errors
- No factory pattern - direct cache lookup

### Stage Management
- `renderStage()` creates stage elements from sequence items
- `activateStage()` handles CSS class toggles for fades
- `waitForMedia()` manages checkpoint holds and video playback
- Cleanup via `scheduleRemoval()` after CSS transitions

### Hue System
- Each sequence defines `--accent-hue-base` and `--accent-hue-shift` inline
- No JavaScript hue controller - CSS variables handle theming
- Sequences can have distinct color palettes

## Skills Workflow

**Typical Workflow:**

1. **explore-concepts-and-specs** - Explore new meditation features, interaction patterns, or content types
2. **visualize-architecture** - Create diagrams for data flow, stage lifecycle, or component interactions (see `.claude/skills/visualize-architecture/DIAGRAMS.md`)
3. **explore-implementation-options** - Test browser APIs, video handling, or CSS animation patterns
4. **design-variation-logic** - Design branching logic, choice interactions, or conditional timelines
5. **design-browser-render** - Design HTML/CSS layouts, caption styles, or visual effects
6. **check-code-quality** - Run Biome lint (configured in `biome.json`)

**When to skip skills**: Bug fixes, minor styling tweaks, HTML sequence updates, documentation

## Project Structure

```
.claude/
├── hooks/                      # Automated event hooks
├── skills/                     # Specialized agent skills
└── settings.json              # Claude Code configuration
.cursor/
└── rules                       # Cursor IDE rules
docs/
├── fix.md                      # Outstanding fixes (summary)
└── refactor.md                 # Refactor notes (summary)
notes/
├── context.md                  # Browser constraints & technical context
├── cursor-setup.md             # Cursor IDE setup guide
├── features.md                 # Implemented & planned features
├── fix.md                      # Detailed outstanding fixes
└── refactor.md                 # Detailed refactor plan
mermaid diagrams/               # Mermaid diagram files (.mmd or .md)
public/
├── index.html                  # Single-page shell with embedded sequences
├── main.js                     # Timeline controller (344 lines)
└── assets/
    ├── checkpoints/            # Still images for meditation checkpoints
    ├── transitions/            # Video transitions between checkpoints
    ├── chakras/                # Chakra imagery (for future 7-sequence plan)
    └── archive/                # Experimental or background footage
server.js                       # Bun HTTP server serving public/
biome.json                      # Biome linter configuration
chakra-sequence-spec.json       # 7-chakra sequence specification (reference)
```

## Key Architecture Patterns

### HTML-Embedded Sequences
Sequences are defined directly in HTML with data attributes:
```html
<div data-sequence-source hidden>
  <section data-sequence-id="arrival" style="--accent-hue-base:215; --accent-hue-shift:320;">
    <article data-sequence-item data-type="checkpoint" data-asset="checkpoints/image.png"
             data-caption="..." data-alt="...">
      <ul data-choice-list>
        <li>Choice A: ...</li>
        <li>Choice B: ...</li>
      </ul>
    </article>
  </section>
</div>
```

### CSS Variables Contract
`public/index.html` exposes timing/visuals through CSS custom properties:
- `--transition-duration-fade`: Stage fade duration
- `--checkpoint-hold-ms`: How long to hold checkpoint images
- `--accent-hue-base`: Starting border hue (per sequence)
- `--accent-hue-shift`: Shifted border hue (per sequence)
- `--accent-hue`: Current hue (updated by JavaScript)

JavaScript reads these at runtime via `getComputedStyle()`.

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

## Installation

```bash
# Requires Bun runtime
bun install  # If you add dependencies later
bun server.js  # Start the meditation server on port 8080
```

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

See `notes/fix.md` for known issues:
- Skipped asset telemetry (console only, needs reporting)
- Coarse preload feedback (generic messages, needs progress events)
- Choice interactivity backlog (choices render but don't branch)

See `notes/refactor.md` for current architecture notes and `notes/features.md` for the 7-chakra sequence vision.

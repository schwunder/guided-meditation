# CLAUDE.md

**Goal**: Interactive guided meditation experience with JSON-driven sequences, HTML template stages, and dynamic visual effects

**Stack**: Bun (server), HTML, CSS, JavaScript, no external dependencies

## Repository Structure

```
.claude/{hooks,skills,settings} → public/ → server.js
```

## Project Overview

A single-page meditation experience that:
- Loads sequences from `public/sequence.json` with checkpoint/transition data
- Enriches assets with metadata from `public/checkpoint-metadata.json`
- Streams scenes through an async timeline iterator
- Clones HTML `<template id="stage">` for each scene
- Preloads and caches media (images/videos) in a media factory
- Manages stage transitions with CSS-driven fades and animations
- Shifts accent hue dynamically during progression
- Displays choices (currently informational only)

## Skills Workflow

**Typical Workflow:**

1. **explore-concepts-and-specs** - Explore new meditation features, interaction patterns, or content types
2. **visualize-architecture** - Create diagrams for data flow, stage lifecycle, or component interactions
3. **explore-implementation-options** - Test browser APIs, video handling, or CSS animation patterns
4. **design-variation-logic** - Design branching logic, choice interactions, or conditional timelines
5. **design-terminal-render** - Design HTML/CSS layouts, caption styles, or visual effects (note: this was misnamed, should be "design-browser-render")
6. **check-code-quality** - Run Biome lint (if configured)

**When to skip skills**: Bug fixes, minor styling tweaks, sequence JSON updates, documentation

## Project Structure

```
public/
├── index.html                  # Single-page shell with stage template
├── main.js                     # Timeline orchestration, media factory, stage management
├── sequence.json               # Playback order (checkpoints/transitions)
├── checkpoint-metadata.json    # Asset enrichment (titles, descriptions)
└── assets/
    ├── checkpoints/            # Still images for meditation checkpoints
    ├── transitions/            # Video transitions between checkpoints
    ├── chakras/                # Chakra imagery (if used)
    └── archive/                # Experimental or background footage
server.js                       # Bun HTTP server serving public/
```

## Key Concepts

### Timeline Iterator
`timeline()` in `main.js` is an async generator that:
- Iterates through sequence items
- Preloads media via `mediaFactory.ensure()`
- Tracks skipped assets (load failures)
- Yields `{ item, entry }` for each successful asset

### Media Factory
`createMediaFactory()` provides:
- Centralized preload/cache for `<img>` and `<video>` elements
- Alt text refresh from metadata
- Reset capability for replaying videos
- Error tracking per asset

### Stage Composer
`createStageComposer()` clones the `<template id="stage">` and:
- Fills media slot with cached element
- Populates caption text from `item.caption`
- Renders choices list (if present)
- Sets data attributes for CSS targeting

### Stage Manager
`createStageManager()` handles DOM lifecycle:
- Activates new stage with `is-active` class
- Schedules removal of previous stage after fade
- Appends to container and triggers transitions

### Hue Controller
`createHueController()` mirrors CSS palette:
- Reads `--accent-hue-base` and `--accent-hue-shift` from CSS
- Flips accent after the second checkpoint
- Updates `--accent-hue` variable for radiant border animation

### Status Store
`createStatusStore()` is a tiny observable for progress/errors:
- Publishes preload messages
- Surfaces skipped asset warnings
- Drives status banner visibility

## CSS Variables Contract

`public/index.html` exposes timing/visuals through CSS custom properties:
- `--transition-duration-fade`: Stage fade duration
- `--checkpoint-hold-ms`: How long to hold checkpoint images
- `--accent-hue-base`: Starting border hue (blue)
- `--accent-hue-shift`: Shifted border hue (magenta)
- `--accent-hue`: Current hue (animated by hue controller)

JavaScript reads these at runtime via `getComputedStyle()`.

## Hooks

**Automation via Claude Code hooks (.claude/hooks/)**

Files trigger automatically:
- `user-prompt-submit` - Runs on every user message
- `pre-tool-use` - Validates before Write/Edit (checks syntax if applicable)
- `post-tool-use` - Runs quality chain after Write/Edit (linting, validation)
- `pre-skill-use` - Context injection before skill execution
- `post-skill-use` - Logging/reporting after skill completes

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
bun server.js  # Start the meditation server
```

## Outstanding Work

See `fix.md` for known issues:
- Skipped asset telemetry (console only, needs reporting)
- Coarse preload feedback (generic messages, needs progress events)
- Choice interactivity backlog (choices render but don't branch)

See `notes.md` for recent refactoring context and next investigations (branching, audio, telemetry, progressive enhancement).

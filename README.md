# Guided Meditation

Interactive guided meditation experience delivered as a single HTML file with inline CSS and JavaScript, featuring 8 scenes with branching paths based on user choices.

## Architecture Overview

| Layer | Responsibilities |
| --- | --- |
| Single HTML file (`public/index.html`) | All code inline: CSS in `<style>`, JavaScript in `<script>`. Stage container with media host and caption. Visual styling via CSS custom properties. |
| Inline CSS | Layout, color, animation, responsive states. CSS custom properties (`--hue`, `--sat`, `--lum`, `--breath`). Scene theming via `:root[data-scene="N"]`. |
| Inline JavaScript | Manages `SCENES` array (8 scenes), media preloading/caching via Map, playback flow with `playStep()`, interactive choices via arrow keys. Minimal `console.error` output. |
| Dev server (`server.js`) | Bun-based static server serves `index.html` and assets from `/assets/`. No JSON endpoints or dynamic routes. |

## Development

### Local Development
```bash
bun server.js  # Start server on http://localhost:8080
```

### Editing the Experience
- **Scenes:** Edit `SCENES` array in `<script>` block. Each scene has `{ id, phases: { intro, transition, outro } }`. 8 scenes with branching paths via arrow keys (← / →).
- **Styling:** Modify CSS in `<style>` block. CSS custom properties control timing (`--breath`) and theming (`--hue`, `--sat`, `--lum`). Scene colors via `:root[data-scene="N"]`.
- **JavaScript:** Keep focused on orchestration—DOM lookups, scene progression, `mediaCache` Map, choice handling. Prefer CSS for visual changes.
- **Error handling:** Quiet by design. Only `console.error` for real failures; no status banners.

### GitHub Pages Deployment

Automated workflow (`.github/workflows/deploy.yml`): copies `public/*` to `dist/`, injects `<base href="/repo-name/">` for subpath routing, creates `.nojekyll`, deploys to GitHub Pages. All asset paths use relative paths (`assets/...`).

## Project Structure

`public/` contains `index.html` (all CSS/JS inline) plus media assets in `assets/checkpoints/` and `assets/transitions/`. `server.js` serves `index.html` at root and assets from `/assets/`. Scene data defined in `SCENES` array within HTML.

## Development with Claude Code

**Getting Started:** `npm install -g @anthropic-ai/claude-code` then `claude` in project directory.

**Hooks** (`.claude/hooks/`): `user-prompt-submit`, `pre-tool-use`, `post-tool-use`, `pre-skill-use`, `post-skill-use`.

**Skills** (`.claude/skills/`): `explore-concepts-and-specs`, `visualize-architecture`, `design-variation-logic`, `design-browser-render`, `check-code-quality`.

**Principles:** File-based communication (markdown in `notes/`), automation via hooks, skills for complexity, progressive disclosure.

See `CLAUDE.md` for detailed workflow and `notes/context.md` for browser constraints.

## Cursor IDE Setup

- **`.cursor/rules`** - Project-specific Cursor rules (source of truth)
- **`notes/cursor-setup.md`** - Recommended extensions and configuration

**Quick Setup:** Install extensions (see `notes/cursor-setup.md`), Cursor uses `.cursor/rules` automatically, configure Biome.js formatter, enable Mermaid preview.

## Documentation Structure

- **`notes/`** - Development docs: `features.md`, `fix.md`, `context.md`, `cursor-setup.md`, `refactor.md`
- **`mermaid diagrams/`** - Mermaid diagram files
- **`.claude/`** - Claude Code integration (hooks and skills)
- **`CLAUDE.md`** - Claude Code workflow overview
- **`README.md`** - This file

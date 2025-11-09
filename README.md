# Guided Meditation
Interactive guided meditation experience delivered as a single HTML file with inline CSS and JavaScript, featuring 8 scenes with branching paths based on user choices.

## Architecture Overview
| Layer | Responsibilities |
| --- | --- |
| Single HTML file (`public/index.html`) | Contains all code inline: CSS (~100 lines) in a `<style>` block and JavaScript (~365 lines) in a `<script>` block. The HTML structure includes a simple player container with a media slot and caption element. All visual styling, animations, and theming are handled via CSS custom properties. |
| Inline CSS (`<style>` block) | Layout, color, animation, and responsive states. Timing values and color accents are handled with CSS custom properties (e.g., `--h`, `--s`, `--l`, `--fade`, `--border`). Each scene dynamically updates hue values for smooth color transitions. |
| Inline JavaScript (`<script>` block) | ~365 lines that manage the `SCENES` array (8 scenes), handle media preloading and caching via Map objects, orchestrate playback flow, and manage interactive choices via arrow key input. Uses straightforward conditionals and only minimal `console.error` output when a real failure occurs. |
| Dev server (`server.js`) | Bun-based static server that serves `index.html` and media assets from `/assets/` without any JSON endpoints or dynamic routes. |

## Editing the experience
- Update scene content, captions, and media references by editing the `SCENES` array in the `<script>` block of `public/index.html`. Each scene has `start`, `video`, and `end` items. The project includes 8 scenes with branching paths based on user arrow key choices (← / →).
- Add or restyle visuals through CSS classes in the `<style>` block. New utility classes should live alongside existing ones. CSS custom properties control timing (`--fade`, `--border`) and theming (`--h`, `--s`, `--l`).
- Keep the JavaScript focused on orchestration: DOM lookups, scene progression, media caching, and choice handling. If something feels longer than a few lines, prefer extracting it into CSS/HTML instead.
- Error handling is intentionally quiet. Only log with `console.error` when an action truly fails (missing element, media that cannot play, etc.); otherwise, let the flow continue without status banners.

## Project folders
`public/` contains the single HTML entry point (`index.html`) with all CSS and JavaScript inline, plus all media assets. `server.js` serves `index.html` at the root and media assets from `/assets/`. No external JSON feeds are required; all scene data and metadata are defined in the `SCENES` array within the HTML file.

## Development with Claude Code

This project uses Claude Code with custom skills and hooks for streamlined development:

### Getting Started
```bash
npm install -g @anthropic-ai/claude-code
cd guided-meditation
claude
```

### Automated Hooks
Located in `.claude/hooks/`, these scripts run automatically:
- **user-prompt-submit** - Enhances prompts with project context
- **pre-tool-use** - Validates before file modifications
- **post-tool-use** - Runs linting after code changes
- **pre-skill-use** - Injects context before skill execution
- **post-skill-use** - Validates skill outputs

### Available Skills
Located in `.claude/skills/`, invoke for complex tasks:
- **explore-concepts-and-specs** - Generate and evaluate feature concepts
- **visualize-architecture** - Create Mermaid diagrams (see `.claude/skills/visualize-architecture/DIAGRAMS.md`)
- **design-variation-logic** - Design branching and choice mechanics
- **design-browser-render** - Design UI layouts and interactions
- **check-code-quality** - Run linting and validation

### Key Principles
- **File-based communication** - Use markdown files for planning (see `notes/features.md`, `notes/fix.md`, `notes/refactor.md`, `notes/context.md`)
- **Automation via hooks** - Repetitive checks run automatically on every tool use
- **Skills for complexity** - Multi-step workflows use specialized agents
- **Progressive disclosure** - Context loads only when needed, keeping sessions efficient

See `CLAUDE.md` for detailed workflow documentation and `notes/context.md` for browser constraints and technical context.

## Cursor IDE Setup

This project includes Cursor IDE configuration for optimal development experience:

- **`.cursor/rules`** - Project-specific Cursor rules and guidelines
- **`.cursorrules`** - Root-level Cursor rules (for compatibility)
- **`notes/cursor-setup.md`** - Complete guide to recommended Cursor extensions and configuration

### Quick Setup
1. Install recommended extensions (see `notes/cursor-setup.md`)
2. Cursor will automatically use `.cursor/rules` and `.cursorrules` for AI assistance
3. Configure Biome.js formatter for auto-formatting on save
4. Enable Mermaid preview for diagram files in `mermaid diagrams/` folder

### Documentation Structure
- **`notes/`** - Detailed development documentation
  - `features.md` - Implemented and planned features (including 7-chakra vision)
  - `fix.md` - Outstanding fixes and issues
  - `context.md` - Browser constraints, data schemas, and technical context
  - `cursor-setup.md` - Cursor IDE setup guide
  - `refactor.md` - Architecture principles and refactor notes
- **`docs/`** - Summary documentation (shorter versions)
  - `fix.md` - Outstanding fixes summary
  - `refactor.md` - Refactor summary
- **`mermaid diagrams/`** - Mermaid diagram files (`.mmd` or `.md` with mermaid blocks)
- **`.claude/skills/visualize-architecture/DIAGRAMS.md`** - Architecture diagrams (4 comprehensive Mermaid diagrams)
- **`CLAUDE.md`** - Claude Code workflow and architecture overview
- **`README.md`** - This file (project overview)


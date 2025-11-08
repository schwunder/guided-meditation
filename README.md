# Guided Meditation
Interactive guided meditation experience delivered with static HTML sequences, lightweight CSS, and a lean controller in `public/main.js`.

## Architecture Overview
| Layer | Responsibilities |
| --- | --- |
| Static HTML shell | `public/index.html` now hard-codes the entire flow: two `<section class="sequence">` blocks, each with the checkpoints, captions, and media hooks already in place. Every visual tweak lives in markup or CSS classes so nothing needs to be cloned or templated at runtime. |
| Styling (`public/index.html` + `public/styles.css`) | Layout, color, animation, and responsive states belong to CSS. Timing values and accents are handled with custom properties instead of JavaScript constants. |
| JavaScript controller (`public/main.js`) | ~200 lines that only wire up DOM references, attach listeners, and advance through the static checkpoints. No ternaries, no dynamic template creation, and only minimal `console.error` output when a real failure occurs. |
| Dev server (`server.js`) | Bun-based static server that simply returns the HTML sequences, `main.js`, CSS, and media assets without any JSON endpoints. |

## Editing the experience
- Update checkpoint copy, media references, or layout directly inside the sequence markup in `public/index.html`. The project assumes two sequences: `meditation-room → things-change → kitchen` and `kitchen → things-change → final-checkpoint`.
- Add or restyle visuals through CSS classes rather than inline styles or JavaScript mutations. New utility classes should live alongside the existing ones in the stylesheet.
- Keep `public/main.js` focused on orchestration: DOM lookups, timeline advancement, and state toggles. If something feels longer than a few lines, prefer extracting it into CSS/HTML instead.
- Error handling is intentionally quiet. Only log with `console.error` when an action truly fails (missing element, media that cannot play, etc.); otherwise, let the flow continue without status banners.

## Project folders
`public/` contains the static entry point, CSS, JS, and all media. `server.js` exposes the `public/` directory for local development. No external JSON feeds are required; sequences and metadata ship inside the HTML.

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
- **File-based communication** - Use markdown files for planning (see `docs/notes.md`, `docs/fix.md`, `docs/features.md`, `docs/refactor.md`)
- **Automation via hooks** - Repetitive checks run automatically on every tool use
- **Skills for complexity** - Multi-step workflows use specialized agents
- **Progressive disclosure** - Context loads only when needed, keeping sessions efficient

See `CLAUDE.md` for detailed workflow documentation and `docs/context.md` for browser constraints and technical context.

## Cursor IDE Setup

This project includes Cursor IDE configuration for optimal development experience:

- **`.cursor/rules`** - Project-specific Cursor rules and guidelines
- **`.cursorrules`** - Root-level Cursor rules (for compatibility)
- **`docs/cursor-setup.md`** - Complete guide to recommended Cursor extensions and configuration

### Quick Setup
1. Install recommended extensions (see `docs/cursor-setup.md`)
2. Cursor will automatically use `.cursor/rules` and `.cursorrules` for AI assistance
3. Configure Biome.js formatter for auto-formatting on save
4. Enable Mermaid preview for diagram files in `mermaid diagrams/` folder

### Documentation Structure
- **`docs/`** - Project documentation
  - `features.md` - Implemented and planned features
  - `fix.md` - Outstanding fixes and issues
  - `context.md` - Browser constraints and technical context
  - `cursor-setup.md` - Cursor IDE setup guide
  - `notes.md` - Development notes and principles
  - `refactor.md` - Static sequence refactor plan
- **`mermaid diagrams/`** - Mermaid diagram files (`.mmd` or `.md` with mermaid blocks)
- **`README.md`** - This file (project overview)


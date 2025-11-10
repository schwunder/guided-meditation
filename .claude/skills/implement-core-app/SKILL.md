---
name: implement-core-app
description: Generate complete browser game from design specs. Full implementation in one pass.
allowed-tools: '*'
---

# Implement Core App

Generate complete browser-based decision tree game based on all design specs.

## Read Design Reports

- `design-variation-logic` - Decision tree and game state specifications
- `design-browser-render` - HTML/CSS/keyboard navigation specifications
- `explore-implementation-options` - Technology choices (CDN libraries, patterns)

## Implementation Approach

Implement complete game structure:

### server.js
- Bun HTTP server
- Static file serving
- Simple routing (if needed)

### index.html
- Page structure
- CDN library imports (if using any)
- Semantic HTML for accessibility

### main.js
- Decision tree data structure
- Game state management
- Keyboard event handlers
- Navigation logic
- DOM manipulation

### styles.css
- Vanilla CSS styling
- Responsive layout
- Animations/transitions
- Visual feedback states

Follow architecture pattern chosen during exploration.

## Bounds

- 4 core files: server.js, index.html, main.js, styles.css
- Additional files if needed: game data, utilities

## Quality Guidelines

- Clean vanilla JavaScript (no TypeScript)
- Testable: pure functions where possible
- Modular: clear separation of concerns
- Accessible: keyboard navigation, semantic HTML
- Documented: key functions have comments

## Report Format

```markdown
## Implement: Core App

**Structure:** {files created}
**Features:** {game mechanics implemented}
**Status:** {server runs, game playable}

**Next:** integrate-features
```

---
name: design-browser-render
description: Design meditation UI layouts, caption styles, choice interactions, and visual effects (pure spec, no code)
allowed-tools: '*'
---

# Design Browser Render

Design HTML structure, CSS styling, and interaction patterns for the meditation experience. Pure specification - no implementation.

## What to Design

### HTML Structure
- Stage template structure and slots
- Caption and choice layout
- Status banner positioning
- Container hierarchy for responsive design
- Media element integration (img/video)

### CSS Styling
- Visual theme (colors, typography, spacing)
- Radiant border animations and hue shifts
- Caption backdrop and readability
- Choice presentation and hover/focus states
- Responsive layout (mobile, tablet, desktop)
- Accessibility (focus indicators, contrast)

### Interaction Patterns
- Choice selection (keyboard, touch, click)
- Navigation controls (pause, resume, restart)
- Progress indicators (optional)
- Focus management for accessibility
- Loading states and transitions

### Animation & Effects
- Stage fade in/out transitions
- Hue shift animation timing
- Caption reveal effects
- Choice selection feedback
- Video playback controls (if needed)

## Design Principles

- Maintain calm, meditative aesthetic
- Ensure smooth, non-jarring transitions
- Keep interactions intuitive and minimal
- Support keyboard-only navigation
- Respect reduced motion preferences
- Mobile-first responsive design

## Current System

- Single `<template id="stage">` cloned per scene
- CSS variables control timing and hues
- Radiant border animation with dynamic hue
- Caption and choice slots in template
- No interaction handlers yet (choices informational only)

See `public/index.html` for current structure and styles.

## Report Format

```markdown
## Design: Meditation Browser Render

### HTML Structure
- Template: {stage, figure, media-slot, caption, choices}
- Container: {#experience, #asset-container hierarchy}
- Data attributes: {for CSS targeting}

### CSS Approach
- Theme: {color palette, typography, spacing}
- Layout: {flexbox/grid for responsive}
- Animations: {transitions, keyframes, timing}
- Responsive: {breakpoints, mobile-first}
- Accessibility: {focus, contrast, motion}

### Interaction Design
- Choice selection: {keyboard (1-9, arrows), touch, click}
- Focus management: {tab order, visual indicators}
- Navigation: {pause/play, restart controls}
- Feedback: {hover, focus, active states}

### Effects & Timing
- Stage transitions: {fade duration, easing}
- Hue shifts: {when, how, duration}
- Caption reveals: {entrance animation}
- Choice presentation: {stagger, highlight}

**Integration Points:**
- Stage composer (template cloning)
- Stage manager (class toggles)
- Hue controller (CSS variable updates)
- Event listeners for choices

**Next:** implement-core-app (or integrate-features if adding to existing)
```

## Notes

- Design should respect meditation flow (calm, unhurried)
- Consider accessibility (keyboard, screen readers, motion)
- Think mobile-first (touch targets, viewport)
- Keep visual complexity low (reduce cognitive load)
- Test with `prefers-reduced-motion` and high contrast modes

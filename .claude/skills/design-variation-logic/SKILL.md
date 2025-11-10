---
name: design-variation-logic
description: Design meditation sequence branching, choice interactions, and conditional timeline logic (pure spec, no code)
allowed-tools: '*'
---

# Design Variation Logic

Design meditation sequence branching, choice interactions, and conditional timeline variations. Pure specification - no implementation.

## What to Design

### Sequence Branching Structure
- **Node types**: Checkpoint nodes, transition nodes, choice nodes, branching points
- **Branching logic**: How user choices lead to different meditation paths
- **Path management**: How to handle forward/backward navigation in branching sequences
- **State tracking**: What data persists through the meditation session

### Choice System
- **Choice presentation**: When/how choices are presented to the user
- **Choice timing**: Pause timeline, show choices, wait for selection
- **Choice validation**: Input methods (keyboard, touch, click)
- **Choice consequences**: How selections route to different sequence branches

### Timeline Variations
- **Conditional sequences**: Based on user choices or preferences
- **Dynamic insertion**: Adding/removing sequence items at runtime
- **Loop handling**: Repeating sections, practice cycles
- **Early exit**: Allowing users to end or pause gracefully

### Data Schema Extensions
- **Choice metadata**: How choices are stored in sequence.json
- **Branch targets**: Linking choice selections to sequence paths
- **State persistence**: Session storage for progress/choices
- **Resume capability**: Saving and loading meditation progress

## Design Principles

- Keep state management simple and predictable
- Ensure all paths are navigable and meaningful
- Maintain meditation flow (avoid jarring interruptions)
- Support graceful degradation (choices optional)
- Handle edge cases (network errors, missing assets)

## Current System

- `readTimeline()` parses HTML markup and yields sequence items sequentially
- Choices render visually via `data-choice-list` but have no interaction
- No branching or conditional logic exists
- Map-based cache preloads all assets linearly
- Currently 2 sequences in HTML: "arrival" and "kitchen"

## Report Format

```markdown
## Design: Meditation Sequence Branching

### Branching Structure
- Nodes: {checkpoint, transition, choice types}
- Branching: {how choices connect to paths}
- State: {what session data is tracked}
- Navigation: {forward, back, jump behavior}

### Choice System
- Presentation: {when/how choices appear}
- Input: {keyboard, touch, click methods}
- Timing: {pause timeline, wait for input}
- Effects: {how choices route to branches}

### Timeline Variations
- Conditional: {based on user state}
- Dynamic: {runtime sequence changes}
- Loops: {repeating sections}
- Exit: {pause/resume/restart}

### Data Schema
- sequence.json: {new fields for branching}
- Session state: {what to persist}
- Resume: {save/load mechanism}

**Integration Points:**
- Timeline iterator modifications
- Media factory preload strategy
- Stage manager state handling
- Status store updates

**Next:** design-browser-render (for choice interaction UI)
```

## Notes

- Respect meditation context (calm, intentional, non-gamified)
- Consider mobile touch interactions
- Think about accessibility (keyboard-only, screen readers)
- Balance complexity vs meditation simplicity

---
name: integrate-features
description: Wire all game features and ensure browser compatibility. Ensure complete integration across codebase.
allowed-tools: '*'
---

# Integrate Features

Wire all game features together. Ensure browser compatibility and proper integration.

## What to Integrate

Find and update all integration points:

1. **Game state**: Ensure decision tree nodes connect properly
2. **Event handlers**: Wire keyboard navigation to game logic
3. **DOM updates**: Connect state changes to UI updates
4. **Data flow**: Verify data flows from input → state → render
5. **Browser compatibility**: Test in different browsers if possible

## Process

Search codebase for integration points, update systematically, verify completeness.

Test manually in browser to confirm everything works.

## Verification

After integration, confirm:
- Keyboard navigation works for all actions
- All decision paths are reachable
- UI updates correctly on state changes
- No console errors in browser DevTools
- Game is playable from start to end

## Report Format

```markdown
## Integrate: Features

**Modified:** {list of files updated}
**Verified:** {confirmation all features work}
**Browser:** {tested in which browsers}

**Next:** check-code-quality
```

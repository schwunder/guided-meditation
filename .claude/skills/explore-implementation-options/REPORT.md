## Explore: Implementation Options

### Decision 1: Color/Styling Library

**Tested:** Raw ANSI, Chalk, Picocolors, CLI-Boxes

**Winner:** Raw ANSI escape codes

**Reasoning:**
- Full 24-bit RGB color control for precise gradients
- Zero abstraction overhead = maximum performance
- Complete flexibility for custom color schemes
- Picocolors lacks RGB support (16-color only)
- Chalk adds unnecessary dependency weight for features we don't need
- For a comparison/diff tool, we need precise color control
- Simple helper functions eliminate verbosity

---

### Decision 2: Layout Framework

**Tested:** Blessed, Ink (React), Raw manual rendering

**Winner:** Raw manual rendering

**Reasoning:**
- **Blessed:** Outdated (2019), terminal compatibility issues, heavy API
- **Ink:** Heavy (React + 36 packages), overkill for non-reactive static layout
- **Raw:** Full control, minimal deps, perfect for side-by-side diff rendering
- Side-by-side layout doesn't need framework abstraction
- Manual positioning gives precise control over every element
- No performance overhead from virtual DOM or widget trees

---

### Decision 3: Terminal Control

**Tested:** ansi-escapes, raw escape sequences

**Winner:** ansi-escapes

**Reasoning:**
- Well-maintained utility library for cursor/screen control
- Abstracts complex escape sequences (cursor save/restore, screen clearing)
- Lightweight (no styling overhead)
- Complements raw ANSI styling approach
- Cross-terminal compatibility

---

### Decision 4: Architecture Pattern

**Winner:** Functional/procedural rendering

**Reasoning:**
- Simple tool doesn't need component framework
- Direct render functions are faster and clearer
- Easy to test and maintain
- Clear data flow: input → process → render
- No state management complexity

---

## Test Files Created

- `explore-styling.ts` - Compared styling libraries
- `explore-blessed.ts` - Tested Blessed framework
- `explore-ink.tsx` - Tested Ink/React
- `explore-raw.ts` - Tested manual rendering
- `explore-decision.md` - Decision matrix

---

## Final Stack

**Keep:**
- ansi-escapes (cursor/screen control)

**Remove:**
- chalk
- picocolors
- cli-boxes
- blessed
- @types/blessed
- ink
- react
- @types/react

**Architecture:** Raw ANSI + functional rendering + manual layout

**Next:** finalize-dependencies

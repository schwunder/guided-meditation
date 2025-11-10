## Implement: Core App

### Structure

**Source files (7):**
- `src/types.ts` - Type definitions (RGB, HSL, Configuration, BorderStyle, etc.)
- `src/color.ts` - Color utilities (RGB↔HSL conversion, ANSI formatting, distance calc)
- `src/variation.ts` - Variation generation logic (color, split, border algorithms)
- `src/borders.ts` - Border character sets (6 styles with Unicode box-drawing)
- `src/render.ts` - Terminal rendering system (panel layout, frame composition)
- `src/input.ts` - Keyboard input handling (arrow keys, raw mode)
- `src/index.ts` - Main application entry point (state management, event loop)

**Test files (3):**
- `tests/color.test.ts` - Color conversion and utility tests
- `tests/variation.test.ts` - Variation generation algorithm tests
- `tests/borders.test.ts` - Border character set tests

**Configuration:**
- `package.json` - Scripts (start, test, type-check, lint)
- `README.md` - Complete documentation
- `tsconfig.json` - TypeScript configuration (strict mode)
- `biome.json` - Linting rules

---

### Implementation Details

**Architecture:** Functional/procedural rendering (as designed)

**Color System:**
- RGB ↔ HSL conversion for perceptually uniform variations
- Hue rotation: 60-120° initially, decreasing to 5-15° with refinement
- Distinctness guarantee: Minimum color distance of 50 (RGB Euclidean)
- Raw ANSI escape codes: `\x1b[38;2;R;G;Bm`

**Split Ratio:**
- Range: [0.2, 0.8] (20-80% for minimum readable space)
- Initial variation: ±15-25%, refined to ±2-4%
- Minimum distinctness: 2% absolute difference

**Border Styles:**
- 6 styles: Light, Heavy, Double, Rounded, Dotted, ASCII
- History tracking prevents recent repeats
- Unicode box-drawing characters + ASCII fallback

**Rendering:**
- Side-by-side panels with dynamic split
- Status bar at bottom (navigation hints)
- Single-write frame composition (minimize flicker)
- Terminal size detection with minimum 60×10 validation

**Input:**
- Raw keyboard mode for arrow key detection
- Left arrow: Choose Option A
- Right arrow: Choose Option B
- `q` or Ctrl+C: Quit

---

### Tests

**Coverage:**
- ✅ 19 tests passing
- ✅ 59 assertions
- ✅ 3 test files

**Test categories:**
- Color conversion (RGB↔HSL round-trip)
- Color clamping and distance calculation
- Variation generation (color, split, border)
- Distinctness enforcement
- Border character retrieval
- Configuration validation

---

### Status

**✅ Tests:** 19/19 passing (100%)

**✅ Types:** No TypeScript errors (strict mode enabled)

**✅ Compilation:** Application compiles and runs successfully

**✅ Dependencies:** Clean tree with 1 production dep (ansi-escapes)

---

### Entry Point

```bash
bun run src/index.ts
```

**Controls:**
- `←` - Choose left option
- `→` - Choose right option
- `q` - Quit

**Features working:**
1. ✅ Color scheme variation (progressive hue rotation)
2. ✅ Panel split variation (dynamic width allocation)
3. ✅ Border style variation (6 character sets)
4. ✅ Progressive refinement (coarse → fine)
5. ✅ Side-by-side rendering
6. ✅ Keyboard navigation
7. ✅ Terminal size validation

---

### Code Quality

**Type Safety:**
- All functions have explicit type signatures
- No implicit `any` types
- Strict null checks enabled
- Interfaces for all data structures

**Modularity:**
- Clear separation: color/variation/render/input/types
- Pure functions where possible (color utils, variation logic)
- Minimal side effects (isolated to render and input modules)

**Documentation:**
- README with usage instructions
- Key functions have comments
- Type definitions self-document interfaces

---

**Next:** integrate-features

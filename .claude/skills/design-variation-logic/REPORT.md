## Design: Variation Logic

### Color Scheme (RGB Accent)
- **Type:** Multi-dimensional continuous (R, G, B: 0-255)
- **Strategy:** Hue rotation in HSL color space with saturation/lightness adjustments
- **Boundaries:** RGB clamp [0,255], HSL hue wraps at 360°, sat/light clamp [0,100]
- **Refinement:** Start ±60-120° hue rotation, decrease to ±5-15° + sat/light tweaks
- **Distinctness:** Minimum ΔE > 10 perceptual difference, fallback to ±20% lightness shift

---

### Panel Split Ratio
- **Type:** Continuous percentage (0.0 to 1.0, represents left panel width fraction)
- **Strategy:** Percentage adjustment with decreasing delta magnitudes
- **Boundaries:** Clamp to [0.2, 0.8] (20%-80%) for minimum readable space
- **Refinement:** Start ±15-25% adjustment, decrease to ±2-4% fine-tuning
- **Distinctness:** Minimum 2% (0.02) absolute difference, ~1.6 columns visible at 80-col

---

### Border Style
- **Type:** Discrete categorical (6 base styles: Light, Heavy, Double, Rounded, Dotted, ASCII)
- **Strategy:** Cycle through predefined box-drawing character sets, then introduce mixed styles
- **Boundaries:** Finite set of 6 base + ~12 mixed variations, restart with combinations if exhausted
- **Refinement:** Iterations 1-3 try base styles, 4-6 try mixed styles, 7+ corner variations
- **Distinctness:** Never repeat same style in one choice, ensure 2+ character changes per border

---

### Algorithm Properties

**Progressive Refinement:**
- Iteration 1: Large deltas (coarse exploration)
- Iteration 2-3: Medium deltas (narrowing)
- Iteration 4+: Small deltas (fine-tuning)

**Randomization:**
- Direction: Random increase/decrease
- Magnitude jitter: ±5-10% noise on delta size
- Feature coupling: Vary features independently or together
- Panel order: Which side shows conservative vs experimental option

**Distinctness Guarantees:**
- Cross-feature: At least ONE feature differs by large delta initially
- Never present identical configurations
- History tracking prevents duplicate presentations

**Boundary Handling:**
- Clamp to valid ranges
- Reverse direction at limits
- Alternative dimension adjustment when primary blocked

---

### Implementation Readiness

**Algorithms Specified:**
- HSL ↔ RGB color space conversion
- Perceptual color difference calculation (ΔE)
- Progressive delta scheduling
- History-aware random selection
- Configuration distinctness validation

**Data Structures:**
- Configuration: `{ color: RGB, split: number, borderStyle: enum }`
- History: Array of configurations + choices
- Delta schedule: Function(iteration) → multiplier

---

**Status:** ✅ Complete specification for 3 features

**Next:** design-terminal-render

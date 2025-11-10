# Variation Logic Design

## Core Concept

A swiper tool for comparing terminal UI variations. User chooses between two side-by-side options, and the system generates progressively refined alternatives.

## Feature Set (Max 3)

1. **Color Scheme** (RGB accent colors)
2. **Panel Split** (left/right width ratio)
3. **Border Style** (box-drawing character set)

---

## 1. Color Scheme

### Type
- **Multi-dimensional continuous (RGB)**
- Primary accent color for borders, highlights, status bar
- 3 channels: Red (0-255), Green (0-255), Blue (0-255)

### Variation Strategy
**Initial Generation:**
- Start with base color (e.g., chosen by user or random)
- Generate variation by rotating hue in HSL color space
- Initial rotation: ±60-120° (large perceptual difference)
- Convert back to RGB for rendering

**Refinement:**
- Reduce rotation angle with each iteration
- Iteration 1: ±60-120° rotation
- Iteration 2: ±30-60° rotation
- Iteration 3: ±15-30° rotation
- Iteration 4+: ±5-15° rotation, adjust saturation/lightness

**Direction Randomization:**
- Randomly choose clockwise or counter-clockwise hue rotation
- Randomly adjust saturation (±10-20%) and lightness (±10-20%)

### Boundaries
- **RGB clipping:** Clamp each channel to [0, 255]
- **HSL wrapping:** Hue wraps at 360° (continuous circle)
- **Saturation/Lightness:** Clamp to [0, 100]

### Refinement Approach
- Start with coarse hue changes (large perceptual difference)
- Progress to fine hue adjustments + saturation/lightness tweaks
- Final iterations: subtle tonal variations within same color family

### Distinctness Guarantee
- **Minimum perceptual difference:** ΔE > 10 (CIEDE2000 color difference)
- **Fallback:** If hue rotation produces similar color, adjust lightness by ±20%
- **Never identical:** Always apply at least ±5° hue shift OR ±10% lightness change

---

## 2. Panel Split Ratio

### Type
- **Continuous percentage (0.0 to 1.0)**
- Represents left panel width as fraction of total terminal width
- Right panel gets remaining space

### Variation Strategy
**Initial Generation:**
- Start with base ratio (e.g., 0.5 = 50/50 split)
- Generate variation by adjusting ±10-20%
- Example: 0.5 → {0.35, 0.65} (coarse alternatives)

**Refinement:**
- Reduce adjustment delta with each iteration
- Iteration 1: ±15-25% adjustment
- Iteration 2: ±8-15% adjustment
- Iteration 3: ±4-8% adjustment
- Iteration 4+: ±2-4% adjustment

**Direction Randomization:**
- Randomly choose to increase or decrease ratio
- Add small jitter (±1-2%) to avoid predictable midpoints

### Boundaries
- **Minimum left panel:** 20% (0.2) - need readable space
- **Maximum left panel:** 80% (0.8) - need readable right panel
- **Clamping:** If variation exceeds bounds, clamp to limit

### Refinement Approach
- Start with large ratio changes (e.g., 50/50 → 35/65)
- Progress to fine-tuning (e.g., 50/50 → 48/52)
- Converge on user's preferred balance

### Distinctness Guarantee
- **Minimum difference:** 2% (0.02) absolute difference
- **Visual threshold:** At 80-column terminal, 2% = ~1.6 columns visible difference
- **Never identical:** Always shift by at least ±2%

---

## 3. Border Style

### Type
- **Discrete categorical (enum of box-drawing sets)**
- Predefined character sets for drawing panel borders

### Variation Strategy
**Character Sets:**
1. **Light:** ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
2. **Heavy:** ━ ┃ ┏ ┓ ┗ ┛ ┣ ┫ ┳ ┻ ╋
3. **Double:** ═ ║ ╔ ╗ ╚ ╝ ╠ ╣ ╦ ╩ ╬
4. **Rounded:** ─ │ ╭ ╮ ╰ ╯ ├ ┤ ┬ ┴ ┼
5. **Dotted:** ┄ ┆ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
6. **ASCII:** - | + + + + + + + + +

**Initial Generation:**
- Start with base style (e.g., Light)
- Select random alternative from remaining 5 styles
- Prefer visually distinct styles (avoid Light→Rounded initially)

**Refinement:**
- After several iterations, introduce subtle variations:
  - Mix styles (light horizontal, heavy vertical)
  - Adjust corner styles only
  - Change line weight selectively

### Boundaries
- **Finite set:** 6 base styles, ~12 mixed variations
- **Exhaustion:** If all styles tried, restart with new combination strategy

### Refinement Approach
- Iteration 1-3: Try base styles (6 options)
- Iteration 4-6: Try mixed styles (horizontal≠vertical weight)
- Iteration 7+: Corner-only variations

### Distinctness Guarantee
- **Categorical difference:** Never present same style twice in one choice
- **Visual distinction:** Ensure at least 2 character changes per border
- **Memorization:** Track presented styles, never repeat exact combination

---

## Algorithm Flow

### Initial State
```
Base Configuration:
  Color: HSL(180°, 50%, 50%) → RGB(64, 191, 191) [Cyan]
  Split: 0.5 (50/50)
  Border: Light
```

### Iteration 1 (Coarse)
```
Option A (keep base):
  Color: HSL(180°, 50%, 50%)
  Split: 0.5
  Border: Light

Option B (large variation):
  Color: HSL(270°, 50%, 50%) [+90° → Purple]
  Split: 0.65 [+15%]
  Border: Heavy
```

### User Chooses B → New Base

### Iteration 2 (Medium)
```
Option A (keep new base):
  Color: HSL(270°, 50%, 50%)
  Split: 0.65
  Border: Heavy

Option B (medium variation):
  Color: HSL(315°, 55%, 45%) [+45°, +5% sat, -5% light → Magenta]
  Split: 0.55 [-10%]
  Border: Double
```

### And so on...

---

## Randomization Strategy

**Purpose:** Prevent predictability, explore parameter space effectively

**Methods:**
1. **Direction:** 50/50 chance to increase or decrease value
2. **Magnitude jitter:** Add ±5-10% noise to delta size
3. **Feature coupling:** Occasionally vary 2 features together, sometimes independently
4. **Order randomization:** Which panel shows "conservative" vs "experimental" option

**Constraints:**
- Never generate identical options (enforce minimum delta)
- Balance exploration (large changes) vs exploitation (refinement)
- Track history to avoid revisiting same configurations

---

## Distinctness Guarantees

### Cross-Feature
- At least ONE feature must differ by "large delta" initially
- As iterations progress, can have multiple features with small deltas
- Never present identical configurations in same choice

### Per-Feature Minimums
- **Color:** ΔE > 10 (perceptual difference)
- **Split:** 2% absolute difference (visible at typical terminal sizes)
- **Border:** Different style or different character weights

### Validation
Before presenting options:
1. Check all per-feature minimums
2. If too similar, regenerate with larger delta
3. Track presented configurations to prevent duplicates

---

## Edge Cases

### Boundary Collisions
- **Color at saturation limits:** Adjust hue instead
- **Split at min/max:** Reverse direction, use opposite adjustment
- **Border styles exhausted:** Introduce mixed styles or restart

### Convergence
- **User keeps selecting "no change":** Reduce deltas faster
- **User alternates selections:** Increase exploration (larger deltas)
- **Rapid convergence:** Detect preference, fine-tune around it

### Terminal Size Constraints
- **Narrow terminal (<40 cols):** Limit split range to [0.3, 0.7]
- **Tall terminal:** Unused vertical space (border styling more visible)
- **Very large terminal:** More room for asymmetric splits

---

## Implementation Notes (for next phase)

**Data Structures:**
- Configuration: `{ color: RGB, split: number, borderStyle: BorderStyleEnum }`
- History: Array of presented configurations + user choices
- Delta schedule: Function(iteration) → delta_multiplier

**Key Functions:**
- `generateVariation(base, iteration, history) → Configuration`
- `ensureDistinct(optionA, optionB) → boolean`
- `calculateColorDelta(rgb1, rgb2) → deltaE`
- `selectBorderVariation(currentStyle, tried) → BorderStyle`

**Algorithms:**
- HSL ↔ RGB conversion
- CIEDE2000 color difference (simplified: Euclidean in RGB space initially)
- History-aware random selection (avoid recent configurations)

---

## Summary

**3 Features, Progressive Refinement:**
1. **Color:** Hue rotation in HSL space, decreasing angles
2. **Split:** Percentage adjustment, decreasing deltas
3. **Border:** Style cycling through discrete options

**Key Properties:**
- ✅ Similar but distinct variations
- ✅ Progressive refinement (coarse → fine)
- ✅ Never identical values
- ✅ Boundary-aware clamping
- ✅ Randomized direction/magnitude

**Ready for:** Terminal rendering design

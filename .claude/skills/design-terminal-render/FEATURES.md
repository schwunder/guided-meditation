# Feature Rendering Specifications

## 1. Color Scheme (RGB Accent)

### Visual Metaphor
The accent color represents the "personality" or "theme" of each option. It's the primary visual identifier that makes each panel feel distinct.

### Rendering Approach
**Application points:**
1. **Border lines** - All border characters rendered in accent color
2. **Title text** - "OPTION A" / "OPTION B" in accent color, bold
3. **Color sample bar** - Large filled block showing pure accent color
4. **RGB value display** - Text showing RGB(r,g,b) below sample

**Visual hierarchy:**
```
╭─────────────────────╮  <- Accent color
│  OPTION A           │  <- Accent color + bold
│                     │
│  ████████████       │  <- 12 block chars (█) in accent
│  RGB(64, 191, 191)  │  <- Dimmed text
│                     │
╰─────────────────────╯  <- Accent color
```

### Elements
- **Characters:** Box-drawing (border), █ (color sample), regular text
- **Colors:**
  - Accent RGB for border/title/sample
  - Dim white/gray for labels
  - Full brightness for color sample blocks
- **Spacing:** 12-character wide color bar, centered or left-aligned

### Distinct When
- **Hue difference ≥ 30°** in HSL space (e.g., cyan vs purple)
- **Lightness difference ≥ 20%** if hues similar
- **Visual test:** User can name color families (red, blue, green, purple, etc.)
- **Saturation contrast:** Avoid gray vs gray (ensure one has saturation >30%)

**Rendering formula:**
```
borderColor = rgb(r, g, b)
titleColor = rgb(r, g, b) + bold
sampleColor = rgb(r, g, b) on background
```

---

## 2. Panel Split Ratio

### Visual Metaphor
The split ratio represents "balance" or "weight" - which side gets more space. Asymmetry is immediately visible and conveys emphasis.

### Rendering Approach
**Physical space allocation:**
- Calculate pixel-perfect column positions based on ratio
- Left panel width = totalWidth × split
- Right panel width = totalWidth × (1 - split)

**Visual reinforcement:**
```
50/50 split (symmetric):
┌──────────────────┬──────────────────┐
│                  │                  │
│   Equal space    │   Equal space    │
└──────────────────┴──────────────────┘

60/40 split (asymmetric):
┌────────────────────────┬──────────────┐
│                        │              │
│   More space           │  Less space  │
└────────────────────────┴──────────────┘
```

**Info display:**
Show split ratio as text in each panel:
- "Split: 50/50" or "Split: 60/40"
- Display width in columns: "Width: 40 cols"

### Elements
- **Spacing:** Actual column allocation
- **Borders:** Vertical divider at split point
- **Text label:** "Split: XX/YY" in config section
- **Visual cue:** Panel width itself is the primary indicator

### Distinct When
- **Absolute difference ≥ 4 columns** at 80-char width (5% ratio difference)
- **Perceptual threshold:** User notices asymmetry without measuring
- **Extreme ratios more obvious:** 70/30 vs 50/50 >> 52/48 vs 50/50

**Rendering formula:**
```
leftWidth = floor(terminalWidth × split)
rightWidth = terminalWidth - leftWidth
splitPoint = leftWidth

leftPanel: columns [0, leftWidth)
rightPanel: columns [leftWidth, terminalWidth)
```

---

## 3. Border Style

### Visual Metaphor
Border style represents "texture" or "weight" - the visual framework around each option. Different line styles convey different aesthetics (delicate, bold, technical, playful).

### Rendering Approach
**Character set application:**
Apply chosen style to all border drawing:

**Light style:**
```
┌─────────┐
│ Content │
└─────────┘
```

**Heavy style:**
```
┏━━━━━━━━━┓
┃ Content ┃
┗━━━━━━━━━┛
```

**Double style:**
```
╔═════════╗
║ Content ║
╚═════════╝
```

**Rounded style:**
```
╭─────────╮
│ Content │
╰─────────╯
```

**Dotted style:**
```
┌┄┄┄┄┄┄┄┄┄┐
┆ Content ┆
└┄┄┄┄┄┄┄┄┄┘
```

**ASCII style:**
```
+---------+
| Content |
+---------+
```

**Mixed style (advanced):**
```
┏━━━━━━━━━┓  <- Heavy horizontal
│ Content │  <- Light vertical
┗━━━━━━━━━┛  <- Heavy horizontal
```

### Elements
- **Characters:** Box-drawing Unicode or ASCII fallback
- **Positions:** All 12 border positions (corners, sides, intersections)
- **Color:** Rendered in accent color (combined with Feature #1)
- **Label:** "Border: Light" or "Border: Heavy" in config section

### Distinct When
- **Visual weight different:** Light vs Heavy immediately visible
- **Character shape different:** Straight vs Rounded vs Double
- **Line continuity different:** Solid vs Dotted
- **At least 2 character types change:** Not just corners, also lines

**Rendering formula:**
```
borderStyle = {
  topLeft, topRight, bottomLeft, bottomRight,
  horizontal, vertical,
  topJoin, bottomJoin, leftJoin, rightJoin
}

For each border position:
  output = colorize(borderStyle[position], accentColor)
```

---

## Combined Rendering Example

**Full frame with all 3 features:**

```
Terminal width: 80, Height: 24
Split: 55/45 (44 left, 36 right)
Colors: Cyan (180°) vs Magenta (300°)
Borders: Rounded vs Heavy

┌<- 0                    43->┬<- 44                  79->┐
╭──────────────────────────────────────────╮┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
│  OPTION A                                │┃  OPTION B                        ┃
│                                          │┃                                  ┃
│  Color:                                  │┃  Color:                          ┃
│  ████████████████████  (Cyan)            │┃  ████████████████  (Magenta)     ┃
│  RGB(64, 191, 191)                       │┃  RGB(191, 64, 191)               ┃
│                                          │┃                                  ┃
│  Config:                                 │┃  Config:                         ┃
│  Split: 55/45                            │┃  Split: 55/45                    ┃
│  Width: 44 cols                          │┃  Width: 36 cols                  ┃
│  Border: Rounded                         │┃  Border: Heavy                   ┃
│  Iteration: 3                            │┃  Iteration: 3                    ┃
│                                          │┃                                  ┃
│                                          │┃                                  ┃
│  (Additional content or padding)         │┃  (Additional content)            ┃
│                                          │┃                                  ┃
│                                          │┃                                  ┃
│                                          │┃                                  ┃
│                                          │┃                                  ┃
│                                          │┃                                  ┃
╰──────────────────────────────────────────╯┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
 Press ← for Option A  |  Press → for Option B  |  q: quit
```

## Rendering Pipeline

### Step 1: Calculate Dimensions
```
termWidth = process.stdout.columns
termHeight = process.stdout.rows
leftWidth = floor(termWidth * config.split)
rightWidth = termWidth - leftWidth
contentHeight = termHeight - 1  // Reserve bottom for status
```

### Step 2: Build Panel Content
```
For each panel (A, B):
  1. Get border characters from borderStyle
  2. Get accent color RGB from config
  3. Calculate content area (width - 2 borders, height - 2 borders)
  4. Build text lines (title, color sample, config info)
  5. Apply word wrap/truncation to fit width
```

### Step 3: Compose ANSI Output
```
buffer = []
buffer.push(clearScreen)
buffer.push(hideCursor)

For each row from 0 to contentHeight:
  leftLine = renderPanelLine(configA, row, leftWidth)
  rightLine = renderPanelLine(configB, row, rightWidth)
  buffer.push(moveCursor(0, row))
  buffer.push(leftLine + rightLine)

buffer.push(moveCursor(0, termHeight - 1))
buffer.push(renderStatusBar())

output = buffer.join('')
stdout.write(output)
```

### Step 4: Handle Keyboard Input
```
Listen for keypresses:
  ← (left arrow): User chooses Option A
  → (right arrow): User chooses Option B
  q: Quit program
  Ctrl+C: Quit program

On choice:
  1. Update base configuration
  2. Increment iteration
  3. Generate new variation
  4. Re-render
```

---

## Visual Distinctness Matrix

| Feature       | Subtle Diff        | Moderate Diff      | Large Diff         |
|---------------|--------------------|--------------------|---------------------|
| **Color**     | 15° hue shift      | 45° hue shift      | 90° hue shift       |
| **Split**     | 2% (1.6 cols)      | 10% (8 cols)       | 25% (20 cols)       |
| **Border**    | Corner style only  | Line weight change | Complete style diff |

**Perception thresholds:**
- **Color:** 30° minimum for distinct families
- **Split:** 5% minimum for obvious asymmetry
- **Border:** 2+ character type changes for clear distinction

**Combined distinctness:**
- If color differs greatly, split can be subtle
- If color is subtle, ensure split or border differs greatly
- Always have at least ONE feature with "Large Diff"

---

## Accessibility Considerations

**Color blindness:**
- Use distinct lightness levels (not just hue)
- Deuteranopia (red-green): Use blue-yellow axis
- Include RGB values as text labels

**Low contrast terminals:**
- Ensure border characters visible even if colors fail
- Use bold text for titles
- High contrast status bar (reverse video)

**Screen readers:**
- Not applicable (visual-only tool)
- But text labels help sighted users explain choices

**Small terminals:**
- Degrade gracefully at <80 columns
- Switch to vertical stack if too narrow
- Truncate labels but keep color samples visible

---

## Error States

**Terminal too small:**
```
┌──────────────────────────────────────┐
│                                      │
│  Terminal too small!                 │
│  Minimum: 60 columns × 10 rows       │
│  Current: 40 columns × 8 rows        │
│                                      │
│  Please resize and restart.          │
│                                      │
└──────────────────────────────────────┘
```

**Color rendering fails:**
- Fall back to 16-color palette
- Use color names instead of RGB values
- Rely on border/split for distinction

**Unicode not supported:**
- Fall back to ASCII box drawing (+ - |)
- Use text-based color bars (######## in brackets)
- Still functional, just less pretty

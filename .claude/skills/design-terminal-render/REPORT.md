## Design: Terminal Render

### Color Scheme (RGB Accent)
- **Visual metaphor:** The "personality" or theme of each option
- **Approach:** Apply accent color to borders, title, and large filled block sample (12× █ chars)
- **Elements:** RGB colors on box-drawing chars, bold title text, block element color bar, RGB value label
- **Distinct when:** Hue differs ≥30° OR lightness differs ≥20%, user can name color families

---

### Panel Split Ratio
- **Visual metaphor:** "Balance" or "weight" - asymmetry shows emphasis
- **Approach:** Physical space allocation - left panel gets (width × split) columns, right gets remainder
- **Elements:** Actual column widths, vertical divider position, text label "Split: XX/YY", width indicator
- **Distinct when:** ≥4 columns difference at 80-char width (5% ratio), visible asymmetry without measuring

---

### Border Style
- **Visual metaphor:** "Texture" or "weight" - visual framework aesthetic
- **Approach:** Apply different box-drawing character sets (Light/Heavy/Double/Rounded/Dotted/ASCII)
- **Elements:** 12 border positions (corners, lines, joins) from chosen character set, colored with accent
- **Distinct when:** Visual weight differs (Light vs Heavy), shape differs (Rounded vs Straight), ≥2 character types change

---

### Layout Structure

**Dimensions:**
- Terminal: 80 cols × 24 rows minimum
- Panels: Side-by-side split (ratio-determined), top to (height-1)
- Status bar: Bottom line (navigation hints)

**Panel structure (per side):**
```
╭──────────────╮  <- Styled border
│  OPTION A    │  <- Title (bold + accent)
│              │
│  ████████    │  <- Color sample (12 blocks)
│  RGB(r,g,b)  │  <- Value display
│  Split: X/Y  │  <- Config info
│  Border: S   │
╰──────────────╯  <- Styled border
```

**Visual hierarchy:**
1. Border style (frames, immediate)
2. Color accent (large bar, attention)
3. Label (clear option ID)
4. Details (config values)

---

### Rendering Pipeline

1. **Calculate:** Panel widths from split ratio, content area dimensions
2. **Build:** Compose panel content (title, color sample, config text) per option
3. **Colorize:** Apply accent RGB to borders, titles, samples using raw ANSI codes
4. **Output:** Single batched write with clearScreen + cursor positioning + content + status bar

**Performance:**
- Pre-calculate all positions
- Batch ANSI sequences
- Single stdout write per frame
- Use alternate screen buffer

---

### Distinctness Criteria

| Feature    | Subtle          | Moderate        | Large           |
|------------|-----------------|-----------------|-----------------|
| Color      | 15° hue shift   | 45° hue shift   | 90° hue shift   |
| Split      | 2% (1.6 cols)   | 10% (8 cols)    | 25% (20 cols)   |
| Border     | Corners only    | Line weight     | Complete style  |

**Perception thresholds:**
- Color: 30° minimum for distinct families
- Split: 5% minimum for obvious asymmetry
- Border: 2+ character changes for clear distinction

**Cross-feature guarantee:**
- Always have at least ONE feature with "Large Diff"
- Visual differences perceivable in <1 second glance
- No reading required to spot variations

---

### Tools & Techniques

**From validation:**
- ✅ RGB colors (24-bit ANSI: `\x1b[38;2;R;G;Bm`)
- ✅ Unicode box-drawing (─│┌┐└┘━┃┏┓┗┛═║╔╗╚╝╭╮╰╯)
- ✅ Block elements (█ for color samples)
- ✅ Cursor control (ansi-escapes)
- ✅ Screen clearing (alternate buffer)

**Rendering functions needed:**
- `rgb(r, g, b, text)` - Colorize text
- `drawBorder(style, width, height, color)` - Box with chosen style
- `colorSample(rgb, width)` - Generate █ bar
- `formatConfig(config)` - Text display of settings
- `layoutPanel(config, width, height)` - Complete panel string

---

### Adaptation & Fallbacks

**Terminal size:**
- <60 cols: Vertical stack (top/bottom)
- 60-80: Standard side-by-side
- >80: Wider panels with more content

**Capability fallbacks:**
- No RGB: Use 16-color palette + names
- No Unicode: ASCII borders (+ - |)
- Too small: Error message with resize prompt

**Accessibility:**
- Include RGB text values for color blindness
- Use lightness contrast, not just hue
- Bold/dim text for hierarchy

---

**Status:** ✅ Complete visual specification

**Next:** implement-core-app

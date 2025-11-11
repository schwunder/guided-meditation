# Terminal Render Layout Design

## Overall Structure

```
┌────────────────────────────────────┬─────────────────────────────────────┐
│                                    │                                     │
│          OPTION A                  │          OPTION B                   │
│                                    │                                     │
│  ████████████ Color Sample         │  ████████████ Color Sample          │
│                                    │                                     │
│  Configuration visible here        │  Configuration visible here         │
│                                    │                                     │
└────────────────────────────────────┴─────────────────────────────────────┘
 Press ← to choose left, → to choose right, q to quit
```

## Dimensions

**Terminal assumptions:**
- Width: 80 characters minimum
- Height: 24 lines minimum
- User may have larger terminal (adapt dynamically)

**Layout allocation:**
- **Main panels:** Top to (height - 2) for content
- **Status bar:** Bottom line (always visible)
- **Panel division:** Vertical split determined by `split` ratio feature

**Example 50/50 split at 80 columns:**
- Left panel: 0-39 (40 chars)
- Right panel: 40-79 (40 chars)

**Example 60/40 split at 80 columns:**
- Left panel: 0-47 (48 chars)
- Right panel: 48-79 (32 chars)

## Panel Structure (per side)

```
Row  Content
─────────────────────────────
0    ╭─────────────────────╮    <- Top border (styled)
1    │                     │
2    │   Option Label      │    <- "OPTION A" / "OPTION B"
3    │                     │
4    │   Color Sample      │    <- Colored block showing accent
5    │                     │
6    │   Stats/Info        │    <- Iteration count, config details
7    │                     │
...  │   (padding)         │
-2   ╰─────────────────────╯    <- Bottom border (styled)
-1   Status bar (shared)        <- Navigation hints
```

## Visual Hierarchy

1. **Border style** - Immediately visible, frames each option
2. **Color accent** - Large colored block/bar draws attention
3. **Label** - Clear "OPTION A" / "OPTION B" text
4. **Details** - Configuration info (split ratio, iteration count)

## Color Usage

**Per-panel accent color:**
- Applied to: Border lines, title text, color sample block
- Large visible area: 10-15 character wide color bar
- Consistent throughout panel

**Example:**
```
╭───────────────────╮  <- Border in accent color (e.g., cyan)
│   OPTION A        │  <- Title in accent color
│                   │
│   ██████████      │  <- Color sample (filled block)
│   RGB(64,191,191) │  <- Color value display
│   Split: 50/50    │  <- Config details
╰───────────────────╯  <- Border in accent color
```

## Rendering Constraints

**Minimum readable width:** 20 characters per panel
- Allows for border (2 chars) + content (18 chars)
- Text must wrap/truncate beyond this

**Height constraints:**
- Minimum 8 lines for basic display
- More lines available = more info/padding
- Always reserve bottom line for status bar

**Unicode support:**
- Use validated box-drawing characters
- Use block elements (█, ▓, ▒, ░) for color samples
- ASCII fallback if needed (use - | + for borders)

## Dynamic Adaptation

**Terminal width handling:**
```
< 60 cols:  Vertical stack (top/bottom instead of side-by-side)
60-80 cols: Standard side-by-side
> 80 cols:  Wider panels with more content space
```

**Terminal height handling:**
```
< 10 lines: Minimal mode (border + color + label only)
10-20 lines: Standard mode
> 20 lines: Extended mode (more details, padding)
```

## Visual Distinctness

**Immediately perceivable differences:**
1. **Border style** - Different line weights/characters
2. **Color** - Different hue families (at least 30° apart)
3. **Width** - Asymmetric panel sizes (when split ≠ 0.5)

**Glanceable comparison:**
- User should see difference in <1 second
- No need to read text to spot variations
- Visual elements (color, borders, proportions) tell the story

## Implementation Notes

**Rendering order:**
1. Clear screen / move to alternate buffer
2. Calculate panel dimensions based on terminal size + split ratio
3. Render left panel (border, content, color sample)
4. Render right panel (border, content, color sample)
5. Render status bar (navigation hints)
6. Hide cursor

**Update strategy:**
- Full redraw on each choice (not incremental)
- Use alternate screen buffer (preserve user's terminal state)
- Restore original screen on exit

**Performance:**
- Pre-calculate all positions before rendering
- Batch ANSI escape sequences
- Single write for entire frame (minimize flicker)

# Static Sequence Refactor Plan

## Guardrails
- **HTML-first flow** — Encode both sequences directly in `public/index.html`. Each checkpoint gets its own markup (copy, media source, captions) so JavaScript never fabricates DOM.
- **CSS for presentation** — Any visual change (layout, transitions, colors) belongs in CSS. JavaScript should only toggle class names or custom properties already defined in the stylesheet.
- **Lean `main.js`** — Cap the script at ~200 lines. No ternaries; rely on straightforward `if`/`else` blocks. Keep logic focused on progression and event wiring.
- **Quiet logging** — Only emit `console.error` on real failures. Avoid status banners, success toasts, or speculative warnings.

## Execution Steps
1. **Inline the sequences**  
   - Replace references to `sequence.json` and `checkpoint-metadata.json` with two static `<section class="sequence">` blocks.  
   - Include all textual content, asset paths, and alt text directly in the HTML.
2. **Shift styling to CSS**  
   - Move inline styles and JS-driven styling into dedicated classes or custom properties.  
   - Ensure animations/transitions can be triggered with simple class toggles.
3. **Trim `public/main.js`**  
   - Remove fetch/merge logic and template cloning.  
   - Keep only the timeline controller, DOM lookups, and simple helpers; verify file length stays near 200 lines.
4. **Simplify error handling**  
   - Delete status banner plumbing.  
   - Guard critical steps (missing elements, failed media play) with plain `if` checks and `console.error` calls.
5. **Verify server setup**  
   - Confirm `server.js` serves the updated static HTML/CSS/JS without expecting JSON routes.

## Follow-up Ideas
- Revisit accessibility once the static markup is locked.  
- Document the sequence structure with comments inside the HTML for future editors.  
- Consider splitting CSS into thematic sections if utility class count grows.


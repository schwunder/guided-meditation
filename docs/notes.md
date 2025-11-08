- **Static sequences** — The flow is now baked into `public/index.html`. Two `<section class="sequence">` blocks cover the full experience (meditation room → things change → kitchen, then kitchen → things change → final checkpoint). No JSON fetches or template cloning remain.
- **Lean controller** — Keep `public/main.js` at ~200 lines. It should only collect DOM nodes, orchestrate progression, and toggle CSS classes/states. Avoid ternaries; explicit `if` blocks improve readability when we revisit this code.
- **CSS-first styling** — Move all inline styles and JS-driven styling into CSS. Extend utility classes when necessary; prefer custom properties for timing and palette tweaks.
- **Minimal logging** — We assume local, single-dev usage. Only call `console.error` when something definitively fails (element missing, media load error). Skip success banners or verbose diagnostics.
- **Server expectations** — `server.js` just serves the static HTML/CSS/JS and media assets. No dynamic endpoints, no metadata JSON.
- **Follow-up ideas**
  - Review each checkpoint's markup for accessibility once the HTML is finalized.
  - Audit animations in CSS to ensure they cover both sequences without JS hooks.
  - Consider extracting any repeated DOM lookups into helper functions if the controller starts to inch past the 200 line ceiling.


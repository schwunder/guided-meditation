# Refactor Practices

- Flow stays declarative: `runSequence` steps through the sequence, `presentSequenceItem` is the sole presenter.
- CSS owns dwell + fade timing via custom properties; JS just reads `--checkpoint-hold-ms` / `--transition-duration-fade`.
- Keep stage swaps in one place (`activateStage`) so fade removal + state reset never spread out.
- Cache DOM elements with `ensureMediaEntry` to avoid rebuffering, but always `resetMedia` before activation.
- Stage removal waits on the CSS fade duration so JS and transitions never drift apart.
- Element reuse beats recreation for seamless transitions—only drop reuse if artifacts return.
- Prefer CSS sizing limits (viewport ratios) over JS resize listeners unless content truly needs script control.


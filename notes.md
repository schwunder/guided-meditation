Refactor checkpoint flow:
- keep orchestration in one timeline controller and delete bespoke helpers
- push sizing and layout concerns to CSS variables/animations
- log candidates for deletion when they no longer serve the current sequence

Audit findings:
- previous `playCheckpointItem`/`playTransitionItem` duplication has been replaced by `presentSequenceItem`
- runtime resize wiring replaced by CSS-driven sizing; verify no stray listeners remain
- `SEQUENCE_HANDLERS` map removed; stage manager now handles all media types

Current technical model:
- **Asset loader** (`ensureMediaEntry`) owns preload and caching, surfacing load errors promptly
- **Stage manager** (`buildStage`, `activateStage`, `scheduleStageRemoval`) swaps DOM layers and mirrors CSS timing with a fallback timeout
- **Sequence controller** (`runSequence`, `waitForStage`) reads `MEDITATION_SEQUENCE`, respecting CSS-derived holds and video playback before advancing

Open follow-ups:
- Confirm caption strategy—should captions live in stage manager or a parallel presenter?
- Define extension points for interactive choices (pausing sequence, branching items)
- Document how new media variants (e.g., ambient audio) plug into the asset loader


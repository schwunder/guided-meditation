Refactor checkpoints:
- consolidate sequence helpers into single orchestrator flow
- move visual transitions and sizing cues into CSS
- track any dead code or helpers to prune later

Audit findings:
- `playCheckpointItem` and `playTransitionItem` duplicate container clearing; fold into one presenter
- `applyMediaSizing` + resize handlers can move to CSS-driven sizing, maybe drop runtime listeners
- `SEQUENCE_HANDLERS` map unnecessary after unifying play logic

Refactor notes:
- CSS now handles fade transitions via `.asset-stage` states
- JS orchestrator `runSequence` delegates to `presentSequenceItem`
- Checkpoint dwell pulled from CSS `--checkpoint-hold-ms`; JS just waits on stage
- `ensureMediaEntry` caches DOM nodes, `activateStage` owns swaps + fade cleanup
- Sequence reads like script: load media, activate stage, await video or CSS hold
- Stage removal tied to CSS `--transition-duration-fade` so fades stay in sync
- Remaining question: confirm future caption copy flows through same stage layer


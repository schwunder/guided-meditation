# Outstanding Fixes
| Issue | Observed · Impact · Fix |
| --- | --- |
| Skipped asset telemetry | Observed: `timeline()` records skipped media but only logs to the console; Impact: production incidents go undetected; Fix: forward skipped asset metadata to a reporting endpoint or persist to local diagnostics for later upload. |
| Coarse preload feedback | Observed: the status store publishes a generic “Loading scenes…” message; Impact: long video fetches leave users unsure whether progress is happening; Fix: emit per-item progress events or display a determinate indicator tied to resolved media entries. |
| Choice interactivity backlog | Observed: choices render visually but remain informational only; Impact: users may expect branching but nothing happens; Fix: design interaction hooks that pause `timeline()` and route based on choice selection (or clarify copy until behavior ships). |

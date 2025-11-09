# Outstanding Fixes
| Issue | Observed · Impact · Fix |
| --- | --- |
| Skipped asset telemetry | Observed: media preloading errors only log to console via `console.error`; Impact: production incidents go undetected; Fix: forward failed asset metadata to a reporting endpoint or persist to local diagnostics for later analysis. |
| Coarse preload feedback | Observed: no visual feedback during media preload; Impact: long video fetches leave users on blank page unsure if app is loading; Fix: add progress indicator showing X/Y assets loaded, or per-asset progress events. |
| Path state visualization | Observed: branching choices work but users can't see which paths they've taken; Impact: users may forget their choices through 8 scenes; Fix: add visual breadcrumb or summary showing path taken (e.g., "left → right → left"). |


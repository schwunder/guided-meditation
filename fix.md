# Outstanding Fixes
| Issue | Observed · Impact · Fix |
| --- | --- |
| Missing alt text for media | Observed: `ensureMediaEntry` builds `<img>` Impact: screen readers announce “image” without context, making choices inaccessible; Fix: load metadata, map filenames to `title`/`description`, and feed the string into `buildStage` so every image receives `alt`. |
| Observed: `server.js` only serves `/`, `/main.js`, and `/assets/*` Impact: hydrating captions or alt text from the JSON fails outside the build pipeline; Fix: add a passthrough (or generic static-file fallback) so browsers can fetch supporting JSON with the assets. |
| Silent preload failures | Observed: `preloadSequenceAssets()` rejects when an asset is missing, while `init()` awaits it without try/catch, yielding an uncaught rejection and blank screen; Impact: one missing media file halts the experience with no user-friendly feedback; Fix: wrap initialization in error handling that reports the failure in the UI and optionally continues with remaining assets. |

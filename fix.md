# Caption Rendering Bug

## Observed behaviour
- Captions appear inside the media thumbnails instead of sitting underneath each image. In `public/index.html`, `.media-wrapper` is an inline-block that only wraps the `<img>/<video>` element, so captions get layered on top by the absolutely positioned `.caption-container`.
- Captions only surface after the second checkpoint: the sequence logic updates `#caption-container` but the container animates in/out per stage and ends up hidden for the first checkpoint and the transitions, so videos play without captions.
- Caption text lacks the intended fill styles, making it blend with the image content.
- Image selections reshuffle on every reload, so the caption/image associations change randomly.

## Desired outcome
- Update the stage layout generated in `public/main.js` so each stage wraps media and caption inside a dedicated container (e.g. `<figure>`), enabling vertical stacking.
- Ensure the caption controller logic keeps the caption container visible for all sequence items (transitions and checkpoints alike) instead of hiding it between stages; if needed, co-locate captions inside the stage wrapper so they transition together with the media.
- Adjust `.media-wrapper` CSS in `public/index.html` to use a column flex layout with `align-items: center` and add spacing so the caption block renders below the media instead of overlaying it.
- Restore the missing caption text styles (color, stroke/fill if required) to ensure legibility against backgrounds.
- Stabilize image ordering—either remove any shuffle logic around `MEDITATION_SEQUENCE` or persist a deterministic seed—so captions stay paired with the same media across reloads.

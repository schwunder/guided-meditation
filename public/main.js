const DATA_ENDPOINTS = Object.freeze({
  sequence: '/sequence.json',
  metadata: '/checkpoint-metadata.json',
});

const fetchJson = async (path) => {
  const response = await fetch(path, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to load "${path}" (${response.status} ${response.statusText})`
    );
  }

  return response.json();
};

const filenameFromAsset = (assetPath) => {
  if (typeof assetPath !== 'string') {
    return '';
  }
  const parts = assetPath.split('/');
  return parts[parts.length - 1] ?? assetPath;
};

const createMetadataLookup = (entries) => {
  const map = new Map();
  if (!Array.isArray(entries)) {
    return map;
  }

  for (const entry of entries) {
    if (!entry || typeof entry.filename !== 'string') continue;
    map.set(entry.filename, entry);
  }

  return map;
};

const enrichSequence = (sequence, metadataMap) =>
  sequence.map((item) => {
    const filename = filenameFromAsset(item.asset);
    const metadata = metadataMap.get(filename) ?? null;
    return {
      ...item,
      metadata,
    };
  });

const friendlyLabelForItem = (item) => {
  const title = item?.metadata?.title;
  if (title && title.trim()) {
    return title.trim();
  }

  const caption = item?.caption;
  if (caption && caption.trim()) {
    return caption.trim();
  }

  const filename = filenameFromAsset(item?.asset ?? '');
  return filename || 'Unknown asset';
};

const resolveAltTextForItem = (item) => {
  const description = item?.metadata?.description;
  if (description && description.trim()) {
    return description.trim();
  }

  const title = item?.metadata?.title;
  if (title && title.trim()) {
    return title.trim();
  }

  const caption = item?.caption;
  if (caption && caption.trim()) {
    return caption.trim();
  }

  return friendlyLabelForItem(item);
};

const createStatusStore = () => {
  const listeners = new Set();
  let state = { type: 'clear' };

  return {
    subscribe(listener) {
      if (typeof listener !== 'function') {
        return () => {};
      }

      listeners.add(listener);
      listener(state);

      return () => {
        listeners.delete(listener);
      };
    },
    publish(nextState) {
      state = nextState;
      listeners.forEach((listener) => listener(state));
    },
    clear() {
      state = { type: 'clear' };
      listeners.forEach((listener) => listener(state));
    },
    getState() {
      return state;
    },
  };
};

const attachStatusBanner = (element, store) => {
  if (!element || !store) {
    return () => {};
  }

  element.hidden = true;

  return store.subscribe((event) => {
    if (!event || event.type === 'clear') {
      element.textContent = '';
      element.classList.remove('is-visible');
      element.hidden = true;
      return;
    }

    if (typeof event.message === 'string') {
      element.textContent = event.message;
    } else {
      element.textContent = '';
    }

    element.hidden = false;
    element.classList.add('is-visible');
  });
};

const buildAssetUrl = (filename) =>
  `/assets/${String(filename)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

const inferMediaKind = (item) => {
  if (item?.type === 'transition') {
    return 'video';
  }

  const asset = String(item?.asset ?? '').toLowerCase();
  if (asset.endsWith('.mp4') || asset.endsWith('.webm') || asset.endsWith('.mov')) {
    return 'video';
  }

  return 'image';
};

const createMediaFactory = (resolveAltText) => {
  const cache = new Map();

  const ensure = (item) => {
    if (!item || !item.asset) {
      throw new Error('Cannot ensure media for an item without an asset path.');
    }

    if (cache.has(item.asset)) {
      const cached = cache.get(item.asset);
      if (cached.type === 'image') {
        cached.element.alt = resolveAltText(item);
      }
      return cached;
    }

    const kind = inferMediaKind(item);
    const url = buildAssetUrl(item.asset);
    let entry;

    if (kind === 'video') {
      const video = document.createElement('video');
      video.muted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.src = url;

      entry = {
        type: 'video',
        element: video,
        error: null,
        reset() {
          video.pause();
          video.currentTime = 0;
        },
      };

      entry.ready = new Promise((resolve, reject) => {
        const handleReady = () => {
          cleanup();
          resolve(video);
        };

        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to preload video asset "${item.asset}"`));
        };

        const cleanup = () => {
          video.removeEventListener('canplaythrough', handleReady);
          video.removeEventListener('error', handleError);
        };

        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve(video);
          return;
        }

        video.addEventListener('canplaythrough', handleReady, { once: true });
        video.addEventListener('error', handleError, { once: true });
        video.load();
      })
        .then((value) => {
          entry.error = null;
          return value;
        })
        .catch((error) => {
          entry.error = error;
          throw error;
        });
    } else {
      const image = new Image();
      image.decoding = 'async';
      image.alt = resolveAltText(item);
      image.src = url;

      entry = {
        type: 'image',
        element: image,
        error: null,
        reset() {},
      };

      entry.ready = new Promise((resolve, reject) => {
        const handleLoad = () => {
          cleanup();
          resolve(image);
        };

        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to preload image asset "${item.asset}"`));
        };

        const cleanup = () => {
          image.removeEventListener('load', handleLoad);
          image.removeEventListener('error', handleError);
        };

        if (image.complete && image.naturalWidth) {
          resolve(image);
          return;
        }

        image.addEventListener('load', handleLoad, { once: true });
        image.addEventListener('error', handleError, { once: true });
      })
        .then((value) => {
          entry.error = null;
          image.alt = resolveAltText(item);
          return value;
        })
        .catch((error) => {
          entry.error = error;
          throw error;
        });
    }

    cache.set(item.asset, entry);
    return entry;
  };

  return { ensure };
};

const msFromCss = (element, property) => {
  const raw = getComputedStyle(element).getPropertyValue(property).trim();
  if (!raw) return 0;
  if (raw.endsWith('ms')) return parseFloat(raw);
  if (raw.endsWith('s')) return parseFloat(raw) * 1000;
  const numeric = parseFloat(raw);
  return Number.isNaN(numeric) ? 0 : numeric;
};

const fadeDurationMs = () =>
  msFromCss(document.documentElement, '--transition-duration-fade');

const numericCssVariable = (property, fallback = 0) => {
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();

  if (!raw) {
    return fallback;
  }

  const numeric = parseFloat(raw);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const createHueController = () => {
  const root = document.documentElement;
  const baseHue = numericCssVariable('--accent-hue-base', 215);
  const shiftHue = numericCssVariable('--accent-hue-shift', baseHue);
  let checkpointCount = 0;
  let useShift = false;

  const applyHue = (value) => {
    root.style.setProperty('--accent-hue', `${value}`);
  };

  return {
    reset() {
      checkpointCount = 0;
      useShift = false;
      applyHue(baseHue);
    },
    willPresent(item) {
      applyHue(useShift ? shiftHue : baseHue);

      if (item.type !== 'checkpoint') {
        return;
      }

      checkpointCount += 1;
      if (checkpointCount === 2) {
        useShift = true;
      }
    },
  };
};

const holdForCheckpoint = (stage) => {
  const duration = msFromCss(stage, '--checkpoint-hold-ms');
  if (!duration) return Promise.resolve();

  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

const playVideo = (video) =>
  new Promise((resolve) => {
    const finish = () => {
      video.pause();
      video.removeEventListener('ended', finish);
      resolve();
    };

    video.addEventListener('ended', finish, { once: true });
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(finish);
    }
  });

const waitForStage = (stage, entry) =>
  entry.type === 'video' ? playVideo(entry.element) : holdForCheckpoint(stage);

const createStageComposer = (template) => {
  if (!template || !(template instanceof HTMLTemplateElement)) {
    throw new Error('Missing stage template element.');
  }

  return {
    render(item, entry) {
      const fragment = template.content.cloneNode(true);
      const stage = fragment.querySelector('[data-stage]');
      if (!stage) {
        throw new Error('Stage template missing `[data-stage]` root element.');
      }
      stage.dataset.type = item.type ?? 'unknown';

      const figure = stage.querySelector('[data-stage-figure]');
      if (figure) {
        figure.dataset.type = item.type ?? 'unknown';
      }

      const mediaSlot = stage.querySelector('[data-media-slot]');
      if (!mediaSlot) {
        throw new Error('Stage template missing `[data-media-slot]` placeholder.');
      }
      mediaSlot.innerHTML = '';
      mediaSlot.appendChild(entry.element);

      const captionContainer = stage.querySelector('[data-caption]');
      if (captionContainer) {
        captionContainer.dataset.type = item.type ?? 'unknown';
      }

      const captionText = stage.querySelector('[data-caption-text]');
      if (captionText) {
        captionText.textContent = item.caption ?? '';
      }

      const choicesList = stage.querySelector('[data-choice-list]');
      if (choicesList) {
        choicesList.innerHTML = '';

        const choices = Array.isArray(item.choices)
          ? item.choices.filter(
              (choice) => typeof choice === 'string' && choice.trim()
            )
          : [];

        if (choices.length) {
          for (const choice of choices) {
            const li = document.createElement('li');
            li.textContent = choice;
            choicesList.appendChild(li);
          }
          choicesList.hidden = false;
          choicesList.setAttribute('aria-hidden', 'false');
          if (captionContainer) {
            captionContainer.classList.add('has-choices');
          }
        } else {
          choicesList.hidden = true;
          choicesList.setAttribute('aria-hidden', 'true');
          if (captionContainer) {
            captionContainer.classList.remove('has-choices');
          }
        }
      }

      return stage;
    },
  };
};

const createStageManager = ({ container }) => {
  if (!container) {
    throw new Error('Missing stage container element.');
  }

  let activeStage = null;

  const scheduleRemoval = (stage) => {
    const duration = fadeDurationMs();
    if (!duration) {
      stage.remove();
      return;
    }

    const fallback = setTimeout(() => {
      stage.remove();
    }, duration);

    stage.addEventListener(
      'transitionend',
      () => {
        clearTimeout(fallback);
        stage.remove();
      },
      { once: true }
    );
  };

  return {
    activate(stage) {
      if (activeStage) {
        activeStage.classList.remove('is-active');
        scheduleRemoval(activeStage);
      }

      container.appendChild(stage);
      requestAnimationFrame(() => {
        stage.classList.add('is-active');
      });

      activeStage = stage;
    },
  };
};

async function* timeline(sequence, { mediaFactory, hueController, skipped }) {
  for (const item of sequence) {
    const entry = mediaFactory.ensure(item);

    try {
      await entry.ready;
    } catch (error) {
      entry.error = error;
    }

    if (entry.error) {
      skipped.push({ item, error: entry.error });
      continue;
    }

    entry.reset();

    if (hueController) {
      hueController.willPresent(item);
    }

    yield { item, entry };
  }
}

const loadSequenceData = async () => {
  const sequencePromise = fetchJson(DATA_ENDPOINTS.sequence);
  const metadataPromise = fetchJson(DATA_ENDPOINTS.metadata).catch((error) => {
    console.warn(
      'Unable to load checkpoint metadata JSON; continuing without it.',
      error
    );
    return [];
  });

  const [sequenceRaw, metadataRaw] = await Promise.all([
    sequencePromise,
    metadataPromise,
  ]);

  if (!Array.isArray(sequenceRaw)) {
    throw new Error('Sequence JSON must be an array.');
  }

  const metadataMap = createMetadataLookup(
    Array.isArray(metadataRaw) ? metadataRaw : []
  );
  const sequence = enrichSequence(sequenceRaw, metadataMap);

  return { sequence };
};

const initTimeline = async ({ sequence, container, template }) => {
  const mediaFactory = createMediaFactory(resolveAltTextForItem);
  const stageComposer = createStageComposer(template);
  const stageManager = createStageManager({ container });
  const hueController = createHueController();
  hueController.reset();

  const skipped = [];
  let presentedCount = 0;

  for await (const step of timeline(sequence, {
    mediaFactory,
    hueController,
    skipped,
  })) {
    const stage = stageComposer.render(step.item, step.entry);
    stageManager.activate(stage);
    await waitForStage(stage, step.entry);
    presentedCount += 1;
  }

  return { presentedCount, skipped };
};

const bootstrap = async () => {
  const statusStore = createStatusStore();
  const statusElement = document.getElementById('status-banner');
  attachStatusBanner(statusElement, statusStore);

  try {
    const container = document.getElementById('asset-container');
    if (!container) {
      throw new Error('Missing required element "#asset-container"');
    }

    const template = document.getElementById('stage');
    if (!template) {
      throw new Error('Missing required template "#stage"');
    }

    statusStore.publish({
      type: 'info',
      message: 'Preparing your meditation experience…',
    });

    const { sequence } = await loadSequenceData();

    if (!sequence.length) {
      statusStore.publish({
        type: 'error',
        message: 'No scenes are configured for playback.',
      });
      return;
    }

    statusStore.publish({
      type: 'info',
      message: 'Loading meditation scenes…',
    });

    const { presentedCount, skipped } = await initTimeline({
      sequence,
      container,
      template,
    });

    if (presentedCount === 0) {
      const names = skipped.length
        ? ` (${Array.from(
            new Set(skipped.map(({ item }) => friendlyLabelForItem(item)))
          ).join(', ')})`
        : '';
      statusStore.publish({
        type: 'error',
        message: `No media could be displayed. Please check your connection and try again.${names}`,
      });
      return;
    }

    if (skipped.length) {
      const names = Array.from(
        new Set(skipped.map(({ item }) => friendlyLabelForItem(item)))
      );
      statusStore.publish({
        type: 'warn',
        message: `Some scenes could not be loaded and were skipped: ${names.join(
          ', '
        )}.`,
      });
    } else {
      statusStore.clear();
    }
  } catch (error) {
    console.error(error);
    statusStore.publish({
      type: 'error',
      message:
        'We ran into a problem loading the meditation experience. Please refresh to try again.',
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

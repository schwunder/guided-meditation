const MEDITATION_SEQUENCE = [
  {
    type: 'checkpoint',
    asset: 'checkpoints/1-image-1.png',
    caption: 'Meditation room',
  },
  {
    type: 'transition',
    asset: 'transitions/1-video-1.mp4',
    caption: 'Things change',
  },
  {
    type: 'checkpoint',
    asset: 'checkpoints/1-image-8.jpg',
    caption: 'Communal meditation',
    choices: [
      'Choice A: Go to the kitchen.',
      'Choice B: Go to the bathroom.',
    ],
  },
  {
    type: 'transition',
    asset: 'transitions/1-video-1.mp4',
    caption: 'Things change',
  },
  {
    type: 'checkpoint',
    asset: 'checkpoints/1-image-9.jpg',
    caption: 'I do',
    choices: [
      'Choice A: Read in the backyard.',
      'Choice B: Go to a workshop.',
    ],
  },
  {
    type: 'transition',
    asset: 'transitions/1-video-1.mp4',
    caption: 'Things change',
  },
  {
    type: 'checkpoint',
    asset: 'checkpoints/1-image-10.jpg',
    caption: 'I love — Have a chat with one of the meditation teachers.',
    choices: [
      'Choice A: Join the chaplain study hall.',
      'Choice B: Continue the conversation.',
    ],
  },
  {
    type: 'transition',
    asset: 'transitions/1-video-1.mp4',
    caption: 'Things change',
  },
  {
    type: 'checkpoint',
    asset: 'checkpoints/1-image-12.jpg',
    caption: 'I talk',
    choices: [
      'Choice A: Discuss meditation apps at Casa Chola with Tessa over steak.',
      'Choice B: Go on a hike with Consciousness on the eightfold path.',
    ],
  },
];

const assetCache = new Map();

const buildAssetUrl = (filename) =>
  `/assets/${filename.split('/').map(encodeURIComponent).join('/')}`;

const ensureMediaEntry = (item) => {
  if (assetCache.has(item.asset)) {
    return assetCache.get(item.asset);
  }

  const mediaType = item.type === 'transition' ? 'video' : 'image';
  const url = buildAssetUrl(item.asset);

  if (mediaType === 'video') {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;

    const ready = new Promise((resolve, reject) => {
      const handleReady = () => {
        video.removeEventListener('canplaythrough', handleReady);
        video.removeEventListener('error', handleError);
        resolve(video);
      };

      const handleError = () => {
        video.removeEventListener('canplaythrough', handleReady);
        video.removeEventListener('error', handleError);
        reject(new Error(`Failed to preload video asset "${item.asset}"`));
      };

      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve(video);
        return;
      }

      video.addEventListener('canplaythrough', handleReady, { once: true });
      video.addEventListener('error', handleError, { once: true });
      video.load();
    });

    const entry = { mediaType, element: video, ready };
    assetCache.set(item.asset, entry);
    return entry;
  }

  const image = new Image();
  image.decoding = 'async';
  image.src = url;

  const ready = new Promise((resolve, reject) => {
    const handleLoad = () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      resolve(image);
    };

    const handleError = () => {
      image.removeEventListener('load', handleLoad);
      image.removeEventListener('error', handleError);
      reject(new Error(`Failed to preload image asset "${item.asset}"`));
    };

    if (image.complete && image.naturalWidth) {
      resolve(image);
      return;
    }

    image.addEventListener('load', handleLoad, { once: true });
    image.addEventListener('error', handleError, { once: true });
  });

  const entry = { mediaType, element: image, ready };
  assetCache.set(item.asset, entry);
  return entry;
};

const preloadSequenceAssets = () =>
  Promise.all(MEDITATION_SEQUENCE.map((item) => ensureMediaEntry(item).ready));

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

const createCaptionController = () => {
  const container = document.getElementById('caption-container');
  if (!container) {
    return null;
  }

  const text = container.querySelector('[data-role="caption-text"]');
  const choices = container.querySelector('[data-role="caption-choices"]');

  if (!text || !choices) {
    return null;
  }

  return {
    container,
    text,
    choices,
    pendingTimeoutId: null,
    pendingTransitionHandler: null,
  };
};

const setCaptionContent = (controller, item) => {
  const { container, text, choices } = controller;
  text.textContent = item.caption ?? '';
  container.dataset.type = item.type;

  while (choices.firstChild) {
    choices.removeChild(choices.firstChild);
  }

  const hasChoices = Array.isArray(item.choices) && item.choices.length > 0;
  if (hasChoices) {
    for (const choice of item.choices) {
      const li = document.createElement('li');
      li.textContent = choice;
      choices.appendChild(li);
    }
  }

  container.classList.toggle('has-choices', hasChoices);
};

const updateCaption = (controller, item) => {
  if (!controller) {
    return;
  }

  const { container } = controller;

  if (controller.pendingTimeoutId !== null) {
    clearTimeout(controller.pendingTimeoutId);
    controller.pendingTimeoutId = null;
  }

  if (controller.pendingTransitionHandler) {
    container.removeEventListener('transitionend', controller.pendingTransitionHandler);
    controller.pendingTransitionHandler = null;
  }

  const apply = () => {
    setCaptionContent(controller, item);
    requestAnimationFrame(() => {
      container.classList.add('is-active');
    });
  };

  if (!container.classList.contains('is-active')) {
    apply();
    return;
  }

  const handler = (event) => {
    if (event.target !== container || event.propertyName !== 'opacity') {
      return;
    }

    container.removeEventListener('transitionend', handler);
    controller.pendingTransitionHandler = null;

    if (controller.pendingTimeoutId !== null) {
      clearTimeout(controller.pendingTimeoutId);
      controller.pendingTimeoutId = null;
    }

    apply();
  };

  controller.pendingTransitionHandler = handler;
  container.addEventListener('transitionend', handler);

  const duration = fadeDurationMs();
  if (duration) {
    controller.pendingTimeoutId = setTimeout(() => {
      container.removeEventListener('transitionend', handler);
      controller.pendingTransitionHandler = null;
      controller.pendingTimeoutId = null;
      apply();
    }, duration);
  } else {
    apply();
  }

  container.classList.remove('is-active');
};

const buildStage = (item, media) => {
  const stage = document.createElement('div');
  stage.className = 'asset-stage';
  stage.dataset.type = item.type;

  const wrapper = document.createElement('div');
  wrapper.className = 'media-wrapper';
  wrapper.dataset.type = item.type;
  wrapper.appendChild(media);

  stage.appendChild(wrapper);
  return stage;
};

let activeStage = null;

const scheduleStageRemoval = (stage) => {
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

const activateStage = (container, stage) => {
  if (activeStage) {
    activeStage.classList.remove('is-active');
    scheduleStageRemoval(activeStage);
  }

  container.appendChild(stage);
  requestAnimationFrame(() => {
    stage.classList.add('is-active');
  });

  activeStage = stage;
};

const resetMedia = (entry) => {
  if (entry.mediaType === 'video') {
    entry.element.pause();
    entry.element.currentTime = 0;
  }
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
  entry.mediaType === 'video'
    ? playVideo(entry.element)
    : holdForCheckpoint(stage);

const presentSequenceItem = async (container, caption, item) => {
  const entry = ensureMediaEntry(item);
  await entry.ready;

  resetMedia(entry);

  updateCaption(caption, item);

  const stage = buildStage(item, entry.element);
  activateStage(container, stage);

  await waitForStage(stage, entry);
};

const runSequence = async (container, caption) => {
  for (const item of MEDITATION_SEQUENCE) {
    await presentSequenceItem(container, caption, item);
  }
};

const init = async () => {
  await preloadSequenceAssets();
  const container = document.getElementById('asset-container');
  if (!container) {
    throw new Error('Missing required element "#asset-container"');
  }

  const caption = createCaptionController();
  await runSequence(container, caption);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

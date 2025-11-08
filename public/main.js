const MEDITATION_SEQUENCE = [
  {
    type: 'checkpoint',
    asset: 'checkpoints/image-sunrise-meditation-room.png',
    caption: 'Meditation room',
  },
  {
    type: 'transition',
    asset: 'transitions/1-video-1.mp4',
    caption: 'Things change',
  },
  {
    type: 'checkpoint',
    asset: 'checkpoints/choice-communal-beach-circle.jpg',
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
    asset: 'checkpoints/choice-steakhouse-conversation.jpg',
    caption: 'I do',
    choices: [
      'Choice A: Read in the backyard.',
      'Choice B: Go to a workshop.',
    ],
  },
];

const MEDIA_METADATA = {
  'checkpoints/image-sunrise-meditation-room.png': {
    title: 'Sunrise Meditation Room',
    description:
      'Dawn light fills a tidy meditation room with four cushions arranged on the wooden floor and a digital clock glowing 6:00.',
  },
  'checkpoints/image-teachers-portrait.jpg': {
    title: 'Meditation Teachers Portrait',
    description:
      'Two meditation teachers sit cross-legged on a sofa, framed by a window of swirling pastel light.',
  },
  'checkpoints/image-breath-practice-circle.png': {
    title: 'Breath Practice Circle',
    description:
      'A cozy practice room where several people meditate together, guiding their breath with alternate-nostril hand mudras.',
  },
  'checkpoints/choice-chaplain-study-hall.jpg': {
    title: 'Chaplain Study Hall',
    description:
      'Haloed practitioners meditate in rows before a golden hilltop chapel, bathed in soft morning light.',
  },
  'checkpoints/image-starry-night-vigil.jpg': {
    title: 'Starry Night Vigil',
    description:
      'A guide stands before a sea of reclining seekers beneath a night sky alive with swirling stars and candlelight.',
  },
  'checkpoints/image-sun-spiral-overlook.jpg': {
    title: 'Sun Spiral Overlook',
    description:
      'Hundreds meditate on a hillside overlooking a lakeside town while a fiery spiral sunset blooms overhead.',
  },
  'checkpoints/image-rooftop-meditators.jpg': {
    title: 'Rooftop Meditators',
    description:
      'Meditators sit on rooftops across a twilight village as a luminous spiral hovers in the deep-blue sky.',
  },
  'checkpoints/image-lakeside-overlook.jpg': {
    title: 'Lakeside Overlook',
    description:
      'A sweeping aerial view of a lakeside town, winding shoreline roads, and boats tracing gentle patterns in the water.',
  },
  'checkpoints/choice-communal-beach-circle.jpg': {
    title: 'Communal Beach Circle',
    description:
      'Friends sit shoulder to shoulder on a sandy beach, laughing together as the forest rises behind them.',
  },
  'checkpoints/choice-steakhouse-conversation.jpg': {
    title: 'Steakhouse Conversation',
    description:
      'A smiling friend points across a candlelit table set with steak, red wine, and notebooks ready for a lively chat.',
  },
  'checkpoints/choice-kitchen-welcome.jpg': {
    title: 'Kitchen Welcome',
    description:
      'A cheerful host in a patterned coat offers a warm bowl outside a rustic kitchen cabin in the cool morning air.',
  },
  'checkpoints/choice-workshop-presentation.jpg': {
    title: 'Workshop Presentation',
    description:
      'A presenter introduces the Meditation Research Program to an engaged audience in a vivid, lantern-lit hall.',
  },
  'checkpoints/choice-backyard-reading.jpg': {
    title: 'Backyard Reading',
    description:
      'Two retreatants unwind on picnic blankets, one journaling and the other reading beneath a sun-dappled canopy.',
  },
  'checkpoints/choice-teacher-conversation.jpg': {
    title: 'Teacher Conversation',
    description:
      'Two teachers share an easy smile beside a warmly lit window, ready to continue a heartfelt discussion.',
  },
};

const getMetadataForItem = (item) => MEDIA_METADATA[item.asset];

const altTextForItem = (item) => {
  const metadata = getMetadataForItem(item);
  if (metadata) {
    if (metadata.description && metadata.description.trim()) {
      return metadata.description;
    }
    if (metadata.title && metadata.title.trim()) {
      return metadata.title;
    }
  }

  return item.caption ?? '';
};

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

    const entry = { mediaType, element: video, error: null };

    entry.ready = new Promise((resolve, reject) => {
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
    })
      .then((value) => {
        entry.error = null;
        return value;
      })
      .catch((error) => {
        entry.error = error;
        throw error;
      });

    assetCache.set(item.asset, entry);
    return entry;
  }

  const image = new Image();
  image.decoding = 'async';
  image.alt = altTextForItem(item);
  image.src = url;

  const entry = { mediaType, element: image, error: null };

  entry.ready = new Promise((resolve, reject) => {
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
  })
    .then((value) => {
      entry.error = null;
      return value;
    })
    .catch((error) => {
      entry.error = error;
      throw error;
    });

  assetCache.set(item.asset, entry);
  return entry;
};

const preloadSequenceAssets = async () => {
  const results = await Promise.allSettled(
    MEDITATION_SEQUENCE.map((item) => ensureMediaEntry(item).ready)
  );

  const failures = [];

  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      const item = MEDITATION_SEQUENCE[index];
      const entry = assetCache.get(item.asset);
      if (entry) {
        entry.error = result.reason;
      }
      failures.push({ item, error: result.reason });
    }
  });

  return { failures };
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

const buildCaptionBlock = (item) => {
  const container = document.createElement('figcaption');
  container.className = 'caption-container';
  container.dataset.type = item.type;

  const text = document.createElement('p');
  text.className = 'caption-text';
  text.textContent = item.caption ?? '';
  container.appendChild(text);

  const hasChoices = Array.isArray(item.choices) && item.choices.length > 0;
  if (hasChoices) {
    const list = document.createElement('ul');
    list.className = 'caption-choices';

    for (const choice of item.choices) {
      const li = document.createElement('li');
      li.textContent = choice;
      list.appendChild(li);
    }

    container.appendChild(list);
    container.classList.add('has-choices');
  }

  return container;
};

const buildStage = (item, media) => {
  const stage = document.createElement('div');
  stage.className = 'asset-stage';
  stage.dataset.type = item.type;

  const wrapper = document.createElement('figure');
  wrapper.className = 'media-wrapper';
  wrapper.dataset.type = item.type;
  wrapper.appendChild(media);

  const caption = buildCaptionBlock(item);
  wrapper.appendChild(caption);

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

const presentSequenceItem = async (container, item, hueController) => {
  const entry = ensureMediaEntry(item);
  if (entry.error) {
    console.warn(
      `Skipping asset "${item.asset}" because it failed to preload earlier.`,
      entry.error
    );
    return false;
  }

  try {
    await entry.ready;
  } catch (error) {
    console.warn(`Skipping asset "${item.asset}" due to preload failure.`, error);
    return false;
  }

  if (hueController) {
    hueController.willPresent(item);
  }

  resetMedia(entry);

  const stage = buildStage(item, entry.element);
  activateStage(container, stage);

  await waitForStage(stage, entry);
  return true;
};

const createStatusController = () => {
  const element = document.getElementById('status-banner');
  if (!element) {
    return {
      show() {},
      clear() {},
    };
  }

  return {
    show(message) {
      element.textContent = message;
      element.hidden = false;
      element.classList.add('is-visible');
    },
    clear() {
      element.textContent = '';
      element.classList.remove('is-visible');
      element.hidden = true;
    },
  };
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

const runSequence = async (container) => {
  const hueController = createHueController();
  hueController.reset();

  let presentedCount = 0;

  for (const item of MEDITATION_SEQUENCE) {
    const displayed = await presentSequenceItem(container, item, hueController);
    if (displayed) {
      presentedCount += 1;
    }
  }

  return presentedCount;
};

const init = async () => {
  const status = createStatusController();

  try {
    const { failures } = await preloadSequenceAssets();

    const container = document.getElementById('asset-container');
    if (!container) {
      throw new Error('Missing required element "#asset-container"');
    }

    if (failures.length) {
      const failedList = failures
        .map(({ item }) => item.asset.split('/').pop() ?? item.asset)
        .join(', ');
      status.show(
        `Some scenes failed to load and will be skipped: ${failedList}.`
      );
    } else {
      status.clear();
    }

    const presentedCount = await runSequence(container);

    if (!failures.length && presentedCount > 0) {
      status.clear();
    }

    if (presentedCount === 0) {
      status.show(
        'No media could be displayed. Please check your connection and try again.'
      );
    }
  } catch (error) {
    console.error(error);
    status.show(
      'We ran into a problem loading the meditation experience. Please refresh to try again.'
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

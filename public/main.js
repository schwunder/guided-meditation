const MEDITATION_SEQUENCE = [
  { type: 'checkpoint', asset: 'checkpoints/1-image-1.png' },
  { type: 'transition', asset: 'transitions/1-video-1.mp4' },
  { type: 'checkpoint', asset: 'checkpoints/1-image-2.png' },
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

const presentSequenceItem = async (container, item) => {
  const entry = ensureMediaEntry(item);
  await entry.ready;

  resetMedia(entry);

  const stage = buildStage(item, entry.element);
  activateStage(container, stage);

  await waitForStage(stage, entry);
};

const runSequence = async (container) => {
  for (const item of MEDITATION_SEQUENCE) {
    await presentSequenceItem(container, item);
  }
};

const init = async () => {
  await preloadSequenceAssets();
  const container = document.getElementById('asset-container');
  await runSequence(container);
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

const MEDITATION_SEQUENCE = [
  { type: 'checkpoint', asset: 'checkpoints/1-image-1.png', duration: 3000 },
  { type: 'transition', asset: 'transitions/1-video-1.mp4' },
  { type: 'checkpoint', asset: 'checkpoints/1-image-2.png', duration: 3000 },
];

const MEDIA_SIZING = { maxWidthRatio: 0.8, minPaddingRatio: 0.05 };
const MEDIA_TYPE_BY_SEQUENCE_ITEM = {
  checkpoint: 'image',
  transition: 'video'
};
const assetCache = new Map();


const buildAssetUrl = (filename) => `/assets/${filename.split('/').map(encodeURIComponent).join('/')}`;


const ensureAssetEntry = (assetPath, mediaType) => {
  if (assetCache.has(assetPath)) {
    return assetCache.get(assetPath);
  }

  const url = buildAssetUrl(assetPath);

  if (mediaType === 'video') {
    const video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;

    const ready = new Promise((resolve, reject) => {
      const cleanup = () => {
        video.removeEventListener('canplaythrough', onReady);
        video.removeEventListener('error', onError);
      };

      const onReady = () => {
        cleanup();
        resolve(video);
      };

      const onError = () => {
        cleanup();
        reject(new Error(`Failed to preload video asset "${assetPath}"`));
      };

      if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
        resolve(video);
        return;
      }

      video.addEventListener('canplaythrough', onReady, { once: true });
      video.addEventListener('error', onError, { once: true });
      video.load();
    });

    const entry = { mediaType, element: video, ready };
    assetCache.set(assetPath, entry);
    return entry;
  }

  const image = new Image();
  image.decoding = 'async';
  image.src = url;

  const ready = new Promise((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener('load', onLoad);
      image.removeEventListener('error', onError);
    };

    const onLoad = () => {
      cleanup();
      resolve(image);
    };

    const onError = () => {
      cleanup();
      reject(new Error(`Failed to preload image asset "${assetPath}"`));
    };

    if (image.complete && image.naturalWidth) {
      resolve(image);
      return;
    }

    image.addEventListener('load', onLoad, { once: true });
    image.addEventListener('error', onError, { once: true });
  });

  const entry = { mediaType, element: image, ready };
  assetCache.set(assetPath, entry);
  return entry;
};


const preloadSequenceAssets = async () => {
  const preloadPromises = MEDITATION_SEQUENCE.map((item) => {
    const mediaType = MEDIA_TYPE_BY_SEQUENCE_ITEM[item.type];
    const entry = ensureAssetEntry(item.asset, mediaType);
    return entry.ready.catch((error) => {
      console.error(`Failed to preload ${mediaType} asset "${item.asset}"`, error);
      throw error;
    });
  });

  await Promise.all(preloadPromises);
};

const calculateMediaSize = (mediaElement, viewportWidth, viewportHeight) => {
  const naturalWidth = mediaElement.videoWidth || 
                       mediaElement.naturalWidth || 
                       mediaElement.width;
  const naturalHeight = mediaElement.videoHeight || 
                        mediaElement.naturalHeight || 
                        mediaElement.height;
  if (!naturalWidth || !naturalHeight) return null;
  const maxWidth = viewportWidth * MEDIA_SIZING.maxWidthRatio;
  let scale = maxWidth / naturalWidth;
  let finalWidth = naturalWidth * scale;
  let finalHeight = naturalHeight * scale;
  const minPadding = viewportHeight * MEDIA_SIZING.minPaddingRatio;
  const maxHeight = viewportHeight - (minPadding * 2);
  if (finalHeight > maxHeight) {
    scale = maxHeight / naturalHeight;
    finalWidth = naturalWidth * scale;
    finalHeight = naturalHeight * scale;
  }
  return { width: finalWidth, height: finalHeight };
};


const resizeHandlers = new WeakMap();

const applyMediaSizing = (mediaElement) => {
  const size = calculateMediaSize(mediaElement, window.innerWidth, window.innerHeight);
  if (size) {
    mediaElement.style.width = `${size.width}px`;
    mediaElement.style.height = `${size.height}px`;
  }
};


const createMediaElement = (assetPath, mediaType) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'media-wrapper';
  const { element: media } = ensureAssetEntry(assetPath, mediaType);
  const handleResize = () => {
    applyMediaSizing(media);
  };
  if (mediaType === 'video') {
    media.muted = true;
    media.playsInline = true;
    media.preload = 'auto';
    media.pause();
    media.currentTime = 0;
  } else {
    media.decoding = 'async';
  }
  resizeHandlers.set(wrapper, handleResize);
  window.addEventListener('resize', handleResize);
  wrapper.appendChild(media);
  requestAnimationFrame(() => applyMediaSizing(media));
  return { wrapper, media };
};


const clearContainer = (container) => {
  container.querySelectorAll('.media-wrapper').forEach(wrapper => {
    const handler = resizeHandlers.get(wrapper);
    if (handler) {
      window.removeEventListener('resize', handler);
      resizeHandlers.delete(wrapper);
    }
  });
  container.innerHTML = '';
};


const playCheckpointItem = async (container, assetPath, duration) => {
  const { ready } = ensureAssetEntry(assetPath, 'image');
  await ready;
  return new Promise((resolve) => {
    clearContainer(container);
    const { wrapper } = createMediaElement(assetPath, 'image');
    container.appendChild(wrapper);
    setTimeout(resolve, duration);
  });
};


const playTransitionItem = async (container, assetPath) => {
  const { ready } = ensureAssetEntry(assetPath, 'video');
  await ready;
  return new Promise((resolve) => {
    clearContainer(container);
    const { wrapper, media: video } = createMediaElement(assetPath, 'video');
    container.appendChild(wrapper);
    video.addEventListener('ended', resolve, { once: true });
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch((error) => {
        console.warn('Transition video failed to autoplay', error);
        resolve();
      });
    }
  });
};


const SEQUENCE_HANDLERS = {
  checkpoint: playCheckpointItem,
  transition: playTransitionItem
};

const playSequence = async (container) => {
  clearContainer(container);
  for (const item of MEDITATION_SEQUENCE) {
    await SEQUENCE_HANDLERS[item.type](container, item.asset, item.duration);
  }
  console.log('Meditation sequence complete');
};


const init = async () => {
  await preloadSequenceAssets();
  await playSequence(document.getElementById('asset-container'));
};


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

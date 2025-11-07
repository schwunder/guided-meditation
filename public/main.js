const MEDITATION_SEQUENCE = [
  { type: 'chakra', asset: 'chakras/1-muladhara.webp', duration: 2500 },
  { type: 'checkpoint', asset: 'checkpoints/1-image-1.png', duration: 3000 },
  { type: 'transition', asset: 'transitions/1-video-1.mp4' },
  { type: 'checkpoint', asset: 'checkpoints/1-image-2.png', duration: 3000 },
  { type: 'chakra', asset: 'chakras/2-svadhishthana.webp', duration: 2500 },
];

const COLOR_ANIMATIONS = {
  breathingGlow: { duration: 8000, startColor: 'rgba(255, 255, 255, 0.95)', peakColor: 'rgba(0, 50, 150, 0.8)', startShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)', peakShadow: '0 0 150px rgba(0, 100, 255, 1), 0 0 300px rgba(0, 100, 255, 1), 0 0 450px rgba(0, 100, 255, 0.95), 0 0 600px rgba(0, 100, 255, 0.9), 0 0 800px rgba(0, 100, 255, 0.85), 0 0 1000px rgba(0, 100, 255, 0.8), inset 0 0 300px rgba(0, 100, 255, 0.7)' },
  breathingOverlay: { duration: 15000, contentOpacity: 0.7 },
  chakraIntro: { duration: 2500, fadeOutDuration: 500, dotRadius: 4, dotColor: '#fff' }
};

const MEDIA_SIZING = { maxWidthRatio: 0.8, minPaddingRatio: 0.05 };

const buildAssetUrl = (filename) => `/assets/${encodeURIComponent(filename)}`;

const injectStyle = (id, cssContent) => {
  const existingStyle = document.getElementById(id);
  if (existingStyle) existingStyle.remove();
  const style = document.createElement('style');
  style.id = id;
  style.textContent = cssContent;
  document.head.appendChild(style);
};

const applyColorAnimations = () => {
  const { breathingGlow, breathingOverlay, chakraIntro } = COLOR_ANIMATIONS;
  injectStyle('breathing-animations-style', `
    @keyframes breathe { 0%, 100% { box-shadow: ${breathingGlow.startShadow}; background-color: ${breathingGlow.startColor}; } 50% { box-shadow: ${breathingGlow.peakShadow}; background-color: ${breathingGlow.peakColor}; } }
    @keyframes breatheContentOpacity { 0%, 20% { opacity: 1; } 30%, 70% { opacity: ${breathingOverlay.contentOpacity}; } 80%, 100% { opacity: 1; } }
    .main-view { animation: breathe ${breathingGlow.duration}ms ease-in-out infinite !important; }
    .main-view #asset-container { animation: breatheContentOpacity ${breathingOverlay.duration}ms ease-in-out infinite !important; }
    .radiating-dot.animate { animation: radiate ${chakraIntro.duration}ms ease-out forwards !important; }
  `);
};

const createChakraOverlay = (assetPath) => {
  const overlay = document.createElement('div');
  overlay.className = 'animation-overlay';
  overlay.style.backgroundImage = `url('${buildAssetUrl(assetPath)}')`;
  const dot = document.createElement('div');
  dot.className = 'radiating-dot';
  dot.style.background = COLOR_ANIMATIONS.chakraIntro.dotColor;
  const finalScale = Math.sqrt(window.innerWidth ** 2 + window.innerHeight ** 2) / 2 / COLOR_ANIMATIONS.chakraIntro.dotRadius;
  overlay.style.setProperty('--final-scale', finalScale.toString());
  overlay.appendChild(dot);
  return { overlay, dot };
};

const calculateMediaSize = (mediaElement, viewportWidth, viewportHeight) => {
  const naturalWidth = mediaElement.videoWidth || mediaElement.naturalWidth || mediaElement.width;
  const naturalHeight = mediaElement.videoHeight || mediaElement.naturalHeight || mediaElement.height;
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
  const url = buildAssetUrl(assetPath);
  const handleResize = () => {
    const mediaElement = wrapper.querySelector('img, video');
    if (mediaElement) applyMediaSizing(mediaElement);
  };
  const media = mediaType === 'video' ? document.createElement('video') : document.createElement('img');
  media.src = url;
  if (mediaType === 'video') {
    media.muted = true;
    media.playsInline = true;
    media.preload = 'auto';
    media.addEventListener('loadedmetadata', () => applyMediaSizing(media));
  } else {
    media.addEventListener('load', () => applyMediaSizing(media));
  }
  resizeHandlers.set(wrapper, handleResize);
  window.addEventListener('resize', handleResize);
  wrapper.appendChild(media);
  return wrapper;
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

const playChakraAnimation = (container, assetPath, duration) => {
  return new Promise((resolve) => {
    container.style.opacity = '0';
    container.style.visibility = 'hidden';
    const { overlay, dot } = createChakraOverlay(assetPath);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => dot.classList.add('animate'));
    setTimeout(() => {
      overlay.classList.add('fade-out');
      setTimeout(() => {
        overlay.remove();
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        resolve();
      }, COLOR_ANIMATIONS.chakraIntro.fadeOutDuration);
    }, duration);
  });
};

const playCheckpointItem = (container, assetPath, duration) => {
  return new Promise((resolve) => {
    clearContainer(container);
    container.appendChild(createMediaElement(assetPath, 'image'));
    setTimeout(resolve, duration);
  });
};

const playTransitionItem = (container, assetPath) => {
  return new Promise((resolve) => {
    clearContainer(container);
    const wrapper = createMediaElement(assetPath, 'video');
    const video = wrapper.querySelector('video');
    container.appendChild(wrapper);
    video.addEventListener('ended', resolve, { once: true });
    video.play();
    video.addEventListener('loadeddata', () => video.play(), { once: true });
  });
};

const SEQUENCE_HANDLERS = { chakra: playChakraAnimation, checkpoint: playCheckpointItem, transition: playTransitionItem };

const playSequence = async (container) => {
  clearContainer(container);
  for (const item of MEDITATION_SEQUENCE) {
    await SEQUENCE_HANDLERS[item.type](container, item.asset, item.duration);
  }
  console.log('Meditation sequence complete');
};

const init = async () => {
  applyColorAnimations();
  await playSequence(document.getElementById('asset-container'));
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

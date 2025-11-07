// ============================================
// CONFIG - Meditation sequence & animations
// ============================================

// MEDITATION SEQUENCE - Define the flow here
// Types: 'chakra' (animated intro), 'image' (static), 'video' (playback)
const MEDITATION_SEQUENCE = [
  { type: 'chakra', asset: 'muladhara.webp', duration: 2500 },
  { type: 'image', asset: 'image-1.png', duration: 3000 },
  { type: 'video', asset: 'video-1.mp4' },
  { type: 'image', asset: 'image-1.png', duration: 3000 },
  { type: 'chakra', asset: 'muladhara.webp', duration: 2500 },
  { type: 'video', asset: 'video-2.mp4' },
  // Add more sequence items here...
];

// COLOR ANIMATIONS - Tinker with hue/breathing effects here
const COLOR_ANIMATIONS = {
  breathingGlow: {
    duration: 8000,           // Full breathing cycle (ms)
    startColor: 'rgba(255, 255, 255, 0.95)',
    peakColor: 'rgba(0, 50, 150, 0.8)',
    startShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 0 40px rgba(255, 255, 255, 0.05)',
    peakShadow: '0 0 150px rgba(0, 100, 255, 1), 0 0 300px rgba(0, 100, 255, 1), 0 0 450px rgba(0, 100, 255, 0.95), 0 0 600px rgba(0, 100, 255, 0.9), 0 0 800px rgba(0, 100, 255, 0.85), 0 0 1000px rgba(0, 100, 255, 0.8), inset 0 0 300px rgba(0, 100, 255, 0.7)'
  },
  breathingOverlay: {
    duration: 15000,          // Overlay breathing cycle (ms)
    peakGradient: 'radial-gradient(circle at center, rgba(0, 100, 255, 0.9), rgba(0, 100, 255, 0.6), rgba(0, 100, 255, 0.3), rgba(0, 100, 255, 0))'
  },
  chakraIntro: {
    duration: 2500,           // Radiate animation duration
    fadeOutDuration: 500,     // Fade to content duration
    dotStartSize: 8,          // Starting dot size (px)
    dotRadius: 4,             // Radius for scale calculation
    dotColor: '#fff'          // Radiating dot color
  }
};

// MEDIA TYPES - Supported file formats
const MEDIA_TYPES = {
  video: ['mp4', 'webm', 'ogg', 'mov', 'avi'],
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
};

// ============================================
// UTILITIES - Pure helper functions
// ============================================
const getFileExt = (filename) => filename.split('.').pop().toLowerCase();
const isVideo = (filename) => MEDIA_TYPES.video.includes(getFileExt(filename));
const isImage = (filename) => MEDIA_TYPES.image.includes(getFileExt(filename));
const buildAssetUrl = (filename) => `/assets/${encodeURIComponent(filename)}`;

// Inject color animation settings into CSS
function applyColorAnimations() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes breathe {
      0%, 100% {
        box-shadow: ${COLOR_ANIMATIONS.breathingGlow.startShadow};
        background-color: ${COLOR_ANIMATIONS.breathingGlow.startColor};
      }
      50% {
        box-shadow: ${COLOR_ANIMATIONS.breathingGlow.peakShadow};
        background-color: ${COLOR_ANIMATIONS.breathingGlow.peakColor};
      }
    }

    @keyframes breatheOverlay {
      0%, 100% {
        opacity: 0;
        background: radial-gradient(circle at center, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0));
      }
      50% {
        opacity: 1;
        background: ${COLOR_ANIMATIONS.breathingOverlay.peakGradient};
      }
    }

    .main-view {
      animation: breathe ${COLOR_ANIMATIONS.breathingGlow.duration}ms ease-in-out infinite !important;
    }

    .main-view::before {
      animation: breatheOverlay ${COLOR_ANIMATIONS.breathingOverlay.duration}ms ease-in-out infinite !important;
    }

    .radiating-dot.animate {
      animation: radiate ${COLOR_ANIMATIONS.chakraIntro.duration}ms ease-out forwards !important;
    }
  `;
  document.head.appendChild(style);
}

// ============================================
// DOM BUILDERS - HTML structure/boilerplate
// ============================================
function buildChakraOverlay(assetPath) {
  const overlay = document.createElement('div');
  overlay.className = 'animation-overlay';
  overlay.style.backgroundImage = `url('${buildAssetUrl(assetPath)}')`;

  const dot = document.createElement('div');
  dot.className = 'radiating-dot';
  dot.style.background = COLOR_ANIMATIONS.chakraIntro.dotColor;

  // Calculate scale needed to cover entire viewport diagonal
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const diagonal = Math.sqrt(vw * vw + vh * vh);
  const finalScale = (diagonal / 2) / COLOR_ANIMATIONS.chakraIntro.dotRadius;

  overlay.style.setProperty('--final-scale', finalScale.toString());
  overlay.appendChild(dot);

  return { overlay, dot };
}

function buildVideoElement(assetPath) {
  const video = document.createElement('video');
  video.src = buildAssetUrl(assetPath);
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block';
  return video;
}

function buildImageElement(assetPath) {
  const img = document.createElement('img');
  img.src = buildAssetUrl(assetPath);
  img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block;margin:auto';
  return img;
}

// ============================================
// SEQUENCE PLAYBACK - Sequential meditation flow
// ============================================
let currentSequenceIndex = 0;
let sequenceContainer = null;

async function playSequence() {
  sequenceContainer = document.getElementById('asset-container');
  sequenceContainer.innerHTML = ''; // Clear any existing content

  currentSequenceIndex = 0;
  await playNextSequenceItem();
}

async function playNextSequenceItem() {
  if (currentSequenceIndex >= MEDITATION_SEQUENCE.length) {
    console.log('Meditation sequence complete');
    return;
  }

  const item = MEDITATION_SEQUENCE[currentSequenceIndex];
  currentSequenceIndex++;

  if (item.type === 'chakra') {
    await playChakraAnimation(item.asset, item.duration);
  } else if (item.type === 'image') {
    await playImageItem(item.asset, item.duration);
  } else if (item.type === 'video') {
    await playVideoItem(item.asset);
  }

  // Continue to next item
  await playNextSequenceItem();
}

function playChakraAnimation(assetPath, duration) {
  return new Promise((resolve) => {
    // Hide content initially
    sequenceContainer.style.opacity = '0';
    sequenceContainer.style.visibility = 'hidden';

    // Build and mount overlay
    const { overlay, dot } = buildChakraOverlay(assetPath);
    document.body.appendChild(overlay);

    // Trigger animation
    requestAnimationFrame(() => {
      dot.classList.add('animate');
    });

    // Remove overlay after animation
    setTimeout(() => {
      overlay.classList.add('fade-out');

      setTimeout(() => {
        overlay.remove();
        sequenceContainer.style.opacity = '1';
        sequenceContainer.style.visibility = 'visible';
        resolve();
      }, COLOR_ANIMATIONS.chakraIntro.fadeOutDuration);
    }, duration);
  });
}

function playImageItem(assetPath, duration) {
  return new Promise((resolve) => {
    sequenceContainer.innerHTML = '';
    const img = buildImageElement(assetPath);
    sequenceContainer.appendChild(img);

    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function playVideoItem(assetPath) {
  return new Promise((resolve) => {
    sequenceContainer.innerHTML = '';
    const video = buildVideoElement(assetPath);
    sequenceContainer.appendChild(video);

    video.addEventListener('ended', () => {
      resolve();
    });

    video.addEventListener('loadeddata', () => {
      video.play().catch(err => {
        console.log('Autoplay prevented:', err);
      });
    });

    video.play().catch(err => {
      console.log('Initial autoplay prevented:', err);
    });
  });
}

// ============================================
// INIT - Startup sequence
// ============================================
async function init() {
  // Apply color animation configurations
  applyColorAnimations();

  // Start meditation sequence
  await playSequence();
}

init();

// ============================================
// CONFIG - Meditation layout & timing
// ============================================
const MEDITATION_LAYOUT = {
  'image-1.png': { row: 0, col: 0, span: 2 },
  'video-1.mp4': { row: 1, col: 0, span: 1 },
  'video-2.mp4': { row: 1, col: 1, span: 1 },
  'video-3.mp4': { row: 2, col: 0, span: 1 },
  'video-4.mp4': { row: 2, col: 1, span: 1 }
};

const ANIMATION = {
  introDuration: 2500,
  fadeOutDuration: 500,
  dotStartSize: 8,
  dotRadius: 4
};

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
const getDisplayName = (filename) => filename.replace(/\.[^/.]+$/, '');

// ============================================
// DOM BUILDERS - HTML structure/boilerplate
// ============================================
function buildPreviewItem(filename) {
  const container = document.createElement('div');
  container.className = 'preview-item';
  container.style.gridColumn = `span ${MEDITATION_LAYOUT[filename].span}`;

  const mediaPreview = buildMediaPreview(filename);
  const descriptionPanel = buildDescriptionPanel(filename);

  container.appendChild(mediaPreview);
  container.appendChild(descriptionPanel);
  return container;
}

function buildMediaPreview(filename) {
  const preview = document.createElement('div');
  preview.className = 'thumbnail';

  if (isVideo(filename)) {
    preview.appendChild(buildVideoElement(filename));
  } else if (isImage(filename)) {
    preview.appendChild(buildImageElement(filename));
  }

  return preview;
}

function buildVideoElement(filename) {
  const video = document.createElement('video');
  video.src = buildAssetUrl(filename);
  video.muted = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = 'auto';
  video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';

  // Attach event handlers
  video.addEventListener('loadeddata', () => handleVideoLoaded(video));

  // Try initial play
  video.play().catch(err => {
    console.log('Initial autoplay prevented:', err);
  });

  return video;
}

function buildImageElement(filename) {
  const img = document.createElement('img');
  img.src = buildAssetUrl(filename);
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
  return img;
}

function buildDescriptionPanel(filename) {
  const panel = document.createElement('div');
  panel.className = 'item-sidebar';
  const displayName = getDisplayName(filename);

  panel.innerHTML = `
    <h3>${displayName}</h3>
    <div class="preview-content">
      <p>This is the preview text for ${displayName}.</p>
    </div>
  `;

  return panel;
}

function buildChakraOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'animation-overlay';

  const dot = document.createElement('div');
  dot.className = 'radiating-dot';

  // Calculate scale needed to cover entire viewport diagonal
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const diagonal = Math.sqrt(vw * vw + vh * vh);
  const finalScale = (diagonal / 2) / ANIMATION.dotRadius;

  overlay.style.setProperty('--final-scale', finalScale.toString());
  overlay.appendChild(dot);

  return { overlay, dot };
}

// ============================================
// LOGIC - Business rules & data processing
// ============================================
async function fetchAssets() {
  const response = await fetch('/api/assets');
  return response.json();
}

function filterMappedAssets(assets) {
  return assets.filter(filename => MEDITATION_LAYOUT.hasOwnProperty(filename));
}

function sortByLayoutPosition(assets) {
  return assets.sort((a, b) => {
    const posA = MEDITATION_LAYOUT[a];
    const posB = MEDITATION_LAYOUT[b];
    if (posA.row !== posB.row) return posA.row - posB.row;
    return posA.col - posB.col;
  });
}

function renderPreviewGrid(assets) {
  const container = document.getElementById('asset-container');
  assets.forEach(filename => {
    const item = buildPreviewItem(filename);
    container.appendChild(item);
  });
}

function showEmptyState() {
  const container = document.getElementById('asset-container');
  container.innerHTML = '<p>No assets found</p>';
}

// ============================================
// EVENT HANDLERS - User interactions
// ============================================
function handleVideoLoaded(video) {
  video.play().catch(err => {
    console.log('Autoplay prevented:', err);
  });
}

// ============================================
// ANIMATION SEQUENCE
// ============================================
function startChakraIntro() {
  const container = document.getElementById('asset-container');

  // Hide content initially
  container.style.opacity = '0';
  container.style.visibility = 'hidden';

  // Build and mount overlay
  const { overlay, dot } = buildChakraOverlay();
  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(() => {
    dot.classList.add('animate');
  });

  // Reveal content after animation
  setTimeout(() => {
    overlay.classList.add('fade-out');
    container.style.opacity = '1';
    container.style.visibility = 'visible';

    setTimeout(() => overlay.remove(), ANIMATION.fadeOutDuration);
  }, ANIMATION.introDuration);
}

// ============================================
// INIT - Startup sequence
// ============================================
async function init() {
  const assets = await fetchAssets();

  if (assets.length === 0) {
    showEmptyState();
    return;
  }

  const mappedAssets = filterMappedAssets(assets);
  const sortedAssets = sortByLayoutPosition(mappedAssets);

  renderPreviewGrid(sortedAssets);
}

startChakraIntro();
init();

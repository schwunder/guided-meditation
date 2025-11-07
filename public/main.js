const assetContainer = document.getElementById('asset-container');

const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

// Hardcoded mapping of asset filenames to grid positions (row, column, span)
// Row 0: 1 item spanning 2 columns
// Row 1: 2 items (col 0 and col 1)
// Row 2: 2 items (col 0 and col 1)
const assetGridMap = {
  'image-1.png': { row: 0, col: 0, span: 2 },
  'video-1.mp4': { row: 1, col: 0, span: 1 },
  'video-2.mp4': { row: 1, col: 1, span: 1 },
  'video-3.mp4': { row: 2, col: 0, span: 1 },
  'video-4.mp4': { row: 2, col: 1, span: 1 },
};

function isVideo(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return videoExts.includes(extension);
}

function isImage(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return imageExts.includes(extension);
}

function createAnimationOverlay() {
  // Hide asset container initially
  assetContainer.style.opacity = '0';
  assetContainer.style.visibility = 'hidden';

  // Create overlay with black background
  const overlay = document.createElement('div');
  overlay.className = 'animation-overlay';
  
  // Create radiating dot element (white circle)
  const dot = document.createElement('div');
  dot.className = 'radiating-dot';
  
  // Calculate the scale needed to cover entire viewport
  // We need to cover the diagonal: sqrt(vw^2 + vh^2)
  // Starting radius is 4px (half of 8px width)
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const diagonal = Math.sqrt(vw * vw + vh * vh);
  const finalRadius = diagonal / 2;
  const scale = finalRadius / 4; // 4px is the starting radius
  
  // Set the final scale as a CSS variable for the animation
  overlay.style.setProperty('--final-scale', scale.toString());
  
  overlay.appendChild(dot);
  document.body.appendChild(overlay);

  // Start animation
  requestAnimationFrame(() => {
    dot.classList.add('animate');
  });

  // After animation completes, reveal grid and remove overlay
  const animationDuration = 2500; // 2.5 seconds
  setTimeout(() => {
    overlay.classList.add('fade-out');
    assetContainer.style.opacity = '1';
    assetContainer.style.visibility = 'visible';
    
    // Remove overlay after fade out completes
    setTimeout(() => {
      overlay.remove();
    }, 500); // Match fade-out transition duration
  }, animationDuration);
}

async function init() {
  const assetFiles = await fetch('/api/assets').then(response => response.json());

  if (assetFiles.length === 0) {
    assetContainer.innerHTML = '<p>No assets found</p>';
    return;
  }

  // Filter assets to only those in the mapping and sort by grid position
  const mappedAssets = assetFiles
    .filter(filename => assetGridMap.hasOwnProperty(filename))
    .sort((a, b) => {
      const posA = assetGridMap[a];
      const posB = assetGridMap[b];
      // Sort by row first, then by column
      if (posA.row !== posB.row) {
        return posA.row - posB.row;
      }
      return posA.col - posB.col;
    });

  mappedAssets.forEach(filename => {
    const assetUrl = `/assets/${encodeURIComponent(filename)}`;
    const gridPos = assetGridMap[filename];
    const previewItem = document.createElement('div');
    previewItem.className = 'preview-item';
    
    // Set grid position and span
    previewItem.style.gridColumn = `span ${gridPos.span}`;

    // Create thumbnail section (the "gif" preview)
    const thumbnail = document.createElement('div');
    thumbnail.className = 'thumbnail';
    
    if (isVideo(filename)) {
      // Videos: muted, autoplay, but NO loop (play once) - these are the "rendering gifs"
      const video = document.createElement('video');
      video.src = assetUrl;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.display = 'block';
      
      thumbnail.appendChild(video);
      
      // Ensure video plays after being added to DOM
      video.addEventListener('loadeddata', () => {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      });
      
      // Try to play immediately
      video.play().catch(err => {
        // If autoplay fails, wait for user interaction or loadeddata event
        console.log('Initial autoplay prevented:', err);
      });
    } else if (isImage(filename)) {
      const img = document.createElement('img');
      img.src = assetUrl;
      img.style.width = '100%';
      img.style.height = '100%';
      img.style.objectFit = 'cover';
      img.style.display = 'block';
      thumbnail.appendChild(img);
    } else {
      return;
    }

    // Create sidebar section with text (no preview video/image)
    const sidebar = document.createElement('div');
    sidebar.className = 'item-sidebar';
    
    // Extract filename without extension for display
    const displayName = filename.replace(/\.[^/.]+$/, '');
    
    sidebar.innerHTML = `
      <h3>${displayName}</h3>
      <div class="preview-content">
        <p>This is the preview text for ${displayName}.</p>
      </div>
    `;

    // Assemble the preview item
    previewItem.appendChild(thumbnail);
    previewItem.appendChild(sidebar);
    
    assetContainer.appendChild(previewItem);
  });
}

// Start with animation, then initialize grid
createAnimationOverlay();
init();

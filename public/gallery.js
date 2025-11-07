const gridContainer = document.getElementById('grid');
const fullscreenView = document.getElementById('fullscreen');
const fullscreenContent = document.getElementById('content');
const closeButton = document.getElementById('close');

const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];
const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];

function isVideo(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return videoExts.includes(extension);
}

function isImage(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return imageExts.includes(extension);
}

function openFullscreen(filename) {
  const assetUrl = `/assets/${encodeURIComponent(filename)}`;
  if (isVideo(filename)) {
    fullscreenContent.innerHTML = `<video src="${assetUrl}" controls autoplay></video>`;
  } else {
    fullscreenContent.innerHTML = `<img src="${assetUrl}">`;
  }
  fullscreenView.classList.remove('hidden');
}

function closeFullscreen() {
  fullscreenView.classList.add('hidden');
  const videoElement = fullscreenContent.querySelector('video');
  if (videoElement) {
    videoElement.pause();
  }
}

async function init() {
  const assetFiles = await fetch('/api/assets').then(response => response.json());

  assetFiles.forEach(filename => {
    const assetUrl = `/assets/${encodeURIComponent(filename)}`;
    const gridItem = document.createElement('div');
    gridItem.className = 'item';

    if (isVideo(filename)) {
      gridItem.innerHTML = `<video src="${assetUrl}" muted loop autoplay></video>`;
    } else if (isImage(filename)) {
      gridItem.innerHTML = `<img src="${assetUrl}">`;
    } else {
      return;
    }

    gridItem.onclick = () => openFullscreen(filename);
    gridContainer.appendChild(gridItem);
  });
}

closeButton.onclick = closeFullscreen;
fullscreenView.onclick = (event) => {
  if (event.target === fullscreenView) {
    closeFullscreen();
  }
};

init();

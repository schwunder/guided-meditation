const parseDuration = (value, fallback = 0) => {
  if (!value) return fallback;
  const trimmed = value.trim();
  if (!trimmed) return fallback;
  if (trimmed.endsWith('ms')) return Number.parseFloat(trimmed);
  if (trimmed.endsWith('s')) return Number.parseFloat(trimmed) * 1000;
  const numeric = Number.parseFloat(trimmed);
  return Number.isNaN(numeric) ? fallback : numeric;
};

const cssDuration = (element, property, fallback = 0) =>
  parseDuration(getComputedStyle(element).getPropertyValue(property), fallback);

const buildAssetUrl = (asset) =>
  `/assets/${String(asset)
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`;

const isVideo = (item) =>
  item.type === 'transition' || /\.(mp4|webm|mov)$/i.test(String(item.asset));

const readTimeline = () => {
  const source = document.querySelector('[data-sequence-source]');
  if (!source) throw new Error('Missing sequence source markup.');

  const sections = Array.from(source.querySelectorAll('section[data-sequence-id]'));
  if (!sections.length) throw new Error('No sequences declared in markup.');

  return sections.flatMap((section, index) => {
    const computed = getComputedStyle(section);
    const theme = {
      id: section.dataset.sequenceId || `sequence-${index}`,
      base: Number.parseFloat(computed.getPropertyValue('--accent-hue-base')) || 215,
      shift:
        Number.parseFloat(computed.getPropertyValue('--accent-hue-shift')) ||
        Number.parseFloat(computed.getPropertyValue('--accent-hue-base')) ||
        215,
    };

    return Array.from(section.querySelectorAll('[data-sequence-item]')).map(
      (element) => {
        const asset = element.dataset.asset?.trim();
        if (!asset) {
          throw new Error('Sequence item missing asset path.');
        }

        const caption = element.dataset.caption?.trim() || '';
        const alt = element.dataset.alt?.trim() || caption;
        const holdRaw = element.dataset.hold;
        const holdMs = holdRaw ? Number.parseFloat(holdRaw) : null;
        const choices = Array.from(
          element.querySelectorAll('[data-choice-list] li')
        )
          .map((li) => li.textContent.trim())
          .filter(Boolean);

        return {
          type: element.dataset.type === 'transition' ? 'transition' : 'checkpoint',
          asset,
          caption,
          alt,
          choices,
          theme,
          holdMs: Number.isFinite(holdMs) ? holdMs : null,
        };
      }
    );
  });
};

const mediaCache = new Map();

const ensureMedia = (item) => {
  let entry = mediaCache.get(item.asset);
  if (entry) {
    if (entry.type === 'image') {
      entry.element.alt = item.alt || item.caption || '';
    }
    return entry;
  }

  if (isVideo(item)) {
    const video = document.createElement('video');
    video.muted = true;
    video.setAttribute('muted', '');
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.preload = 'auto';
    video.src = buildAssetUrl(item.asset);

    entry = {
      type: 'video',
      element: video,
      ready: new Promise((resolve, reject) => {
        const cleanup = () => {
          video.removeEventListener('canplaythrough', handleReady);
          video.removeEventListener('error', handleError);
        };
        const handleReady = () => {
          cleanup();
          resolve(video);
        };
        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to preload video asset "${item.asset}"`));
        };
        if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
          resolve(video);
          return;
        }
        video.addEventListener('canplaythrough', handleReady, { once: true });
        video.addEventListener('error', handleError, { once: true });
        video.load();
      }),
      reset() {
        video.pause();
        video.currentTime = 0;
      },
    };
  } else {
    const image = new Image();
    image.decoding = 'async';
    image.alt = item.alt || item.caption || '';
    image.src = buildAssetUrl(item.asset);

    entry = {
      type: 'image',
      element: image,
      ready: new Promise((resolve, reject) => {
        const cleanup = () => {
          image.removeEventListener('load', handleLoad);
          image.removeEventListener('error', handleError);
        };
        const handleLoad = () => {
          cleanup();
          resolve(image);
        };
        const handleError = () => {
          cleanup();
          reject(new Error(`Failed to preload image asset "${item.asset}"`));
        };
        if (image.complete && image.naturalWidth) {
          resolve(image);
          return;
        }
        image.addEventListener('load', handleLoad, { once: true });
        image.addEventListener('error', handleError, { once: true });
      }),
      reset() {},
    };
  }

  mediaCache.set(item.asset, entry);
  return entry;
};

const hue = (() => {
  const root = document.documentElement;
  let themeId = null;
  let base = 215;
  let shift = 215;
  let checkpoints = 0;

  const applyTheme = (theme) => {
    themeId = theme.id;
    base = theme.base;
    shift = theme.shift;
    checkpoints = 0;
    root.style.setProperty('--accent-hue-base', `${base}`);
    root.style.setProperty('--accent-hue-shift', `${shift}`);
    root.style.setProperty('--accent-hue', `${base}`);
  };

  return {
    use(theme) {
      if (!theme) return;
      if (theme.id !== themeId) {
        applyTheme(theme);
      }
      const currentHue = checkpoints >= 2 ? shift : base;
      root.style.setProperty('--accent-hue', `${currentHue}`);
    },
    markCheckpoint() {
      checkpoints += 1;
    },
  };
})();

const fadeDuration = () =>
  cssDuration(document.documentElement, '--transition-duration-fade', 0);

const checkpointHold = (item) =>
  item.holdMs ?? cssDuration(document.documentElement, '--checkpoint-hold-ms', 3000);

const playVideo = (video) =>
  new Promise((resolve) => {
    const finish = () => {
      video.removeEventListener('ended', finish);
      resolve();
    };
    video.addEventListener('ended', finish, { once: true });
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(finish);
    }
    setTimeout(() => {
      if (!video.paused || video.currentTime > 0) return;
      finish();
    }, 500);
  });

const hold = (ms) =>
  ms > 0
    ? new Promise((resolve) => {
        setTimeout(resolve, ms);
      })
    : Promise.resolve();

const createStageBuilder = (container, template) => {
  if (!(template instanceof HTMLTemplateElement)) {
    throw new Error('Missing stage template.');
  }

  let activeStage = null;

  const build = (item, entry) => {
    const fragment = template.content.cloneNode(true);
    const stage = fragment.querySelector('[data-stage]');
    if (!stage) {
      throw new Error('Stage template missing `[data-stage]` element.');
    }

    stage.dataset.type = item.type;
    const figure = stage.querySelector('[data-stage-figure]');
    if (figure) {
      figure.dataset.type = item.type;
    }

    const slot = stage.querySelector('[data-media-slot]');
    if (slot) {
      slot.innerHTML = '';
      slot.appendChild(entry.element);
    }

    const caption = stage.querySelector('[data-caption-text]');
    if (caption) caption.textContent = item.caption || '';

    const list = stage.querySelector('[data-choice-list]');
    if (list) {
      list.innerHTML = '';
      if (item.choices.length) {
        item.choices.forEach((choice) => {
          const li = document.createElement('li');
          li.textContent = choice;
          list.appendChild(li);
        });
        list.hidden = false;
        list.setAttribute('aria-hidden', 'false');
        stage.querySelector('[data-caption]')?.classList.add('has-choices');
      } else {
        list.hidden = true;
        list.setAttribute('aria-hidden', 'true');
        stage.querySelector('[data-caption]')?.classList.remove('has-choices');
      }
    }

    return stage;
  };

  const show = (stage) => {
    if (activeStage) {
      activeStage.classList.remove('is-active');
      const previous = activeStage;
      const timeout = fadeDuration();
      setTimeout(() => previous.remove(), timeout + 50);
    }

    container.appendChild(stage);
    requestAnimationFrame(() => {
      stage.classList.add('is-active');
    });
    activeStage = stage;
  };

  return (item, entry) => {
    const stage = build(item, entry);
    show(stage);
    return stage;
  };
};

const runTimeline = async (timeline, presentStage) => {
  for (const item of timeline) {
    const entry = ensureMedia(item);
    try {
      await entry.ready;
    } catch (error) {
      console.error(`Skipping asset "${item.asset}"`, error);
      continue;
    }

    entry.reset();
    hue.use(item.theme);
    if (item.type === 'checkpoint') {
      hue.markCheckpoint();
    }

    const stage = presentStage(item, entry);
    if (entry.type === 'video') {
      await playVideo(entry.element);
    } else {
      await hold(checkpointHold(item));
    }
  }
};

const bootstrap = async () => {
  try {
    const container = document.getElementById('asset-container');
    const template = document.getElementById('stage');
    if (!container || !template) {
      throw new Error('Stage container or template missing.');
    }

    const timeline = readTimeline();
    if (!timeline.length) {
      console.error('No sequence items available for playback.');
      return;
    }

    const presentStage = createStageBuilder(container, template);
    hue.use(timeline[0]?.theme);
    await runTimeline(timeline, presentStage);
  } catch (error) {
    console.error('Unable to start guided meditation timeline.', error);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

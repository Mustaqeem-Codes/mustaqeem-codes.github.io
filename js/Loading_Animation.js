class MediaLoader {
  constructor(config = {}) {
    this.config = {
      rings: 2,
      ringSectors: 30,
      ringRadius: 4,
      animDuration: 6,
      loadingText: "LOADING...",
      lazyLoad: true,
      lazyThreshold: 0.1,
      debug: false,
      ...config
    };
    
    this.loadingInstances = new Map();
    this.observer = null;
    this.init();
  }

  init() {
    if (this.config.lazyLoad) {
      this.setupObserver();
    }
    this.initAllMedia();
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startLoading(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: this.config.lazyThreshold,
      rootMargin: '50px'
    });
  }

  initAllMedia() {
    document.querySelectorAll('[data-loading="true"]').forEach(container => {
      this.initMedia(container);
    });
  }

  initMedia(container) {
    const media = container.querySelector('img, video');
    if (!media) return;

    // Ensure container has positioning
    container.style.position = 'relative';
    
    // Check if this is a video with poster
    const isVideoWithPoster = media.tagName === 'VIDEO' && media.hasAttribute('poster');
    
    const overlay = this.createOverlay(container);
    container.appendChild(overlay);

    this.loadingInstances.set(media, {
      container,
      overlay,
      progressBar: overlay.querySelector('.loading-progress-bar'),
      loaded: false,
      isVideo: media.tagName === 'VIDEO',
      hasPoster: isVideoWithPoster,
      posterLoaded: false,
      videoLoaded: false
    });

    // Add loading class
    media.classList.add('media-loading');
    if (media.tagName === 'VIDEO') {
      container.classList.add('video-loading');
    }

    // Handle video poster loading
    if (isVideoWithPoster) {
      this.loadVideoPoster(media);
    }

    if (this.config.lazyLoad && media.loading !== 'eager') {
      this.observer.observe(container);
    } else {
      this.startLoading(container);
    }
  }

  createOverlay(container) {
    const overlay = document.createElement('div');
    overlay.className = 'loading-overlay';
    
    const size = container.dataset.loadingSize || 'medium';
    if (size !== 'medium') overlay.classList.add(size);

    const preloader = document.createElement('div');
    preloader.className = 'preloader';

    const radius = container.dataset.ringRadius || this.config.ringRadius;
    
    // Create 2 rings as required
    for (let r = 0; r < this.config.rings; r++) {
      const ring = document.createElement('div');
      ring.className = 'preloader__ring';
      
      for (let s = 0; s < this.config.ringSectors; s++) {
        const sector = document.createElement('div');
        sector.className = 'preloader__sector';
        const char = this.config.loadingText[s] || "";
        if (char) {
          sector.textContent = char;
          const hue = 180;
          const saturation = 100;
          const lightness = 70 + (s % 2) * 10;
          sector.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        }
        const angle = (360 / this.config.ringSectors) * s;
        sector.style.transform = `rotateY(${angle}deg) translateZ(${radius}rem)`;
        ring.appendChild(sector);
      }
      preloader.appendChild(ring);
    }

    const progressContainer = document.createElement('div');
    progressContainer.className = 'loading-progress';
    const progressBar = document.createElement('div');
    progressBar.className = 'loading-progress-bar';
    progressContainer.appendChild(progressBar);

    overlay.appendChild(preloader);
    overlay.appendChild(progressContainer);

    overlay.style.setProperty('--ring-radius', `${radius}rem`);
    overlay.style.setProperty('--ring-sectors', this.config.ringSectors);
    overlay.style.setProperty('--anim-duration', `${this.config.animDuration}s`);
    overlay.style.setProperty('--ring-count', this.config.rings);

    return overlay;
  }

  loadVideoPoster(video) {
    const instance = this.loadingInstances.get(video);
    if (!instance) return;

    const posterSrc = video.getAttribute('poster');
    if (!posterSrc) {
      instance.posterLoaded = true;
      this.checkVideoReady(video);
      return;
    }

    const img = new Image();
    img.onload = () => {
      instance.posterLoaded = true;
      this.checkVideoReady(video);
    };
    img.onerror = () => {
      // Poster failed, but keep loading animation for video
      instance.posterLoaded = true; // Consider it loaded to move on
      this.checkVideoReady(video);
    };
    img.src = posterSrc;
  }

  checkVideoReady(video) {
    const instance = this.loadingInstances.get(video);
    if (!instance) return;

    // Both poster and video need to be ready
    if (instance.posterLoaded && (video.readyState >= 3 || instance.videoLoaded)) {
      this.mediaLoaded(video);
    }
  }

  startLoading(container) {
    const media = container.querySelector('img, video');
    if (!media) return;

    const instance = this.loadingInstances.get(media);
    if (!instance || instance.loaded) return;

    // For videos, we handle poster separately
    if (media.tagName === 'VIDEO') {
      // Already handled by loadVideoPoster
      // Also set up video loading events
      this.setupVideoLoading(media);
      return;
    }

    // For images, use existing logic
    if (media.complete && media.naturalHeight !== 0) {
      this.mediaLoaded(media);
      return;
    }

    media.addEventListener('load', () => this.mediaLoaded(media));
    media.addEventListener('error', () => {
      // Keep animation spinning
      console.log('Media failed to load, keeping animation visible');
    });
    
    this.simulateProgress(media);
  }

  setupVideoLoading(video) {
    const instance = this.loadingInstances.get(video);
    if (!instance) return;

    // Check if video is already loaded
    if (video.readyState >= 4) {
      instance.videoLoaded = true;
      this.checkVideoReady(video);
      return;
    }

    // Listen for video loading events
    video.addEventListener('loadeddata', () => {
      instance.videoLoaded = true;
      this.checkVideoReady(video);
    });

    video.addEventListener('error', () => {
      // Video failed, but keep animation for poster
      instance.videoLoaded = true; // Consider loaded to proceed
      this.checkVideoReady(video);
    });

    // Simulate progress for video loading
    this.simulateProgress(video);
  }

  simulateProgress(media) {
    const instance = this.loadingInstances.get(media);
    if (!instance) return;

    let progress = 0;
    const interval = setInterval(() => {
      if (progress < 90) {
        progress += Math.random() * 15;
        progress = Math.min(progress, 90);
        instance.progressBar.style.width = `${progress}%`;
      } else {
        clearInterval(interval);
      }
    }, 200);
  }

  mediaLoaded(media) {
    const instance = this.loadingInstances.get(media);
    if (!instance || instance.loaded) return;

    instance.loaded = true;
    instance.progressBar.style.width = '100%';

    // Fade out loading overlay
    setTimeout(() => {
      instance.overlay.classList.add('fade-out');
      setTimeout(() => {
        media.classList.remove('media-loading');
        media.classList.add('media-loaded');
      }, 300);
    }, 300);
  }

  loadAll() {
    this.loadingInstances.forEach((instance, media) => {
      if (!instance.loaded) {
        this.startLoading(instance.container);
      }
    });
  }

  destroy() {
    if (this.observer) this.observer.disconnect();
    this.loadingInstances.clear();
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  window.MediaLoader = MediaLoader;
  
  document.addEventListener('DOMContentLoaded', () => {
    window.mediaLoader = new MediaLoader({
      lazyLoad: false // Home loads immediately
    });
  });
}
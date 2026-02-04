// 1. SCROLL ANIMATION
function handleCertCurtain() {
  const container = document.querySelector(".cert-section");
  const cards = document.querySelectorAll(".cert-card");
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  const sectionRect = container.getBoundingClientRect();
  const sectionTop = sectionRect.top + scrollY;
  const sectionHeight = sectionRect.height;

  const startTrigger = sectionTop - windowHeight * 0.4;
  const endTrigger = sectionTop + sectionHeight * 0.4;

  let progress = (scrollY - startTrigger) / (endTrigger - startTrigger);
  progress = Math.min(Math.max(progress, 0), 1);

  const easedProgress = easeOutCubic(progress);

  cards.forEach((card, index) => {
    const stagger = index * 0.1;
    let cardProgress = Math.min(
      Math.max((progress - stagger) / (1 - stagger), 0),
      1,
    );

    const easedCardProgress = easeOutCubic(cardProgress);
    const xPos = -100 + easedCardProgress * 100;
    const rotation = 30 - easedCardProgress * 30;

    card.style.transform = `translateX(${xPos}px) rotateY(${rotation}deg) scale(${0.95 + easedCardProgress * 0.05})`;
    card.style.opacity = easedCardProgress;

    if (easedCardProgress > 0.9 && !card.classList.contains("visible")) {
      card.classList.add("visible");
    } else if (easedCardProgress <= 0.1 && card.classList.contains("visible")) {
      card.classList.remove("visible");
    }
  });
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// 2. MODAL LOGIC - WITH LOADING ANIMATION
const certModal = document.getElementById("cert-image-modal");
const certModalImg = document.getElementById("cert-modal-image");
const certModalClose = document.querySelector(".cert-modal-close");
const certModalContainer = document.querySelector(".cert-modal-image-container");

// Store MediaLoader instance for modal
let modalMediaLoader = null;

// Add event listeners to all view buttons
document.addEventListener("click", function (e) {
  if (e.target.closest(".cert-view-btn")) {
    const btn = e.target.closest(".cert-view-btn");
    const fullsizeSrc = btn.dataset.fullsize || btn.getAttribute('data-fullsize');
    
    if (!fullsizeSrc) {
      // Fallback to thumbnail src
      const card = e.target.closest(".cert-card");
      fullsizeSrc = card.querySelector(".cert-thumbnail img").src;
    }
    
    // Show modal immediately
    certModal.classList.add("active");
    document.body.style.overflow = "hidden";
    
    // Reset modal image
    certModalImg.src = "";
    certModalImg.classList.remove("media-loaded");
    certModalImg.classList.add("media-loading");
    
    // Create loading animation for modal if not exists
    if (!certModalContainer.querySelector('.loading-overlay')) {
      certModalContainer.setAttribute('data-loading', 'true');
      certModalContainer.setAttribute('data-loading-size', 'large');
      
      // Initialize modal media loader
      if (window.mediaLoader) {
        window.mediaLoader.initMedia(certModalContainer);
      } else {
        // Fallback: create loading overlay manually
        createModalLoadingOverlay();
      }
    } else {
      // Show existing loading overlay
      const overlay = certModalContainer.querySelector('.loading-overlay');
      if (overlay) {
        overlay.style.display = 'flex';
        overlay.classList.remove('fade-out');
      }
    }
    
    // Load the full-size image
    loadModalImage(fullsizeSrc);
  }
});

function createModalLoadingOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay large';
  overlay.innerHTML = `
    <div class="preloader" style="--ring-radius: 5rem; --ring-sectors: 30; --anim-duration: 6s; --ring-count: 2;">
      <div class="preloader__ring">
        ${Array.from({length: 30}, (_, i) => 
          `<div class="preloader__sector" style="transform: rotateY(${i * 12}deg) translateZ(5rem)">${'LOADING'[i] || ''}</div>`
        ).join('')}
      </div>
      <div class="preloader__ring">
        ${Array.from({length: 30}, (_, i) => 
          `<div class="preloader__sector" style="transform: rotateY(${i * 12}deg) translateZ(5rem)"></div>`
        ).join('')}
      </div>
    </div>
    <div class="loading-progress">
      <div class="loading-progress-bar"></div>
    </div>
  `;
  certModalContainer.appendChild(overlay);
}

function loadModalImage(src) {
  const img = new Image();
  
  img.onload = function() {
    // Set the image source
    certModalImg.src = src;
    
    // Wait a bit for image to render
    setTimeout(() => {
      // Hide loading overlay
      const overlay = certModalContainer.querySelector('.loading-overlay');
      if (overlay) {
        overlay.classList.add('fade-out');
        setTimeout(() => {
          overlay.style.display = 'none';
        }, 1000);
      }
      
      // Show image with fade-in
      certModalImg.classList.remove('media-loading');
      certModalImg.classList.add('media-loaded');
    }, 300);
  };
  
  img.onerror = function() {
    // On error, keep loading animation visible
    console.log('Modal image failed to load, keeping animation visible');
    const overlay = certModalContainer.querySelector('.loading-overlay');
    if (overlay) {
      // Don't fade out - keep animation spinning
    }
    
    // Still try to show thumbnail as fallback
    certModalImg.src = src;
    certModalImg.classList.remove('media-loading');
    certModalImg.classList.add('media-loaded');
  };
  
  // Start loading
  img.src = src;
}

// Close modal functionality
certModalClose.onclick = () => {
  certModal.classList.remove("active");
  document.body.style.overflow = "auto";
  
  // Reset modal state for next open
  const overlay = certModalContainer.querySelector('.loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    overlay.classList.remove('fade-out');
  }
};

// Close modal when clicking outside the image
certModal.onclick = (e) => {
  if (e.target === certModal) {
    certModal.classList.remove("active");
    document.body.style.overflow = "auto";
    
    // Reset modal state
    const overlay = certModalContainer.querySelector('.loading-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.classList.remove('fade-out');
    }
  }
};

// 3. DOWNLOAD LOGIC - Fixed for proper PDF download
function downloadPDF(path) {
  // Encode the path to handle spaces and special characters
  const encodedPath = path.split('/').map(part => encodeURIComponent(part)).join('/');
  
  // Use fetch + blob approach for reliable binary file downloads
  fetch(encodedPath)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then(blob => {
      // Create blob URL with correct PDF MIME type
      const blobUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = path.split("/").pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL after download
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
      
      // Visual feedback
      showDownloadSuccess();
    })
    .catch(error => {
      console.error('Download failed:', error);
      // Fallback to direct link method
      const link = document.createElement("a");
      link.href = path;
      link.download = path.split("/").pop();
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showDownloadSuccess();
    });
}

function showDownloadSuccess() {
  // Visual feedback
  const btn = event && event.target ? event.target.closest(".cert-download-btn") : null;
  if (btn) {
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded';
    btn.style.background = "#4CAF50";
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
    }, 1500);
  }
}

// 4. INITIALIZE
function initCertificates() {
  handleCertCurtain();

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleCertCurtain();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );

  window.addEventListener("resize", handleCertCurtain);

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && certModal.classList.contains("active")) {
      certModal.classList.remove("active");
      document.body.style.overflow = "auto";
      
      // Reset modal loading state
      const overlay = certModalContainer.querySelector('.loading-overlay');
      if (overlay) {
        overlay.style.display = 'none';
        overlay.classList.remove('fade-out');
      }
    }
  });
  
  // Initialize MediaLoader for modal
  if (window.MediaLoader && !window.modalMediaLoader) {
    window.modalMediaLoader = new MediaLoader({
      lazyLoad: false,
      debug: false
    });
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", initCertificates);
window.addEventListener("load", () => {
  setTimeout(handleCertCurtain, 100);
});
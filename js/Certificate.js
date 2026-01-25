// 1. SCROLL ANIMATION
function handleCertCurtain() {
  const container = document.querySelector(".cert-section");
  const cards = document.querySelectorAll(".cert-card");
  const scrollY = window.scrollY;
  const windowHeight = window.innerHeight;

  const sectionRect = container.getBoundingClientRect();
  const sectionTop = sectionRect.top + scrollY;
  const sectionHeight = sectionRect.height;

  const startTrigger = sectionTop - windowHeight * 0.6;
  const endTrigger = sectionTop + sectionHeight * 0.5;

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

// 2. MODAL LOGIC - USING UNIQUE CLASSES
const certModal = document.getElementById("cert-image-modal");
const certModalImg = document.getElementById("cert-modal-image");
const certModalClose = document.querySelector(".cert-modal-close");

// Add event listeners to all view buttons
document.addEventListener("click", function (e) {
  if (e.target.closest(".cert-view-btn")) {
    const card = e.target.closest(".cert-card");
    const imgSrc = card.querySelector(".cert-thumbnail img").src;
    certModalImg.src = imgSrc;
    certModal.classList.add("active");
    document.body.style.overflow = "hidden";
  }
});

// Close modal functionality
certModalClose.onclick = () => {
  certModal.classList.remove("active");
  document.body.style.overflow = "auto";
};

// Close modal when clicking outside the image
certModal.onclick = (e) => {
  if (e.target === certModal) {
    certModal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
};

// 3. DOWNLOAD LOGIC
function downloadPDF(path) {
  const link = document.createElement("a");
  link.href = path;
  link.download = path.split("/").pop();
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Visual feedback
  const btn = event.target.closest(".cert-download-btn");
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
    }
  });
}

// Initialize
document.addEventListener("DOMContentLoaded", initCertificates);
window.addEventListener("load", () => {
  setTimeout(handleCertCurtain, 100);
});

//================== Header ==================
document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("main-header");
  const menuIcon = document.getElementById("menu-icon");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollProgress = document.querySelector(".scroll-progress");

  // Variables for scroll handling
  let lastScrollTop = 0;
  let scrollTimeout;

  // Show header initially
  header.classList.remove("hidden");

  // Toggle mobile menu
  menuIcon.addEventListener("click", function () {
    nav.classList.toggle("show");
    menuIcon.classList.toggle("active");

    // Toggle body overflow when menu is open
    if (nav.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (nav.classList.contains("show")) {
        nav.classList.remove("show");
        menuIcon.classList.remove("active");
        document.body.style.overflow = "";
      }

      // Update active nav link
      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnMenuIcon &&
      nav.classList.contains("show")
    ) {
      nav.classList.remove("show");
      menuIcon.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // ============ Scroll Handling ============

  // Handle scroll events for sticky header
  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Update scroll progress indicator
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / windowHeight) * 100;
    scrollProgress.style.width = scrolled + "%";

    // Add scrolled class for header styling
    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Handle header show/hide on scroll direction
    clearTimeout(scrollTimeout);

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.classList.add("hidden");
    } else {
      // Scrolling up
      header.classList.remove("hidden");
    }

    lastScrollTop = scrollTop;

    // Auto-hide header after stopping scrolling (mobile-friendly)
    scrollTimeout = setTimeout(function () {
      if (scrollTop > 100) {
        header.classList.add("hidden");
      }
    }, 1500);

    // Update active nav link based on scroll position
    updateActiveNavLink();
  });

  // Function to update active nav link based on scroll position
  function updateActiveNavLink() {
    let current = "";
    const sections = document.querySelectorAll(".demo-section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  // Initialize active nav link
  updateActiveNavLink();

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  // Handle window resize
  window.addEventListener("resize", function () {
    if (window.innerWidth > 920) {
      // Close mobile menu on desktop
      nav.classList.remove("show");
      menuIcon.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

// ================= Typing Progress Bar ============

// Typing animation (already present)
const words = [
  "Full Stack Developer",
  "React.js Specialist",
  "Node.js Developer",
  "JavaScript Developer",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector(".typing-text");

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentWord.length + 1) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 200);
  } else {
    setTimeout(type, isDeleting ? 60 : 120);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  type();

  // Animation on scroll/load
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  document.querySelectorAll(".animate").forEach((el) => {
    observer.observe(el);
  });
});

// ============== loading screen ==================
// Home Section Entrance Animation
function animateHomeSection() {
  const homeSection = document.getElementById("home");
  const homeLeft = document.querySelector(".home-left");
  const homeRight = document.querySelector(".home-right");

  if (!homeSection || !homeLeft || !homeRight) return;

  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // Trigger when element is 25% from the top of viewport
    return rect.top <= windowHeight * 0.75;
  }

  // Function to trigger animations
  function triggerAnimations() {
    if (isInViewport(homeSection)) {
      homeLeft.classList.add("show-animate");
      homeRight.classList.add("show-animate");

      // Remove event listener after animation triggers
      window.removeEventListener("scroll", triggerAnimations);
    }
  }

  // Initial check on page load
  setTimeout(() => {
    triggerAnimations();
  }, 300); // Small delay for page to settle

  // Check on scroll
  window.addEventListener("scroll", triggerAnimations);

  // Also trigger on resize (in case of layout changes)
  window.addEventListener("resize", triggerAnimations);
}

// Run when DOM is loaded
document.addEventListener("DOMContentLoaded", animateHomeSection);

// Also run on page load (in case images load slowly)
window.addEventListener("load", animateHomeSection);

// Scroll-triggered animation (repeats when scrolling up/down)
function animateOnScroll() {
  const homeSection = document.getElementById("home");
  const homeLeft = document.querySelector(".home-left");
  const homeRight = document.querySelector(".home-right");

  if (!homeSection || !homeLeft || !homeRight) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation classes
          homeLeft.classList.add("show-animate");
          homeRight.classList.add("show-animate");
        } else {
          // Remove classes when out of view (optional)
          // homeLeft.classList.remove('show-animate');
          // homeRight.classList.remove('show-animate');
        }
      });
    },
    {
      threshold: 0.3, // Trigger when 30% visible
      rootMargin: "0px 0px -100px 0px", // Trigger slightly before entering view
    }
  );

  observer.observe(homeSection);
}

document.addEventListener("DOMContentLoaded", animateOnScroll);

// -----------------------Education Section--------------------------
// Image URLs - using your existing images
const imageUrls = [
  "Pics/home-intro.jpg",
  "Pics/UET-Lahore-Admissions-Entry-Test.jpg",
  "Pics/smart-classroom_01.jpg",
];

const slider = document.getElementById("verticalSlider");
let currentSlide = 0;
let isAnimating = false;

// Initialize slider with images
function initSlider() {
  // Clear existing slides
  slider.innerHTML = "";

  // Create duplicate images for seamless looping
  // We need 3 copies: current set, next set (for smooth transition)
  const allImages = [...imageUrls, ...imageUrls, ...imageUrls];

  allImages.forEach((url, index) => {
    const slide = document.createElement("div");
    slide.className = `slide-item ${index === imageUrls.length ? "active-slide" : ""
      }`;

    const img = document.createElement("img");
    img.src = url;
    img.className = "slide-img";
    img.alt = `University Image ${(index % imageUrls.length) + 1}`;

    slide.appendChild(img);
    slider.appendChild(slide);
  });

  // Start at the second set (middle section)
  currentSlide = imageUrls.length;
  updateSlider();
}

function updateSlider() {
  // Compute slide height dynamically (responsive)
  const firstSlide = document.querySelector(".slide-item");
  const slideHeight = firstSlide ? firstSlide.offsetHeight : 400;

  // Remove active class from all slides
  const slides = document.querySelectorAll(".slide-item");
  slides.forEach((slide) => slide.classList.remove("active-slide"));

  // Add active class to current slide
  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("active-slide");
  }

  // Calculate translateY value using dynamic height
  const translateY = -(currentSlide * slideHeight);
  slider.style.transform = `translateY(${translateY}px)`;
}

function nextSlide() {
  if (isAnimating) return;

  isAnimating = true;
  currentSlide++;

  // Update slider position
  updateSlider();

  // Check if we've reached the end of the second set
  if (currentSlide >= imageUrls.length * 2) {
    // Reset to middle section seamlessly
    setTimeout(() => {
      slider.style.transition = "none";
      currentSlide = imageUrls.length;
      updateSlider();

      // Re-enable transition
      setTimeout(() => {
        slider.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        isAnimating = false;
      }, 50);
    }, 800);
  } else {
    // Normal transition
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
}

function prevSlide() {
  if (isAnimating) return;

  isAnimating = true;
  currentSlide--;

  // Update slider position
  updateSlider();

  // Check if we've reached the beginning of the second set
  if (currentSlide < imageUrls.length) {
    // Reset to middle section seamlessly
    setTimeout(() => {
      slider.style.transition = "none";
      currentSlide = imageUrls.length * 2 - 1;
      updateSlider();

      // Re-enable transition
      setTimeout(() => {
        slider.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        isAnimating = false;
      }, 50);
    }, 800);
  } else {
    // Normal transition
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
}

// Auto slide function
function autoSlide() {
  if (!isAnimating) {
    nextSlide();
  }
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initSlider();

  // Start auto-sliding every 3 seconds
  setInterval(autoSlide, 3000);

  // Add keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nextSlide();
    }
  });
});

// Adjust on window resize
window.addEventListener("resize", () => {
  updateSlider();
});

// ==============================================
// SKILLS CONFIGURATION - EDIT THIS SECTION TO UPDATE SKILLS
// ==============================================

// Configuration object for all skills
const skillsConfig = {
  // Programming skills (left side - linear bars)
  programmingSkills: [
    {
      selector: ".oop",
      percent: 85,
      label: "Object-Oriented Programming (OOP) concepts and implementation",
    },
    {
      selector: ".database",
      percent: 80,
      label: "Database Design & SQL Queries (PostgreSQL, Oracle SQL)",
    },
    {
      selector: ".frontend",
      percent: 88,
      label: "Frontend Development (HTML, CSS, JavaScript)",
    },
    {
      selector: ".backend",
      percent: 75,
      label: "Backend Fundamentals (REST APIs, Node.js basics)",
    },
    {
      selector: ".problem-solving",
      percent: 90,
      label: "Problem Solving & Programming Logic",
    },
    {
      selector: ".version-control",
      percent: 82,
      label: "Version Control (Git Workflows, GitHub)",
    },
  ],

  // Professional skills (right side - circular bars)
  professionalSkills: [
    {
      selector: ".mstools",
      percent: 88,
      label: "Microsoft Office (Word, Excel, PowerPoint)",
    },
    { selector: ".communication", percent: 84, label: "Communication skills" },
    { selector: ".teamwork", percent: 90, label: "Teamwork and collaboration" },
    { selector: ".git", percent: 82, label: "Git & GitHub version control" },
  ],

  // Animation settings
  animation: {
    linearDelay: 300, // Delay between each linear skill animation (ms)
    circularDelay: 200, // Delay between each circular skill animation (ms)
    duration: 1500, // Duration of each animation (ms)
  },
};

// ==============================================
// ANIMATION CONTROLLER - NO NEED TO EDIT BELOW
// ==============================================

/**
 * Handles all skill animations and interactions
 */
class SkillsAnimator {
  constructor(config) {
    this.config = config;
    this.animationStarted = false;
    this.observer = null;
    this.init();
  }

  /**
   * Initialize the animation controller
   */
  init() {
    if ("IntersectionObserver" in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      window.addEventListener("load", () => this.startAnimations());
    }
  }

  /**
   * Set up IntersectionObserver to trigger animations when section is visible
   */
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animationStarted) {
            this.animationStarted = true;
            this.startAnimations();
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const section = document.querySelector(".skills-container");
    if (section) {
      this.observer.observe(section);
    }
  }

  /**
   * Start all animations
   */
  startAnimations() {
    this.animateProgrammingSkills();
  }

  /**
   * Animate programming skills (left side - linear bars)
   */
  animateProgrammingSkills() {
    this.config.programmingSkills.forEach((skill, index) => {
      setTimeout(() => {
        const element = document.querySelector(skill.selector);
        if (!element) return;

        element.classList.add("visible");
        element.setAttribute("aria-valuenow", skill.percent);
        element.setAttribute("aria-label", skill.label);

        this.animateProgress(
          `${skill.selector} .progress-bar`,
          `${skill.selector} .skill-percent`,
          skill.percent,
          element
        );

        // Start professional skills animations after programming ones complete
        if (index === this.config.programmingSkills.length - 1) {
          setTimeout(() => this.animateProfessionalSkills(), 500);
        }
      }, index * this.config.animation.linearDelay);
    });
  }

  /**
   * Animate professional skills (right side - circular bars)
   */
  animateProfessionalSkills() {
    this.config.professionalSkills.forEach((skill, index) => {
      setTimeout(() => {
        const container = document
          .querySelector(`${skill.selector}`)
          ?.closest(".circle-item");
        if (!container) return;

        container.classList.add("visible");
        const progressElement = container.querySelector('[role="progressbar"]');
        progressElement.setAttribute("aria-valuenow", skill.percent);
        progressElement.setAttribute("aria-label", skill.label);

        this.animateProgress(
          `${skill.selector} .circle-progress`,
          `${skill.selector} .circle-text`,
          skill.percent,
          progressElement,
          true
        );
      }, index * this.config.animation.circularDelay);
    });
  }

  /**
   * Animate progress bar/circle
   * @param {string} barSelector - Selector for the progress element
   * @param {string} textSelector - Selector for the text element
   * @param {number} targetPercent - Target percentage to animate to
   * @param {HTMLElement} element - The ARIA progressbar element
   * @param {boolean} isCircle - Whether this is a circular progress indicator
   */
  animateProgress(
    barSelector,
    textSelector,
    targetPercent,
    element,
    isCircle = false
  ) {
    const bar = document.querySelector(barSelector);
    const text = document.querySelector(textSelector);
    if (!bar || !text) return;

    // Remove CSS transitions to control everything via JavaScript
    bar.style.transition = "none";

    const startTime = performance.now();
    const startValue = 0;
    const duration = this.config.animation.duration;
    const circumference = isCircle ? 2 * Math.PI * 50 : 0;

    let animationFrameId;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = startValue + (targetPercent - startValue) * progress;
      const displayValue = Math.floor(currentValue);

      // Update both elements simultaneously with the same value
      if (isCircle) {
        const offset = circumference - (circumference * currentValue) / 100;
        bar.style.strokeDashoffset = offset;
      } else {
        bar.style.width = currentValue + "%";
      }

      // Update text and ARIA attributes
      text.textContent = displayValue + "%";
      element.setAttribute("aria-valuenow", displayValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Ensure final values are exact when animation completes
        if (isCircle) {
          const finalOffset =
            circumference - (circumference * targetPercent) / 100;
          bar.style.strokeDashoffset = finalOffset;
        } else {
          bar.style.width = targetPercent + "%";
        }
        text.textContent = targetPercent + "%";
        element.setAttribute("aria-valuenow", targetPercent);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new SkillsAnimator(skillsConfig);
});

// ==================projects===============================


// Namespaced JavaScript to prevent conflicts
let portfolioActiveCard = null;
const portfolioGrid = document.getElementById('portfolio-project-grid');

function portfolioToggleDetails(button, projectId) {
  const card = document.querySelector(`[data-portfolio-project-id="${projectId}"]`);
  const isClosing = card.classList.contains('portfolio-active');

  // Close previously active card if necessary
  if (portfolioActiveCard && portfolioActiveCard !== card) {
    // Close previous active card and clean up media
    portfolioActiveCard.classList.remove('portfolio-active');
    const prevExpanded = portfolioActiveCard.querySelector('.portfolio-expanded-content-wrapper');
    const prevInfo = portfolioActiveCard.querySelector('.portfolio-card-info-section');
    if (prevExpanded) prevExpanded.style.display = 'none';
    if (prevInfo) prevInfo.style.display = 'block';
    // Pause videos and remove playing class
    portfolioActiveCard.querySelectorAll('video').forEach(v => {
      v.pause();
      v.classList.remove('portfolio-playing');
    });
    // Restore body scroll if it was locked
    document.body.style.overflow = '';
  }

  // Toggling Logic
  if (isClosing) {
    // Close
    portfolioGrid.classList.remove('portfolio-expanded');
    card.classList.remove('portfolio-active');
    const expanded = card.querySelector('.portfolio-expanded-content-wrapper');
    const info = card.querySelector('.portfolio-card-info-section');
    if (expanded) expanded.style.display = 'none';
    if (info) info.style.display = 'block';
    // Pause any videos inside the card when closing
    card.querySelectorAll('video').forEach(v => {
      v.pause();
      v.classList.remove('portfolio-playing');
    });
    // Restore body scroll
    document.body.style.overflow = '';
    portfolioActiveCard = null;

  } else {
    // Open
    portfolioGrid.classList.add('portfolio-expanded');
    card.classList.add('portfolio-active');
    const expanded = card.querySelector('.portfolio-expanded-content-wrapper');
    const info = card.querySelector('.portfolio-card-info-section');
    if (expanded) expanded.style.display = 'flex';
    if (info) info.style.display = 'none';

    // Pause all other videos to avoid duplicate playback
    document.querySelectorAll('.portfolio-project-card video').forEach(v => v.pause());

    // Play expanded-left-side video for this card (muted to allow autoplay)
    const expandedVideo = card.querySelector('.portfolio-expanded-left-side video');
    if (expandedVideo) {
      expandedVideo.currentTime = 0;
      expandedVideo.muted = true; // keep muted for autoplay compatibility
      expandedVideo.play().then(() => {
        expandedVideo.classList.add('portfolio-playing');
      }).catch(e => console.log('Video play prevented:', e));
    }

    // Prevent background scrolling while expanded on mobile
    document.body.style.overflow = 'hidden';

    // On mobile, ensure the expanded card is at the top of viewport
    if (window.innerWidth <= 900) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    portfolioActiveCard = card;
  }
}

// FIXED: Improved comment toggle function
function portfolioToggleComment(commentId) {
  const shortComment = document.getElementById(`portfolio-comment-${commentId}`);
  const fullComment = document.getElementById(`portfolio-full-comment-${commentId}`);
  const button = document.querySelector(`.portfolio-read-more-btn[onclick*="${commentId}"]`);

  if (!shortComment || !fullComment || !button) return;

  if (fullComment.style.display === 'none') {
    // Show full comment, hide short
    shortComment.style.display = 'none';
    fullComment.style.display = 'block';
    button.textContent = 'Show less';
  } else {
    // Show short comment, hide full
    shortComment.style.display = 'block';
    fullComment.style.display = 'none';
    button.textContent = 'Read more';
  }
}

// Initialize videos to play when visible
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target.querySelector('video');
      if (video) {
        if (entry.isIntersecting) {
          video.play().catch(e => console.log("Auto-play prevented:", e));
        } else {
          video.pause();
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.portfolio-project-card').forEach(card => {
    observer.observe(card);
  });

  // Allow user to toggle mute by clicking expanded videos
  document.querySelectorAll('.portfolio-expanded-left-side video').forEach(v => {
    v.style.cursor = 'pointer';
    v.addEventListener('click', () => {
      v.muted = !v.muted;
      if (v.muted) v.classList.remove('portfolio-unmuted');
      else v.classList.add('portfolio-unmuted');
    });
  });
});

// Ensure only the active card video plays
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('portfolio-btn-readmore') ||
    e.target.classList.contains('portfolio-close-expanded')) {

    // Pause all videos
    document.querySelectorAll('video').forEach(video => video.pause());

    // Play only the active card video
    setTimeout(() => {
      const activeCard = document.querySelector('.portfolio-project-card.portfolio-active');
      if (activeCard) {
        const video = activeCard.querySelector('.portfolio-expanded-left-side video') ||
          activeCard.querySelector('video');
        if (video) {
          video.play()
            .then(() => video.classList.add('portfolio-playing'))
            .catch(e => console.log("Video play error:", e));
        }
      }
    }, 300);
  }
});

// Close expanded card when clicking outside on desktop
document.addEventListener('click', (e) => {
  if (portfolioActiveCard &&
    window.innerWidth > 900 &&
    !portfolioActiveCard.contains(e.target) &&
    !e.target.classList.contains('portfolio-btn-readmore')) {

    portfolioToggleDetails(null, portfolioActiveCard.getAttribute('data-portfolio-project-id'));
  }
});

// Close expanded card on Escape key press
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && portfolioActiveCard) {
    portfolioToggleDetails(
      null,
      portfolioActiveCard.getAttribute('data-portfolio-project-id')
    );
  }
});


// ================================= Static Projects =================================
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.querySelector(".modal");
  const closeModal = document.querySelector(".close-modal");
  const modalContent = document.querySelector(".modal-content");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.1 }
  );

  // Apply directional animation classes and observer
  function applyAnimationsToCards(container = document) {
    container.querySelectorAll(".project-card").forEach((card) => {
      if (
        !card.classList.contains("from-left") &&
        !card.classList.contains("from-right") &&
        !card.classList.contains("from-bottom")
      ) {
        const rect = card.getBoundingClientRect();
        const center = window.innerWidth / 2;
        const cardCenter = rect.left + rect.width / 2;

        if (cardCenter < center - 100) {
          card.classList.add("from-right");
        } else if (cardCenter > center + 100) {
          card.classList.add("from-left");
        } else {
          card.classList.add("from-bottom");
        }
      }

      observer.observe(card);
    });

    // Trigger animation slightly after load
    setTimeout(() => {
      container.querySelectorAll(".project-card").forEach((card) => {
        card.classList.add("visible");
      });
    }, 200);
  }

  applyAnimationsToCards(); // Initial call

  // Modal View Output
  document.querySelectorAll(".view-output-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const card = this.closest(".project-card");
      const images = card.getAttribute("data-output-images").split(",");

      modalContent.innerHTML = "";
      images.forEach((imgSrc) => {
        const img = document.createElement("img");
        img.src = imgSrc.trim();
        img.className = "output-image";
        img.alt = "Project output";
        modalContent.appendChild(img);
      });

      modal.classList.add("active");
    });
  });

  closeModal.addEventListener("click", () => modal.classList.remove("active"));
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
  });

  // Download Button Animation
  document.querySelectorAll(".download-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const url = this.getAttribute("data-url");
      const btnText = this.querySelector(".btn-text");
      const checkmark = this.querySelector(".checkmark");

      this.classList.add("downloading");
      btnText.textContent = "Downloading...";
      checkmark.style.display = "none";

      const a = document.createElement("a");
      a.href = url;
      a.download = url.split("/").pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        this.classList.remove("downloading");
        btnText.style.display = "none";
        checkmark.style.display = "inline";

        setTimeout(() => {
          btnText.style.display = "inline";
          btnText.textContent = "Download";
          checkmark.style.display = "none";
        }, 2000);
      }, 1500);
    });
  });

  // Optional: Reapply animations if you dynamically add cards in future
  // Example:
  // const newCard = document.createElement('div');
  // newCard.classList.add('project-card');
  // newCard.innerHTML = `...your card HTML...`;
  // document.querySelector('.projects-container').appendChild(newCard);
  // applyAnimationsToCards(document.querySelector('.projects-container'));
});
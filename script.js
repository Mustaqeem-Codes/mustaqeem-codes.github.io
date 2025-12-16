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
    slide.className = `slide-item ${
      index === imageUrls.length ? "active-slide" : ""
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

// ==================                       projects    ===============================

// ==================================== Portfolio State Management ====================================
const portfolioState = {
  activeProjectId: null,
  expandedVideo: null, // Track expanded video element
  expandedData: {
    1: {
      title: "DSA Visualization Website",
      videoSrc: "Pics/DSA-Web.mp4",
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
      description:
        "A dynamic React-based web application that brings data structures and algorithms to life through interactive visual animations. Users can explore how core structures such as stacks, queues, linked lists, trees, and graphs behave step-by-step, with intuitive controls to play, pause, and step through operations. This tool transforms abstract concepts into visual learning experiences, making it easier to grasp algorithm execution flow and state changes in real time.",
      collaborators: [
        {
          name: "M Zeewaqar",
          avatar: "",
          link: "",
          commentShort:
            "Contributed to algorithm visualization logic and React component architecture.",
          commentFull:
            "Led the development of algorithm visualization modules, implementing interactive step-by-step controls and real-time state updates. Architected the React component structure for maintainability and performance.",
        },
        {
          name: "Abdullah Umar",
          avatar: "Pics/Abdullah_Umar.jpg",
          link: "https://cv-iota-murex.vercel.app/",
          commentShort:
            "Focused on UI/UX design and responsive layout implementation.",
          commentFull:
            "Designed and implemented the user interface with a focus on intuitive controls and responsive design. Created the visual theme and animation system that makes complex algorithms easy to understand.",
        },
      ],
    },
    2: {
      title: "Flood Aid Website",
      videoSrc: "Pics/Khush Naseeb.mp4",
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
      description:
        "A responsive, full-stack web platform to support flood relief coordination and assistance efforts. Built with a React frontend, C# backend API, and MongoDB database, the site enables users to submit and view requests for aid, connect with volunteers or helpers, and access essential information during flood emergencies. The system streamlines relief efforts by organizing real-time requests, fostering community support, and ensuring effective resource distribution when every moment counts.",
      collaborators: [
        {
          name: "Farhan Shakeel",
          avatar: "",
          link: "",
          commentShort: "Backend development and database architecture.",
          commentFull:
            "Developed the C# backend API with secure authentication and data validation. Architected the MongoDB database schema for optimal performance and scalability, implementing geospatial queries for location-based services.",
        },
        {
          name: "M Umair",
          avatar: "Pics/Umair.jpg",
          link: "",
          commentShort: "Frontend development and user interface architecture.",
          commentFull:
            "Developed an intuitive React frontend with focus on user experience: implemented smooth animations with Framer Motion, accessible navigation patterns, dark/light theme toggling, and offline-first capabilities. Integrated interactive maps for location services and real-time notifications, ensuring cross-browser compatibility and mobile responsiveness.",
        },
      ],
    },
  },
};

// ==================================== Core Functions ====================================
function portfolioToggleDetails(projectId) {
  const isOpening = portfolioState.activeProjectId !== projectId;

  if (isOpening) {
    openExpandedView(projectId);
  } else {
    closeExpandedView();
  }
}

function openExpandedView(projectId) {
  // Pause all videos in grid FIRST
  document.querySelectorAll(".portfolio-project-video").forEach((video) => {
    video.pause();
    video.currentTime = 0; // Reset to start
  });

  // Also pause any previously expanded video
  if (portfolioState.expandedVideo) {
    portfolioState.expandedVideo.pause();
    portfolioState.expandedVideo.currentTime = 0;
    portfolioState.expandedVideo = null;
  }

  // Update grid state
  const grid = document.getElementById("portfolio-project-grid");
  grid.classList.add("portfolio-expanded");

  // Hide all cards except the active one
  document.querySelectorAll(".portfolio-project-card").forEach((card) => {
    if (card.dataset.portfolioProjectId !== projectId) {
      card.classList.add("portfolio-inactive");
    } else {
      card.classList.add("portfolio-active");
    }
  });

  // Update state
  portfolioState.activeProjectId = projectId;

  // Load and show expanded content
  loadExpandedContent(projectId);

  // Show overlay and container
  document.getElementById("portfolio-expanded-overlay").classList.add("active");
  document.getElementById("portfolio-expanded-container").style.display =
    "flex";

  // Prevent body scroll
  document.body.style.overflow = "hidden";

  // REMOVE THIS ENTIRE BLOCK - No need to scroll to top
  // if (window.innerWidth <= 900) {
  //   window.scrollTo(0, 0);
  // }
}

function closeExpandedView() {
  // CRITICAL FIX: Stop expanded video audio BEFORE cleaning up UI
  if (portfolioState.expandedVideo) {
    portfolioState.expandedVideo.pause();
    portfolioState.expandedVideo.currentTime = 0;
    portfolioState.expandedVideo.muted = true; // Also mute it
    portfolioState.expandedVideo = null;
  }

  // Reset grid state
  const grid = document.getElementById("portfolio-project-grid");
  grid.classList.remove("portfolio-expanded");

  // Reset all cards
  document.querySelectorAll(".portfolio-project-card").forEach((card) => {
    card.classList.remove("portfolio-active", "portfolio-inactive");
  });

  // Clear expanded content
  const contentDiv = document.getElementById("portfolio-expanded-content");
  contentDiv.innerHTML = "";

  // Update state
  portfolioState.activeProjectId = null;

  // Hide overlay and container
  document
    .getElementById("portfolio-expanded-overlay")
    .classList.remove("active");
  document.getElementById("portfolio-expanded-container").style.display =
    "none";

  // Allow body scroll
  document.body.style.overflow = "";

  // Resume video playback in visible cards (muted)
  restartGridVideos();
}

function loadExpandedContent(projectId) {
  const data = portfolioState.expandedData[projectId];
  if (!data) return;

  const contentDiv = document.getElementById("portfolio-expanded-content");

  // Create HTML structure
  contentDiv.innerHTML = `
            <div class="portfolio-expanded-left">
                <h2>${data.title}</h2>
                <div class="portfolio-expanded-video-container">
                    <video class="portfolio-expanded-video" autoplay loop playsinline>
                        <source src="${data.videoSrc}" type="video/mp4">
                    </video>
                </div>
                ${
                  window.innerWidth > 900
                    ? `
                    <div class="portfolio-vertical-separator">
                        <div class="portfolio-separator-dot"></div>
                    </div>
                `
                    : ""
                }
            </div>
            <div class="portfolio-expanded-right">
                <div class="portfolio-project-timeline">
                    <span class="portfolio-start-date">${
                      data.timeline.start
                    }</span>
                    <div class="portfolio-timeline-dot"></div>
                    <span class="portfolio-end-date">${data.timeline.end}</span>
                </div>
                
                <p class="portfolio-project-description">${data.description}</p>
                
                ${
                  data.collaborators.length > 0
                    ? `
                    <div class="portfolio-collaborators-section">
                        <h3 class="portfolio-collaborators-title">
                            <i class="fas fa-users"></i> Collaborators
                        </h3>
                        ${data.collaborators
                          .map(
                            (collaborator, index) => `
                            <div class="portfolio-collaborator">
                                <a href="${
                                  collaborator.link
                                }" target="_blank" class="portfolio-collaborator-avatar">
                                    <img src="${
                                      collaborator.avatar ||
                                      "https://via.placeholder.com/60"
                                    }" alt="${collaborator.name}">
                                </a>
                                <div class="portfolio-collaborator-info">
                                    <div class="portfolio-collaborator-name">${
                                      collaborator.name
                                    }</div>
                                    <div class="portfolio-collaborator-comment portfolio-collapsed" 
                                         id="portfolio-comment-${projectId}-${index}">
                                        "${collaborator.commentShort}"
                                    </div>
                                    <div class="portfolio-collaborator-comment portfolio-full" 
                                         id="portfolio-full-comment-${projectId}-${index}" 
                                         style="display: none">
                                        "${collaborator.commentFull}"
                                    </div>
                                    <button class="portfolio-read-more-btn" 
                                            onclick="portfolioToggleComment('${projectId}-${index}')">
                                        Read more
                                    </button>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>
                `
                    : ""
                }
            </div>
        `;

  // Initialize video - Start WITH sound in expanded view
  const video = contentDiv.querySelector(".portfolio-expanded-video");
  if (video) {
    // Store reference to expanded video
    portfolioState.expandedVideo = video;

    // Start with sound (unmuted) for expanded view
    video.muted = false;

    // Add mute toggle on click
    video.addEventListener("click", function (e) {
      e.stopPropagation(); // Prevent event bubbling
      this.muted = !this.muted;

      // Add visual feedback when unmuted
      if (this.muted) {
        this.style.boxShadow = "none";
        this.title = "Click to unmute";
      } else {
        this.style.boxShadow = "0 0 20px rgba(0, 255, 238, 0.5)";
        this.title = "Click to mute";
      }
    });

    // Set initial title and visual feedback
    video.title = "Click to mute";
    video.style.boxShadow = "0 0 20px rgba(0, 255, 238, 0.5)";

    // Play with sound
    video.play().catch((e) => {
      console.log("Video autoplay prevented:", e);
      // If autoplay fails due to sound policy, set to muted and try again
      video.muted = true;
      video.title = "Click to unmute";
      video.style.boxShadow = "none";
      video.play().catch((e2) => console.log("Muted play also failed:", e2));
    });

    // Also pause video when user closes via overlay click
    video.addEventListener(
      "click",
      function (e) {
        e.stopPropagation();
      },
      true
    );
  }
}

function portfolioToggleComment(commentId) {
  const shortComment = document.getElementById(
    `portfolio-comment-${commentId}`
  );
  const fullComment = document.getElementById(
    `portfolio-full-comment-${commentId}`
  );
  const button = document.querySelector(`button[onclick*="${commentId}"]`);

  if (!shortComment || !fullComment || !button) return;

  if (fullComment.style.display === "none") {
    shortComment.style.display = "none";
    fullComment.style.display = "block";
    button.textContent = "Show less";
  } else {
    shortComment.style.display = "block";
    fullComment.style.display = "none";
    button.textContent = "Read more";
  }
}

function restartGridVideos() {
  // Clear any existing observers
  if (window.portfolioVideoObserver) {
    window.portfolioVideoObserver.disconnect();
  }

  // Create new observer for grid videos
  window.portfolioVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector(".portfolio-project-video");
        if (video) {
          // Reset video to muted for grid view
          video.muted = true;

          if (entry.isIntersecting) {
            video.play().catch((e) => {
              // Autoplay was prevented
              console.log("Grid video autoplay prevented");
            });
          } else {
            video.pause();
            video.currentTime = 0; // Reset to start
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll(".portfolio-project-card").forEach((card) => {
    window.portfolioVideoObserver.observe(card);
  });
}

// ==================================== Event Listeners ====================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize grid videos
  restartGridVideos();

  // Close button event
  document
    .getElementById("portfolio-close-expanded")
    .addEventListener("click", function (e) {
      e.stopPropagation();
      closeExpandedView();
    });

  // Overlay click to close
  document
    .getElementById("portfolio-expanded-overlay")
    .addEventListener("click", closeExpandedView);

  // Escape key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && portfolioState.activeProjectId) {
      closeExpandedView();
    }
  });

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (portfolioState.activeProjectId) {
        // Reload content to adapt to new layout
        loadExpandedContent(portfolioState.activeProjectId);
      }
    }, 250);
  });

  // Also clean up on page visibility change
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && portfolioState.expandedVideo) {
      // If user switches tabs, pause the video
      portfolioState.expandedVideo.pause();
    }
  });
});

// ==================================== Video Optimization ====================================
// Lazy load videos when they come into view
const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const source = video.querySelector("source[data-src]");
        if (source) {
          source.src = source.dataset.src;
          video.load();
          videoObserver.unobserve(video);
        }
      }
    });
  },
  { rootMargin: "50px" }
);

// Mark videos for lazy loading (optional optimization)
document
  .querySelectorAll(".portfolio-project-video[data-lazy]")
  .forEach((video) => {
    videoObserver.observe(video);
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

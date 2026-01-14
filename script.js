document.addEventListener("DOMContentLoaded", () => {
  const nameToType = "MUHAMMAD MUSTAQEEM";
  const typingElement = document.getElementById("intro-typing-text");
  const logoText = document.querySelector(".logo-text");
  const header = document.getElementById("main-header");
  const homeSection = document.getElementById("home");
  const introOverlay = document.getElementById("intro-overlay");
  const navLinks = document.querySelectorAll(".nav-link");

  // Create Energy Floor
  const floor = document.createElement('div');
  floor.className = 'energy-floor';
  introOverlay.appendChild(floor);

  // Function to create random data streams
  function createStream() {
    const stream = document.createElement('div');
    stream.className = 'stream';
    
    const leftPos = Math.random() * 100;
    const duration = Math.random() * 2 + 2; // Fast and cinematic
    const height = Math.random() * 100 + 50; // Random height 50-150px
    
    // 4. KEY FOR 3D: Randomize the horizontal "depth"
    // Higher value = closer to user, Lower value = farther back
    const zDepth = Math.random() * 800 - 400; 
    
    stream.style.left = `${leftPos}%`;
    stream.style.height = `${height}px`;
    stream.style.animationDuration = `${duration}s`;
    
    // Use CSS custom property for Z depth to avoid transform conflict
    stream.style.setProperty('--z-depth', `${zDepth}px`);
    
    // Adjust opacity based on depth (farther = dimmer)
    stream.style.setProperty('--stream-opacity', (zDepth + 400) / 800);

    introOverlay.appendChild(stream);
    
    setTimeout(() => stream.remove(), duration * 1000);
  }

  // Initial burst of streams
  for(let i=0; i<30; i++) createStream();
  // Continuous generation
  const streamInterval = setInterval(createStream, 150);

  let charIndex = 0;

  function typeEffect() {
    if (charIndex < nameToType.length) {
      typingElement.textContent += nameToType.charAt(charIndex);
      charIndex++;
      // Cinematic slow speed
      setTimeout(typeEffect, Math.random() * (400 - 250) + 250);
    } else {
      setTimeout(startDirectFlow, 1000);
    }
  }

  function startDirectFlow() {
    clearInterval(streamInterval);
    typingElement.style.borderRight = "none";
    
    // Calculate DIRECT diagonal path to top-left logo
    const startRect = typingElement.getBoundingClientRect();
    const endRect = logoText.getBoundingClientRect();

    const moveX = endRect.left - startRect.left;
    const moveY = endRect.top - startRect.top;
    const scale = endRect.height / startRect.height;

    // Movement animation
    typingElement.style.transition = "transform 1.4s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.4s ease 1.2s";
    typingElement.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;

    // Fade out overlay
    setTimeout(() => {
      introOverlay.style.transition = "opacity 1s ease";
      introOverlay.style.opacity = "0";
      header.classList.add("flow-active");
      homeSection.classList.add("flow-active");

      navLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
      });

      // Trigger the Home Section Showcase
      setTimeout(triggerHomeCinematic, 800);
    }, 800);

    setTimeout(() => {
      logoText.classList.remove("anchor-hidden");
      introOverlay.style.display = "none";
    }, 1800);
  }

  function triggerHomeCinematic() {
    // Step 1: Slide Left and Right content in
    homeSection.classList.add("content-visible");

    // Step 2: Stagger the bottom elements for smoothness
    const bottomSelectors = [
      ".centered-stats",
      ".centered-icons",
      ".cv-buttons-wrapper",
      ".social2",
    ];

    bottomSelectors.forEach((selector, index) => {
      const el = document.querySelector(selector);
      if (el) {
        // They start sliding up after the side-panels are halfway in
        el.style.transitionDelay = `${0.4 + index * 0.15}s`;
      }
    });
  }

  logoText.classList.add("anchor-hidden");
  typeEffect();
});

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

// ============== Home Section Animation ====================
// Home entrance is now handled by triggerHomeCinematic() in the intro flow above

// =========================== image slider ==========================

// Minimal Auto-play Carousel
class AutoCarousel {
  constructor(container) {
    this.container = container;
    this.slides = Array.from(container.querySelectorAll(".slide"));
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.interval = null;
    this.delay = 4000; // 4 seconds per slide
    this.isAnimating = false;

    if (this.totalSlides > 1) {
      this.init();
    }
  }

  init() {
    // Initialize first slide
    this.updateSlides();

    // Start auto-play
    this.start();

    // Pause on hover (optional - remove if you want continuous)
    this.container.addEventListener("mouseenter", () => this.stop());
    this.container.addEventListener("mouseleave", () => this.start());
  }

  updateSlides() {
    // Remove all classes
    this.slides.forEach((slide) => {
      slide.classList.remove("active", "prev", "next");
    });

    // Calculate indices
    const prevIndex =
      (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    const nextIndex = (this.currentIndex + 1) % this.totalSlides;

    // Apply classes
    if (this.slides[prevIndex]) {
      this.slides[prevIndex].classList.add("prev");
    }

    this.slides[this.currentIndex].classList.add("active");

    if (this.slides[nextIndex]) {
      this.slides[nextIndex].classList.add("next");
    }
  }

  next() {
    if (this.isAnimating || this.totalSlides <= 1) return;

    this.isAnimating = true;
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlides();

    // Reset animation flag
    setTimeout(() => {
      this.isAnimating = false;
    }, 800);
  }

  start() {
    if (this.interval || this.totalSlides <= 1) return;

    this.interval = setInterval(() => {
      this.next();
    }, this.delay);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  destroy() {
    this.stop();
    this.container.removeEventListener("mouseenter", () => this.stop());
    this.container.removeEventListener("mouseleave", () => this.start());
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  const carouselContainer = document.querySelector(".carousel-container");

  if (carouselContainer) {
    window.imageCarousel = new AutoCarousel(carouselContainer);
  }
});

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

  // Reusing the same Cubic Bezier as the Home entrance for the slide move
  slider.style.transition = "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
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

// Education Section Scroll-Reveal Observer
function initEducationObserver() {
  const educationSection = document.getElementById("education");
  if (!educationSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Trigger the cinematic slide-in
          educationSection.classList.add("active");
          // Stop observing once triggered
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  ); // Trigger when 20% of section is visible

  observer.observe(educationSection);
}

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initEducationObserver(); // Start the scroll-reveal logic

  // Start auto-sliding every 4 seconds (slower for better readability)
  setInterval(autoSlide, 4000);

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
  expandedVideo: null,
  expandedData: {
    1: {
      title: "DSA Insight Website",
      videoSrc: "Pics/DSA-Web.mp4",
      posterSrc: "Pics/DSA-Poster.png", // ADDED POSTER PATH
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
      description:
        "A dynamic React-based web application that brings data structures and algorithms to life through interactive visual animations. Users can explore how core structures such as stacks, queues, linked lists, trees, and graphs behave step-by-step, with intuitive controls to play, pause, and step through operations. This tool transforms abstract concepts into visual learning experiences, making it easier to grasp algorithm execution flow and state changes in real time.",
      collaborators: [
        {
          name: "Abdullah Umar",
          avatar: "Pics/Abdullah_Umar.png",
          link: "https://www.linkedin.com/in/abdullah-umar-990562352/",
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
      posterSrc: "Pics/Flood-Aid-Poster.png", // ADDED POSTER PATH
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
      description:
        "A responsive, full-stack web platform to support flood relief coordination and assistance efforts. Built with a React frontend, C# backend API, and MongoDB database, the site enables users to submit and view requests for aid, connect with volunteers or helpers, and access essential information during flood emergencies. The system streamlines relief efforts by organizing real-time requests, fostering community support, and ensuring effective resource distribution when every moment counts.",
      collaborators: [
        {
          name: "Farhan Shakeel",
          avatar: "Pics/Farhan_Shakeel.png",
          link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
          commentShort: "Backend development and database architecture.",
          commentFull:
            "Developed the C# backend API with secure authentication and data validation. Architected the MongoDB database schema for optimal performance and scalability, implementing geospatial queries for location-based services.",
        },
        {
          name: "M Umair",
          avatar: "Pics/Muhammad_Umair.png",
          link: "https://www.linkedin.com/in/muhammad-umair-03037b338/",
          commentShort: "Frontend development and user interface architecture.",
          commentFull:
            "Developed an intuitive React frontend with focus on user experience: implemented smooth animations with Framer Motion, accessible navigation patterns, dark/light theme toggling, and offline-first capabilities. Integrated interactive maps for location services and real-time notifications, ensuring cross-browser compatibility and mobile responsiveness.",
        },
      ],
    },
    3: {
      title: "Collaborative White Board",
      videoSrc: "Pics/Khush Naseeb.mp4",
      posterSrc: "Pics/Whiteboard-Poster.png",
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
      description:
        "A Windows desktop application built with C# and .NET Framework, designed for real-time collaborative whiteboarding. Users can draw, write, and share ideas simultaneously, making it ideal for team collaboration, brainstorming sessions, and interactive presentations. The system supports multiple users, session management, and intuitive drawing tools, providing a seamless and responsive experience on Windows platforms.",
      collaborators: [
        {
          name: "Adil Ur Rehman",
          avatar: "Pics/Adil.png",
          link: "https://www.linkedin.com/in/adilurrehmanofficial/",
          commentShort: "Frontend development and UI architecture.",
          commentFull:
            "Developed the Windows Forms frontend with focus on usability and responsiveness: implemented drawing tools, real-time collaboration features, session management, and an intuitive user interface. Ensured smooth performance, keyboard shortcuts, and an accessible, user-friendly experience for desktop users.",
        },
        {
          name: "Farhan Shakeel",
          avatar: "Pics/Farhan_Shakeel.png",
          link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
          commentShort: "Backend logic and application architecture.",
          commentFull:
            "Implemented the C# backend logic to handle real-time updates, user sessions, and data synchronization across multiple clients. Designed an efficient architecture using .NET Framework for performance, stability, and scalability of the collaborative features.",
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
  // Pause grid videos
  document.querySelectorAll(".portfolio-project-video").forEach((video) => {
    video.pause();
  });

  if (portfolioState.expandedVideo) {
    portfolioState.expandedVideo.pause();
    portfolioState.expandedVideo = null;
  }

  const grid = document.getElementById("portfolio-project-grid");
  grid.classList.add("portfolio-expanded");

  document.querySelectorAll(".portfolio-project-card").forEach((card) => {
    if (card.dataset.portfolioProjectId !== projectId) {
      card.classList.add("portfolio-inactive");
    } else {
      card.classList.add("portfolio-active");
    }
  });

  portfolioState.activeProjectId = projectId;
  loadExpandedContent(projectId);

  document.getElementById("portfolio-expanded-overlay").classList.add("active");
  document.getElementById("portfolio-expanded-container").style.display =
    "flex";
  document.body.style.overflow = "hidden";
}

function closeExpandedView() {
  if (portfolioState.expandedVideo) {
    portfolioState.expandedVideo.pause();
    portfolioState.expandedVideo = null;
  }

  const grid = document.getElementById("portfolio-project-grid");
  grid.classList.remove("portfolio-expanded");

  document.querySelectorAll(".portfolio-project-card").forEach((card) => {
    card.classList.remove("portfolio-active", "portfolio-inactive");
  });

  document.getElementById("portfolio-expanded-content").innerHTML = "";
  portfolioState.activeProjectId = null;
  document
    .getElementById("portfolio-expanded-overlay")
    .classList.remove("active");
  document.getElementById("portfolio-expanded-container").style.display =
    "none";
  document.body.style.overflow = "";

  restartGridVideos();
}

function loadExpandedContent(projectId) {
  const data = portfolioState.expandedData[projectId];
  if (!data) return;

  const contentDiv = document.getElementById("portfolio-expanded-content");

  contentDiv.innerHTML = `
            <div class="portfolio-expanded-left">
                <h2>${data.title}</h2>
                <div class="portfolio-expanded-video-container">
                    <video class="portfolio-expanded-video" autoplay loop playsinline poster="${
                      data.posterSrc
                    }">
                        <source src="${data.videoSrc}" type="video/mp4">
                    </video>
                </div>
                ${
                  window.innerWidth > 900
                    ? `<div class="portfolio-vertical-separator"><div class="portfolio-separator-dot"></div></div>`
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
                        <h3 class="portfolio-collaborators-title"><i class="fas fa-users"></i> Collaborators</h3>
                        ${data.collaborators
                          .map(
                            (collab, i) => `
                            <div class="portfolio-collaborator">
                                <a href="${
                                  collab.link
                                }" target="_blank" class="portfolio-collaborator-avatar">
                                    <img src="${
                                      collab.avatar ||
                                      "https://via.placeholder.com/60"
                                    }" alt="${collab.name}">
                                </a>
                                <div class="portfolio-collaborator-info">
                                    <div class="portfolio-collaborator-name">${
                                      collab.name
                                    }</div>
                                    <div class="portfolio-collaborator-comment portfolio-collapsed" id="portfolio-comment-${projectId}-${i}">"${
                              collab.commentShort
                            }"</div>
                                    <div class="portfolio-collaborator-comment portfolio-full" id="portfolio-full-comment-${projectId}-${i}" style="display: none">"${
                              collab.commentFull
                            }"</div>
                                    <button class="portfolio-read-more-btn" onclick="portfolioToggleComment('${projectId}-${i}')">Read more</button>
                                </div>
                            </div>
                        `
                          )
                          .join("")}
                    </div>`
                    : ""
                }
            </div>
        `;

  const video = contentDiv.querySelector(".portfolio-expanded-video");
  if (video) {
    portfolioState.expandedVideo = video;
    video.muted = false; // Expanded view plays with audio
    video.play().catch(() => {
      video.muted = true; // Fallback if browser blocks sound
      video.play();
    });
  }
}

function portfolioToggleComment(commentId) {
  const short = document.getElementById(`portfolio-comment-${commentId}`);
  const full = document.getElementById(`portfolio-full-comment-${commentId}`);
  const btn = document.querySelector(`button[onclick*="${commentId}"]`);
  if (full.style.display === "none") {
    short.style.display = "none";
    full.style.display = "block";
    btn.textContent = "Show less";
  } else {
    short.style.display = "block";
    full.style.display = "none";
    btn.textContent = "Read more";
  }
}

function restartGridVideos() {
  if (window.portfolioVideoObserver) window.portfolioVideoObserver.disconnect();

  window.portfolioVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector(".portfolio-project-video");
        if (video) {
          video.muted = true;

          // ONLY play if screen is wider than 600px
          if (entry.isIntersecting && window.innerWidth > 600) {
            video.play().catch(() => console.log("Grid playback blocked"));
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      });
    },
    { threshold: 0.5 }
  );

  document
    .querySelectorAll(".portfolio-project-card")
    .forEach((card) => window.portfolioVideoObserver.observe(card));
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

// ==================================== 3D Background & Animations ====================================
document.addEventListener("DOMContentLoaded", () => {
  // Check if THREE is loaded
  if (typeof THREE === "undefined") return;

  const container = document.getElementById("canvas-container");
  if (!container) return;

  // Scene Setup
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Particles (Digital Dust)
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15;
  }

  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
  );
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.015,
    color: 0x00f3ff,
    transparent: true,
    opacity: 0.8,
  });
  const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particleMesh);

  // Central Hologram (A wireframe dodecahedron)
  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const material = new THREE.MeshBasicMaterial({
    color: 0x00f3ff,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
  });
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  camera.position.z = 5;

  // Mouse Movement Effect
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  // Animation Loop
  function animate() {
    requestAnimationFrame(animate);

    // Smooth Camera Follow
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    particleMesh.rotation.y += 0.001;
    sphere.rotation.x += 0.002;

    renderer.render(scene, camera);
  }

  animate();

  // Handle Resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Scroll Animations with GSAP
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to(camera.position, {
      z: 2,
      scrollTrigger: {
        trigger: "#education", // Mapped from #about in index2.html
        start: "top bottom",
        end: "top top",
        scrub: 1,
      },
    });

    gsap.to(sphere.rotation, {
      y: Math.PI * 2,
      scrollTrigger: {
        trigger: "body", // Mapped to body to cover full page scroll
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
      },
    });
  }
});

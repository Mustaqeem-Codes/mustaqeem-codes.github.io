// ===== GLOBAL STATE =====
const state = {
  currentCategory: null,
  videoModalOpen: false,
};

// ===== DOM ELEMENTS =====
const foldersView = document.getElementById("foldersView");
const projectsView = document.getElementById("projectsView");
const projectsBackBtn = document.getElementById("projectsBackBtn");
const categoryTitle = document.getElementById("categoryTitle");
const projectsGrid = document.getElementById("projectsGrid");
const videoModal = document.getElementById("videoModal");
const closeModal = document.getElementById("closeModal");
const modalVideo = document.querySelector(".modal-video");
const sectionTitle = document.querySelector(".section-title");

// ===== PROJECT DATA =====
/*
    TO ADD NEW PROJECT:
    1. Choose a category (web, desktop, console, mobile, games, ai)
    2. Add a new object to the corresponding array
    3. Update folder count in HTML
    4. Follow the structure below
    */

const projectsData = {
  web: [
    {
      id: "web-1",
      title: "DSA Insight Website",
      description:
        "A dynamic React-based web application that brings data structures and algorithms to life through interactive visual animations.",
      techStack: [
        { type: "icon", class: "devicon-react-original", name: "React" },
        { type: "icon", class: "devicon-javascript-plain", name: "JavaScript" },
        { type: "icon", class: "devicon-html5-plain", name: "HTML5" },
        { type: "icon", class: "devicon-css3-plain", name: "CSS3" },
        { type: "icon", class: "devicon-github-original", name: "GitHub" },
      ],
      videoSrc: "Pics/DSA-Web.mp4",
      poster: "Pics/DSA-Poster.png",
      liveDemo: "https://dsa-insight.vercel.app/",
      github: "https://github.com/Mustaqeem-Codes/DSA_Insight",
      downloadUrl: null, // No download for web projects
      collaborators: [
        {
          name: "Abdullah Umar",
          avatar: "Pics/Abdullah_Umar.png",
          link: "https://www.linkedin.com/in/abdullah-umar-990562352/",
          role: "UI/UX Design & Frontend",
        },
      ],
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
    },
    {
      id: "web-2",
      title: "Flood Aid Website",
      description:
        "A responsive, full-stack web platform to support flood relief coordination and assistance efforts.",
      techStack: [
        { type: "icon", class: "devicon-react-original", name: "React" },
        { type: "icon", class: "devicon-csharp-plain", name: "C#" },
        { type: "icon", class: "devicon-mongodb-plain", name: "MongoDB" },
        { type: "icon", class: "devicon-css3-plain", name: "CSS3" },
        { type: "icon", class: "devicon-nodejs-plain", name: "Node.js" },
        { type: "icon", class: "devicon-express-original", name: "Express" },
      ],
      videoSrc: "Pics/DSA-Web.webm",
      poster: "Pics/Flood-Aid-Poster.png",
      liveDemo: "https://flood-aid-94zg.vercel.app/",
      github: "https://github.com/FarhanShakeel25/Flood_Aid/",
      downloadUrl: null,
      collaborators: [
        {
          name: "Farhan Shakeel",
          avatar: "Pics/Farhan_Shakeel.png",
          link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
          role: "Backend Developer",
        },
        {
          name: "Muhammad Umair",
          avatar: "Pics/Muhammad_Umair.png",
          link: "https://www.linkedin.com/in/muhammad-umair-03037b338/",
          role: "Frontend Developer",
        },
      ],
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
    },
  ],
  desktop: [
    {
      id: "desktop-1",
      title: "Collaborative White Board",
      description:
        "A Windows desktop application for real-time collaborative whiteboarding with team collaboration features.",
      techStack: [
        { type: "icon", class: "devicon-csharp-plain", name: "C#" },
        { type: "image", src: "Pics/WinForm.png", name: "WinForms" },
        { type: "icon", class: "devicon-dot-net-plain", name: ".NET" },
        { type: "icon", class: "fas fa-cubes", name: "OOP" },
      ],
      videoSrc: "Pics/DSA-Web.webm",
      poster: "Pics/Whiteboard-Poster.png",
      liveDemo: null, // No live demo for desktop apps
      github: "#",
      downloadUrl:
        "https://github.com/Mustaqeem-Codes/White_Board/raw/main/WhiteBoard.zip",
      collaborators: [
        {
          name: "Adil Ur Rehman",
          avatar: "Pics/Adil.png",
          link: "https://www.linkedin.com/in/adilurrehmanofficial/",
          role: "Frontend Developer",
        },
        {
          name: "Farhan Shakeel",
          avatar: "Pics/Farhan_Shakeel.png",
          link: "https://www.linkedin.com/in/farhan-shakeel-47b505349/",
          role: "Backend Developer",
        },
      ],
      timeline: {
        start: "November 2025",
        end: "January 2026",
      },
    },
    {
      id: "desktop-2",
      title: "Job Portal Management System",
      description:
        "Windows Forms application for managing job portals with role-based access and real-time tracking.",
      techStack: [
        { type: "icon", class: "fas fa-windows", name: "Windows" },
        { type: "icon", class: "fas fa-server", name: "Server" },
        { type: "icon", class: "fas fa-object-group", name: "UI Design" },
      ],
      videoSrc: "Pics/DSA-Web.webm",
      poster: "Pics/Job(1).jpg",
      liveDemo: null,
      github: "https://github.com/Mustaqeem-Codes/Job_Portal_Management_System",
      downloadUrl:
        "https://github.com/Mustaqeem-Codes/Job_Portal_Management_System/raw/main/Job_Portal_Management_System.zip",
      collaborators: [],
      timeline: {
        start: "September 2024",
        end: "December 2024",
      },
    },
  ],
  console: [
    {
      id: "console-1",
      title: "Number Guess Game",
      description:
        "Console-based number guessing game with scoring, authentication, and global leaderboard.",
      techStack: [
        { type: "icon", class: "fab fa-python", name: "Python" },
        { type: "icon", class: "fas fa-file-code", name: "Console" },
        { type: "icon", class: "fas fa-trophy", name: "Scoring" },
      ],
      videoSrc: "Pics/DSA-Web.webm",
      poster: "Pics/NGG.png",
      liveDemo: null,
      github: "https://github.com/Mustaqeem-Codes/Number_Guess_Game",
      downloadUrl:
        "https://github.com/Mustaqeem-Codes/Number_Guess_Game/raw/main/Number_Guess_Game.zip",
      collaborators: [],
      timeline: {
        start: "July 2024",
        end: "August 2024",
      },
    },
    {
      id: "console-2",
      title: "Airline Management System",
      description:
        "Console application for comprehensive airline operations management with robust data handling.",
      techStack: [
        { type: "icon", class: "fas fa-code", name: "C#" },
        { type: "icon", class: "fas fa-terminal", name: "Console" },
        { type: "icon", class: "fas fa-database", name: "Database" },
      ],
      videoSrc: "Pics/DSA-Web.webm",
      poster: "Pics/airline.jpg",
      liveDemo: null,
      github: "https://github.com/Mustaqeem-Codes/Airline_Management_System",
      downloadUrl:
        "https://github.com/Mustaqeem-Codes/Airline_Management_System/raw/main/AMS.zip",
      collaborators: [],
      timeline: {
        start: "May 2024",
        end: "June 2024",
      },
    },
  ],
  mobile: [],
  games: [],
  ai: [],
};

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", function () {
  initializeAnimations();
  setupEventListeners();

  // Help with autoplay policies
  document.addEventListener(
    "click",
    function () {
      document.querySelectorAll(".project-video").forEach((video) => {
        if (video.paused) {
          video.play().catch(() => {
            // Silently handle autoplay errors
          });
        }
      });
    },
    { once: true },
  );
});

// ===== ANIMATIONS =====
function initializeAnimations() {
  // Animate folders on load
  const folderCards = document.querySelectorAll(".folder-card");
  folderCards.forEach((card) => {
    card.classList.add("animate-in");
  });

  // Scroll animation for folders and cards
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe folders
  folderCards.forEach((card) => observer.observe(card));

  // Store observer for later use
  window.projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Folder click handlers
  document.querySelectorAll(".folder-card").forEach((folder) => {
    folder.addEventListener("click", function () {
      const category = this.dataset.category;
      const count = parseInt(this.dataset.count);

      if (count === 0) {
        showComingSoonMessage(this);
        return;
      }

      openProjectsCategory(category);
    });
  });

  // Back button
  projectsBackBtn.addEventListener("click", closeProjectsCategory);

  // Video modal
  closeModal.addEventListener("click", closeVideoModal);
  videoModal.addEventListener("click", function (e) {
    if (e.target === videoModal) {
      closeVideoModal();
    }
  });

  // Escape key to close modals
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (state.videoModalOpen) {
        closeVideoModal();
      } else if (state.currentCategory) {
        closeProjectsCategory();
      }
    }
  });
}

// ===== FOLDER FUNCTIONS =====
function openProjectsCategory(category) {
  state.currentCategory = category;

  // Hide section title
  sectionTitle.style.display = "none";

  // Update UI
  updateCategoryTitle(category);
  loadProjects(category);

  // Animate transition
  foldersView.classList.add("hidden");
  setTimeout(() => {
    projectsView.classList.add("active");
    animateProjectsGrid();
  }, 300);

  // Scroll to top of section
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
}

function closeProjectsCategory() {
  projectsView.classList.remove("active");
  setTimeout(() => {
    foldersView.classList.remove("hidden");
    sectionTitle.style.display = "block";
  }, 300);

  state.currentCategory = null;

  // Scroll to top of section
  document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
}

function updateCategoryTitle(category) {
  const categoryNames = {
    web: "Web Projects",
    desktop: "Desktop Applications",
    console: "Console Applications",
    mobile: "Mobile Applications",
    games: "Game Development",
    ai: "AI/ML Projects",
  };

  categoryTitle.textContent = categoryNames[category];

  // Update category color
  const colorMap = {
    web: "#00ffee",
    desktop: "#9d4edd",
    console: "#38b000",
    mobile: "#ff9e00",
    games: "#ff006e",
    ai: "#ff0054",
  };

  document.documentElement.style.setProperty(
    "--folder-color",
    colorMap[category],
  );
  document.documentElement.style.setProperty(
    "--folder-glow",
    `${colorMap[category]}33`,
  );
}

function showComingSoonMessage(folder) {
  const originalColor =
    getComputedStyle(folder).getPropertyValue("--folder-color");

  // Visual feedback
  folder.style.transform = "scale(0.95)";
  folder.style.boxShadow = `0 0 30px ${originalColor}`;

  setTimeout(() => {
    folder.style.transform = "";
    folder.style.boxShadow = "";
  }, 300);
}

// ===== PROJECT FUNCTIONS =====
function loadProjects(category) {
  // Clear existing projects
  projectsGrid.innerHTML = "";
  projectsGrid.classList.remove("animate-in");

  // Load projects for this category
  const projects = projectsData[category] || [];

  if (projects.length === 0) {
    showEmptyState();
    return;
  }

  // Create project cards
  projects.forEach((project) => {
    const projectCard = createProjectCard(project);
    projectsGrid.appendChild(projectCard);
  });

  // Setup video autoplay and hover effects
  setupVideoEffects();
}

function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "project-card";
  card.dataset.projectId = project.id;

  // Create tech stack HTML
  const techStackHTML = project.techStack
    .map((tech) => {
      if (tech.type === "image") {
        return `
                        <div class="tech-icon">
                            <img src="${tech.src}" alt="${tech.name}" />
                            <span>${tech.name}</span>
                        </div>
                    `;
      } else {
        return `
                        <div class="tech-icon">
                            <i class="${tech.class}"></i>
                            <span>${tech.name}</span>
                        </div>
                    `;
      }
    })
    .join("");

  // Create collaborators HTML - FIXED: Each collaborator is a clickable link
  // Create collaborators HTML - shows description for solo projects
  const collaboratorsHTML =
    project.collaborators && project.collaborators.length > 0
      ? project.collaborators
          .map(
            (collab) => `
        <a href="${collab.link}" target="_blank" class="collaborator" title="View ${collab.name}'s LinkedIn">
            <div class="collaborator-avatar">
                <img src="${collab.avatar}" alt="${collab.name}" />
            </div>
            <div class="collaborator-info">
                <div class="collaborator-name">${collab.name}</div>
                <div class="collaborator-role">${collab.role}</div>
            </div>
        </a>
    `,
          )
          .join("")
      : `
        <div class="no-collaborators">
            <div class="no-collab-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="no-collab-text">
                <h4>Solo Project</h4>
                <p>Developed independently with full-stack implementation.</p>
            </div>
        </div>
    `;

  // Determine button configuration
  const hasLiveDemo = project.liveDemo && project.liveDemo !== "#";
  const hasDownload = project.downloadUrl;

  // Create buttons HTML (NO GitHub button - we have GitHub corner)
  const buttonsHTML = `
                ${
                  hasLiveDemo
                    ? `
                    <a href="${project.liveDemo}" target="_blank" class="action-btn btn-live">
                        <i class="fas fa-external-link-alt"></i> Live Demo
                    </a>
                `
                    : ""
                }
                
                ${
                  hasDownload
                    ? `
                    <button class="action-btn btn-download download-btn" data-url="${project.downloadUrl}">
                        <i class="fas fa-download"></i> Download
                    </button>
                `
                    : ""
                }
                
                <button class="action-btn btn-watch watch-video-btn" data-video="${project.videoSrc}">
                    <i class="fas fa-play"></i> Watch Video
                </button>
            `;

  card.innerHTML = `
                <!-- Video Section - FIXED: Added autoplay attribute -->
                <div class="project-video-container">
                    <video class="project-video" muted loop playsinline autoplay preload="auto" poster="${project.poster}">
                        <source src="${project.videoSrc}" type="video/mp4" />
                    </video>
                </div>
                
                <!-- GitHub Corner (Top Right) -->
                ${
                  project.github && project.github !== "#"
                    ? `
                    <a href="${project.github}" target="_blank" class="github-corner" aria-label="View on GitHub">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z">
                            </path>
                        </svg>
                    </a>
                `
                    : ""
                }
                
                <!-- Card Info (Visible by default - EXACT STATIC LAYOUT) -->
                <div class="project-info">
                    <h3 class="project-title">${project.title}</h3>
                    <div class="tech-stack">
                        ${techStackHTML}
                    </div>
                    <div class="project-description">
                        ${project.description}
                    </div>
                </div>
                
                <!-- Hover Section (Hidden by default - Gradient background like static cards) -->
<div class="project-hover">
    <div class="hover-content">
        <!-- Title at top of hover content -->
        <h3 class="hover-title">${project.title}</h3>
        
        <!-- Collaborators Section with heading - Clickable links -->
        <div class="hover-section">
            <div class="hover-section-title">
                <i class="fas fa-users"></i>
                <span>Collaborators</span>
            </div>
            <div class="collaborators">
                ${collaboratorsHTML}
            </div>
        </div>
        
        <!-- Action Buttons at BOTTOM -->
        <div class="action-buttons">
            ${buttonsHTML}
        </div>
    </div>
</div>
                        
                        <!-- Collaborators Section with heading - FIXED: Clickable links -->
                        <div class="hover-section">
                            <div class="hover-section-title">
                                <i class="fas fa-users"></i>
                                <span>Collaborators</span>
                            </div>
                            <div class="collaborators">
                                ${collaboratorsHTML}
                            </div>
                        </div>
                        
                        <!-- Action Buttons at BOTTOM -->
                        <div class="action-buttons">
                            ${buttonsHTML}
                        </div>
                    </div>
                </div>
            `;

  // Add event listeners to buttons
  setTimeout(() => {
    const watchBtn = card.querySelector(".watch-video-btn");
    if (watchBtn) {
      watchBtn.addEventListener("click", () =>
        openVideoModal(project.videoSrc),
      );
    }

    const downloadBtn = card.querySelector(".download-btn");
    if (downloadBtn) {
      downloadBtn.addEventListener("click", handleDownload);
    }
  }, 100);

  // Observe for animations
  if (window.projectObserver) {
    window.projectObserver.observe(card);
  }

  return card;
}

function animateProjectsGrid() {
  setTimeout(() => {
    projectsGrid.classList.add("animate-in");

    // Animate individual cards
    const cards = projectsGrid.querySelectorAll(".project-card");
    cards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;
    });
  }, 100);
}

function showEmptyState() {
  projectsGrid.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <div style="font-size: 4rem; margin-bottom: 20px; opacity: 0.5;">📂</div>
                    <h3 style="color: var(--text-color); margin-bottom: 10px;">No Projects Yet</h3>
                    <p style="color: var(--portfolio-muted-text); max-width: 400px; margin: 0 auto;">
                        Projects in this category are coming soon. Stay tuned!
                    </p>
                </div>
            `;
  projectsGrid.classList.add("animate-in");
}

function setupVideoEffects() {
  const videos = document.querySelectorAll(".project-video");

  // Autoplay all videos on load (muted)
  videos.forEach((video) => {
    video.muted = true; // Always muted
    video.play().catch((e) => {
      // If autoplay fails, it's okay
      console.log("Initial autoplay blocked");
    });
  });

  // Remove hover unmute - keep videos always muted
  document.querySelectorAll(".project-card").forEach((card) => {
    const video = card.querySelector(".project-video");
    if (!video) return;

    // REMOVE hover event listeners completely
    // No hover effects on videos - they just keep playing
  });
}

// ===== VIDEO MODAL FUNCTIONS =====
function openVideoModal(videoSrc) {
  state.videoModalOpen = true;

  // Set modal video source
  modalVideo.src = videoSrc;
  modalVideo.muted = false; // Unmute for modal

  // Show modal
  videoModal.classList.add("active");

  // Play modal video
  setTimeout(() => {
    modalVideo.play().catch((e) => {
      console.log("Modal video autoplay prevented:", e);
      modalVideo.controls = true;
    });
  }, 300);

  document.body.style.overflow = "hidden";
}

function closeVideoModal() {
  state.videoModalOpen = false;

  // Pause and reset modal video
  modalVideo.pause();
  modalVideo.src = "";
  modalVideo.controls = false;

  // Hide modal
  videoModal.classList.remove("active");

  // Restore body scroll
  document.body.style.overflow = "";
}

// ===== DOWNLOAD FUNCTION =====
function handleDownload(e) {
  const url = e.currentTarget.dataset.url;
  if (!url) return;

  const btn = e.currentTarget;
  const originalHTML = btn.innerHTML;

  // Visual feedback
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Downloading...';
  btn.style.opacity = "0.8";
  btn.disabled = true;

  // Create download link
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Reset button after delay
  setTimeout(() => {
    btn.innerHTML = '<i class="fas fa-check"></i> Downloaded!';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.opacity = "1";
      btn.disabled = false;
    }, 2000);
  }, 1500);
}

// ===== WINDOW RESIZE HANDLER =====
let resizeTimeout;
window.addEventListener("resize", function () {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-initialize animations on resize
    if (state.currentCategory) {
      const cards = projectsGrid.querySelectorAll(".project-card");
      cards.forEach((card) => {
        card.classList.remove("animate-in");
      });

      // Re-trigger animations
      setTimeout(() => {
        cards.forEach((card, index) => {
          card.style.animationDelay = `${index * 0.1}s`;
          card.classList.add("animate-in");
        });
      }, 100);
    }
  }, 250);
});

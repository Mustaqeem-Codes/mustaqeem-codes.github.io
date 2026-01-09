// ============================================
// CONFIGURATION & CONSTANTS
// ============================================
const CONFIG = {
  pdfWorkerSrc:
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js",
  maxZoom: 200,
  minZoom: 50,
  defaultZoom: 100,
  zoomStep: 10,
  debounceDelay: 300,
  animationDuration: 1500,
  localStorageKeys: {
    analyticsConsent: "analyticsConsent",
    lastViewedCourse: "lastViewedCourse",
    zoomLevel: "notesZoomLevel",
  },
};

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfWorkerSrc;

// ============================================
// COURSE DATA WITH UPDATED LINEAR ALGEBRA LINK
// ============================================
const COURSES = [
  {
    id: "la",
    title: "LINEAR ALGEBRA",
    subtitle: "Systems of Linear Equations, Matrix Theory, Vector Spaces, Linear Transformations, Eigen Theory, Applications of Linear Algebra",
    filename: "Linear Algebra.pdf",
    size: "24.7 MB",
    color: "#00ffff",
    pdfUrl:
      "https://github.com/Mustaqeem-Codes/Academic_Notes/raw/main/Linear%20Algebra%20.pdf",
    description:
      "Linear algebra concepts including matrix operations, vector spaces, eigenvalues and eigenvectors.",
    lastUpdated: "2024-12-15",
    pages: 156,
  },
  {
    id: "dm",
    title: "LOGIC GRIDS",
    subtitle: "Discrete Mathematics & Graph Theory",
    filename: "discrete_math_notes.pdf",
    size: "18.3 MB",
    color: "#9d00ff",
    pdfUrl: "./DM/Week-12.pdf",
    description:
      "Discrete mathematics topics including logic, set theory, combinatorics and graph theory.",
    lastUpdated: "2024-11-20",
    pages: 120,
  },
  {
    id: "aps",
    title: "STOCHASTIC ENGINE",
    subtitle: "Applied Probability & Statistical Models",
    filename: "probability_stats_notes.pdf",
    size: "32.1 MB",
    color: "#00ffaa",
    pdfUrl: "./APS/Week-10.pdf",
    description:
      "Probability theory, statistical models, and their applications in computer science.",
    lastUpdated: "2024-12-01",
    pages: 210,
  },
];

// ============================================
// APPLICATION STATE
// ============================================
class AppState {
  constructor() {
    this.currentCourse = null;
    this.currentPdf = null;
    this.currentPage = 1;
    this.totalPages = 0;
    this.zoom = CONFIG.defaultZoom; // Zoom still exists but UI removed
    this.searchQuery = "";
    this.isLoading = false;
    this.error = null;
    this.searchIndex = this.buildSearchIndex();
    this.matrixAnimation = null;
  }

  buildSearchIndex() {
    const index = new Map();
    COURSES.forEach((course) => {
      const searchableText =
        `${course.title} ${course.subtitle} ${course.filename} ${course.description}`
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, "");
      index.set(course.id, {
        text: searchableText,
        course: course,
      });
    });
    return index;
  }

  setCurrentCourse(course) {
    this.currentCourse = course;
    if (course) {
      localStorage.setItem(CONFIG.localStorageKeys.lastViewedCourse, course.id);
    }
  }

  setZoom(zoom) {
    this.zoom = Math.max(CONFIG.minZoom, Math.min(CONFIG.maxZoom, zoom));
    localStorage.setItem(CONFIG.localStorageKeys.zoomLevel, this.zoom);
  }

  setError(error) {
    this.error = error;
    console.error("App Error:", error);
  }

  clearError() {
    this.error = null;
  }

  setLoading(loading) {
    this.isLoading = loading;
  }
}

// ============================================
// DOM MANAGER
// ============================================
class DOMManager {
  constructor() {
    this.elements = {
      coursesGrid: document.getElementById("coursesGrid"),
      pdfSection: document.getElementById("pdfSection"),
      pdfCanvas: document.getElementById("pdfCanvas"),
      pdfTitle: document.getElementById("pdfTitle"),
      pageNum: document.getElementById("pageNum"),
      pageCount: document.getElementById("pageCount"),
      firstPage: document.getElementById("firstPage"),
      prevPage: document.getElementById("prevPage"),
      nextPage: document.getElementById("nextPage"),
      lastPage: document.getElementById("lastPage"),
      searchBar: document.getElementById("searchBar"),
      searchResults: document.getElementById("searchResults"),
      downloadBtn: document.getElementById("downloadBtn"),
      openFullBtn: document.getElementById("openFullBtn"),
      loadingIndicator: document.getElementById("loadingIndicator"),
      errorIndicator: document.getElementById("errorIndicator"),
      errorMessage: document.getElementById("errorMessage"),
      retryBtn: document.getElementById("retryBtn"),
      analyticsToggle: document.getElementById("analyticsToggle"),
      currentYear: document.getElementById("currentYear"),
    };

    this.validateElements();
    this.setupAccessibility();
  }

  validateElements() {
    Object.entries(this.elements).forEach(([key, element]) => {
      if (
        !element &&
        key !== "zoomSlider" &&
        key !== "zoomValue" &&
        key !== "zoomInBtn" &&
        key !== "zoomOutBtn"
      ) {
        console.warn(`Element ${key} not found in DOM`);
      }
    });
  }

  setupAccessibility() {
    // Set current year in footer
    if (this.elements.currentYear) {
      this.elements.currentYear.textContent = new Date().getFullYear();
    }

    // Setup analytics toggle
    this.setupAnalyticsToggle();
  }

  setupAnalyticsToggle() {
    if (!this.elements.analyticsToggle) return;

    const consent =
      localStorage.getItem(CONFIG.localStorageKeys.analyticsConsent) === "true";
    this.updateAnalyticsToggle(consent);

    this.elements.analyticsToggle.addEventListener("click", () => {
      const newConsent = !(
        localStorage.getItem(CONFIG.localStorageKeys.analyticsConsent) ===
        "true"
      );
      localStorage.setItem(
        CONFIG.localStorageKeys.analyticsConsent,
        newConsent
      );
      this.updateAnalyticsToggle(newConsent);

      // Reload Google Analytics if needed
      if (newConsent && window.gtag) {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          dataLayer.push(arguments);
        }
        gtag("js", new Date());
        gtag("config", "G-H38HJPPREN", { anonymize_ip: true });
      }
    });
  }

  updateAnalyticsToggle(consent) {
    if (!this.elements.analyticsToggle) return;

    const status =
      this.elements.analyticsToggle.querySelector(".toggle-status");
    if (status) {
      status.textContent = consent ? "On" : "Off";
      this.elements.analyticsToggle.classList.toggle("active", consent);
    }
  }

  showLoading() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.hidden = false;
    }
    if (this.elements.pdfCanvas) {
      this.elements.pdfCanvas.style.display = "none";
    }
    if (this.elements.errorIndicator) {
      this.elements.errorIndicator.hidden = true;
    }
  }

  hideLoading() {
    if (this.elements.loadingIndicator) {
      this.elements.loadingIndicator.hidden = true;
    }
    if (this.elements.pdfCanvas) {
      this.elements.pdfCanvas.style.display = "block";
    }
  }

  showError(message) {
    if (this.elements.errorIndicator && this.elements.errorMessage) {
      this.elements.errorMessage.textContent = message;
      this.elements.errorIndicator.hidden = false;
    }
    this.hideLoading();
  }

  hideError() {
    if (this.elements.errorIndicator) {
      this.elements.errorIndicator.hidden = true;
    }
  }

  updatePDFTitle(title) {
    if (this.elements.pdfTitle) {
      // Use textContent to prevent XSS
      this.elements.pdfTitle.textContent = title;
      this.elements.pdfTitle.focus(); // For screen readers
    }
  }

  updatePageControls(currentPage, totalPages) {
    if (this.elements.pageNum) {
      this.elements.pageNum.value = currentPage;
      this.elements.pageNum.max = totalPages;
    }
    if (this.elements.pageCount) {
      this.elements.pageCount.textContent = totalPages;
    }

    // Update button states
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    if (this.elements.firstPage) this.elements.firstPage.disabled = isFirstPage;
    if (this.elements.prevPage) this.elements.prevPage.disabled = isFirstPage;
    if (this.elements.nextPage) this.elements.nextPage.disabled = isLastPage;
    if (this.elements.lastPage) this.elements.lastPage.disabled = isLastPage;
  }

  showPDFViewer() {
    if (this.elements.pdfSection) {
      this.elements.pdfSection.classList.add("active");
      setTimeout(() => {
        this.elements.pdfSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }

  hidePDFViewer() {
    if (this.elements.pdfSection) {
      this.elements.pdfSection.classList.remove("active");
    }
  }
}

// ============================================
// MATRIX BACKGROUND MANAGER
// ============================================
class MatrixBackground {
  constructor() {
    this.canvas = document.getElementById("matrixCanvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.columns = [];
    this.animationId = null;
    this.isRunning = false;

    this.init();
    this.setupResizeHandler();
  }

  init() {
    this.resize();
    this.columns = Array(Math.floor(this.canvas.width / 14)).fill(0);
  }

  resize() {
    if (!this.canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.ctx.scale(dpr, dpr);
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;
  }

  setupResizeHandler() {
    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.resize();
        this.columns = Array(Math.floor(this.canvas.width / 14)).fill(0);
      }, 250);
    });
  }

  draw() {
    if (!this.canvas || !this.ctx) return;

    // Clear with fade effect
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Set text properties
    this.ctx.fillStyle = "#0f0";
    this.ctx.font = '14px "Share Tech Mono"';
    this.ctx.textBaseline = "top";

    // Draw matrix characters
    this.columns.forEach((y, index) => {
      const x = index * 14;
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);

      this.ctx.fillText(char, x, y);

      if (y > 100 + Math.random() * 10000) {
        this.columns[index] = 0;
      } else {
        this.columns[index] = y + 14;
      }
    });
  }

  animate() {
    if (!this.isRunning) return;

    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  isVisible() {
    return this.canvas && this.canvas.getBoundingClientRect().height > 0;
  }
}

// ============================================
// PDF MANAGER
// ============================================
class PDFManager {
  constructor(domManager, appState) {
    this.dom = domManager;
    this.state = appState;
    this.renderTimeout = null;
  }

  async loadPDF(course) {
    if (!course || !course.pdfUrl) {
      this.dom.showError("Invalid course data provided.");
      return;
    }

    this.state.setCurrentCourse(course);
    this.state.setLoading(true);
    this.state.clearError();

    this.dom.showPDFViewer();
    this.dom.showLoading();
    this.dom.hideError();
    this.dom.updatePDFTitle(course.title);

    // Setup download buttons
    if (this.dom.elements.downloadBtn) {
      this.dom.elements.downloadBtn.onclick = () => this.downloadPDF(course);
    }
    if (this.dom.elements.openFullBtn) {
      this.dom.elements.openFullBtn.href = course.pdfUrl;
    }

    try {
      // Test URL accessibility
      await this.testURLAccessibility(course.pdfUrl);

      // Load PDF
      const loadingTask = pdfjsLib.getDocument({
        url: course.pdfUrl,
        withCredentials: false,
      });

      const pdf = await loadingTask.promise;

      this.state.currentPdf = pdf;
      this.state.totalPages = pdf.numPages;
      this.state.currentPage = 1;

      console.log(
        `✅ PDF loaded successfully! Pages: ${this.state.totalPages}`
      );

      this.dom.updatePageControls(1, this.state.totalPages);

      await this.renderPage();

      this.dom.hideLoading();
      this.updateActiveCourseCard(course.id);
    } catch (error) {
      this.handlePDFError(course, error);
    } finally {
      this.state.setLoading(false);
    }
  }

  async testURLAccessibility(url) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        mode: "no-cors",
      });
      return true;
    } catch (error) {
      console.warn("HEAD request failed, trying GET:", error);

      // Try GET request as fallback
      const getResponse = await fetch(url, {
        method: "GET",
        mode: "no-cors",
      });

      if (!getResponse.ok && getResponse.status !== 0) {
        throw new Error(`File not accessible (HTTP ${getResponse.status})`);
      }
      return true;
    }
  }

  async renderPage() {
    if (!this.state.currentPdf || this.state.currentPage < 1) {
      throw new Error("No PDF loaded or invalid page number");
    }

    try {
      const page = await this.state.currentPdf.getPage(this.state.currentPage);
      const container = this.dom.elements.pdfCanvas.parentElement;

      if (!container) {
        throw new Error("PDF container not found");
      }

      // Calculate dimensions - Using fixed zoom since UI removed
      const A4_WIDTH = 595;
      const A4_HEIGHT = 842;
      const containerWidth = container.clientWidth - 60; // Account for padding

      // Use default zoom since zoom controls removed
      const scale = Math.min(
        (containerWidth / A4_WIDTH) * (CONFIG.defaultZoom / 100),
        1.5 // Max scale
      );

      const viewport = page.getViewport({ scale });

      // Set canvas dimensions
      const canvas = this.dom.elements.pdfCanvas;
      const ctx = canvas.getContext("2d");

      // Handle high DPI displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = viewport.width * dpr;
      canvas.height = viewport.height * dpr;
      canvas.style.width = `${viewport.width}px`;
      canvas.style.height = `${viewport.height}px`;

      ctx.scale(dpr, dpr);

      // Render PDF page
      const renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };

      await page.render(renderContext).promise;

      this.dom.updatePageControls(
        this.state.currentPage,
        this.state.totalPages
      );
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      throw error;
    }
  }

  handlePDFError(course, error) {
    console.error("PDF loading error:", error);

    let errorMessage = "Failed to load PDF. ";

    if (error.name === "InvalidPDFException") {
      errorMessage += "The PDF file appears to be corrupted or invalid.";
    } else if (error.message.includes("NetworkError")) {
      errorMessage += "Network error. Please check your internet connection.";
    } else if (error.message.includes("CORS")) {
      errorMessage +=
        "Cross-origin request blocked. Try hosting the PDF on the same domain.";
    } else {
      errorMessage += error.message || "Unknown error occurred.";
    }

    this.state.setError(errorMessage);
    this.dom.showError(errorMessage);
  }

  downloadPDF(course) {
    if (!course || !course.pdfUrl) return;

    const a = document.createElement("a");
    a.href = course.pdfUrl;
    a.download = course.filename || "document.pdf";
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  goToPage(pageNumber) {
    if (!this.state.currentPdf) return;

    const page = Math.max(1, Math.min(this.state.totalPages, pageNumber));
    if (page !== this.state.currentPage) {
      this.state.currentPage = page;
      this.debouncedRender();
    }
  }

  debouncedRender() {
    clearTimeout(this.renderTimeout);
    this.renderTimeout = setTimeout(() => {
      this.renderPage().catch((error) => {
        console.error("Error in debounced render:", error);
      });
    }, CONFIG.debounceDelay);
  }

  updateActiveCourseCard(courseId) {
    document.querySelectorAll(".course-card").forEach((card) => {
      card.classList.toggle("active", card.dataset.id === courseId);
    });
  }
}

// ============================================
// COURSE MANAGER
// ============================================
class CourseManager {
  constructor(domManager, appState) {
    this.dom = domManager;
    this.state = appState;
  }

  renderCourses() {
    const filteredCourses = this.getFilteredCourses();

    this.dom.elements.coursesGrid.innerHTML = filteredCourses
      .map((course) => this.createCourseCard(course))
      .join("");

    this.attachCardEvents();
    this.fetchFileSizes();
  }

  getFilteredCourses() {
    if (!this.state.searchQuery.trim()) {
      return COURSES;
    }

    const queryWords = this.state.searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    return COURSES.filter((course) => {
      const indexData = this.state.searchIndex.get(course.id);
      if (!indexData) return false;

      return queryWords.every((word) => indexData.text.includes(word));
    });
  }

  createCourseCard(course) {
    const isActive = this.state.currentCourse?.id === course.id;

    return `
      <div class="course-card ${isActive ? "active" : ""}" 
           data-id="${course.id}"
           tabindex="0"
           role="button"
           aria-label="View ${course.title} notes">
        <h3 class="course-title">${course.title}</h3>
        <p class="course-subtitle">${course.subtitle}</p>
        <p class="course-description" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 15px;">
          ${course.description || ""}
        </p>
        <div class="course-meta">
          <span class="file-size loading" data-url="${
            course.pdfUrl
          }">Loading size...</span>
          <span class="page-count" style="color: var(--text-secondary); font-size: 0.9rem;">
            ${course.pages ? `${course.pages} pages` : ""}
          </span>
        </div>
      </div>
    `;
  }

  attachCardEvents() {
    document.querySelectorAll(".course-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".action-btn")) return;

        const courseId = card.dataset.id;
        const course = COURSES.find((c) => c.id === courseId);
        if (course) {
          APP.pdfManager.loadPDF(course);
        }
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  async fetchFileSizes() {
    const fileSizeElements = document.querySelectorAll(".file-size[data-url]");

    const promises = Array.from(fileSizeElements).map(async (element) => {
      const url = element.dataset.url;
      element.classList.add("loading");

      try {
        const size = await this.getFileSize(url);
        this.animateSizeValue(element, size);
      } catch (error) {
        console.warn("Could not fetch file size for:", url, error);
        element.textContent = "Size unavailable";
        element.classList.remove("loading");
      }
    });

    await Promise.allSettled(promises);
  }

  async getFileSize(url) {
    try {
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        const contentLength = response.headers.get("content-length");
        if (contentLength) {
          return parseInt(contentLength);
        }
      }

      // Fallback: fetch the entire file
      const fullResponse = await fetch(url);
      const blob = await fullResponse.blob();
      return blob.size;
    } catch (error) {
      throw new Error(`Failed to fetch file size: ${error.message}`);
    }
  }

  animateSizeValue(element, bytes) {
    const duration = CONFIG.animationDuration;
    const startTime = performance.now();
    const targetMB = bytes / (1024 * 1024);
    let currentSize = 0;

    function formatSize(mb) {
      if (mb < 0.1) {
        return (mb * 1024).toFixed(2) + " KB";
      } else if (mb > 1024) {
        return (mb / 1024).toFixed(2) + " GB";
      }
      return mb.toFixed(2) + " MB";
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      currentSize = targetMB * easeOutCubic;

      element.textContent = formatSize(currentSize);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = formatSize(targetMB);
        element.classList.remove("loading");
      }
    }

    requestAnimationFrame(update);
  }

  setupSearch() {
    let searchTimeout;

    this.dom.elements.searchBar.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);

      searchTimeout = setTimeout(() => {
        this.state.searchQuery = e.target.value.trim();
        this.renderCourses();
        this.updateSearchResults();
      }, CONFIG.debounceDelay);
    });

    // Add keyboard shortcuts for search
    this.dom.elements.searchBar.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        e.target.value = "";
        this.state.searchQuery = "";
        this.renderCourses();
        this.hideSearchResults();
      }
    });
  }

  updateSearchResults() {
    const results = this.getFilteredCourses();
    const resultsElement = this.dom.elements.searchResults;

    if (!resultsElement) return;

    if (this.state.searchQuery && results.length > 0) {
      resultsElement.innerHTML = `
        <div style="padding: 10px; color: var(--text-secondary);">
          Found ${results.length} course${results.length !== 1 ? "s" : ""}
        </div>
      `;
      resultsElement.classList.add("active");
    } else if (this.state.searchQuery && results.length === 0) {
      resultsElement.innerHTML = `
        <div style="padding: 10px; color: var(--text-secondary);">
          No courses found matching "${this.state.searchQuery}"
        </div>
      `;
      resultsElement.classList.add("active");
    } else {
      this.hideSearchResults();
    }
  }

  hideSearchResults() {
    const resultsElement = this.dom.elements.searchResults;
    if (resultsElement) {
      resultsElement.classList.remove("active");
      resultsElement.innerHTML = "";
    }
  }
}

// ============================================
// APPLICATION MAIN
// ============================================
class NotesApp {
  constructor() {
    this.state = new AppState();
    this.dom = new DOMManager();
    this.matrix = new MatrixBackground();
    this.pdfManager = new PDFManager(this.dom, this.state);
    this.courseManager = new CourseManager(this.dom, this.state);

    this.setupEventListeners();
    this.init();
  }

  init() {
    // Start matrix animation
    if (this.matrix.isVisible()) {
      this.matrix.start();
    }

    // Render courses
    this.courseManager.renderCourses();
    this.courseManager.setupSearch();

    // Load last viewed course
    this.loadLastViewedCourse();

    // Setup visibility change handler
    this.setupVisibilityHandler();
  }

  setupEventListeners() {
    // Page navigation
    if (this.dom.elements.firstPage) {
      this.dom.elements.firstPage.addEventListener("click", () => {
        this.pdfManager.goToPage(1);
      });
    }

    if (this.dom.elements.prevPage) {
      this.dom.elements.prevPage.addEventListener("click", () => {
        this.pdfManager.goToPage(this.state.currentPage - 1);
      });
    }

    if (this.dom.elements.nextPage) {
      this.dom.elements.nextPage.addEventListener("click", () => {
        this.pdfManager.goToPage(this.state.currentPage + 1);
      });
    }

    if (this.dom.elements.lastPage) {
      this.dom.elements.lastPage.addEventListener("click", () => {
        this.pdfManager.goToPage(this.state.totalPages);
      });
    }

    // Page number input
    if (this.dom.elements.pageNum) {
      this.dom.elements.pageNum.addEventListener("change", (e) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
          this.pdfManager.goToPage(page);
        }
      });

      // Also handle Enter key for better UX
      this.dom.elements.pageNum.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          const page = parseInt(e.target.value);
          if (!isNaN(page)) {
            this.pdfManager.goToPage(page);
          }
        }
      });
    }

    // Retry button
    if (this.dom.elements.retryBtn) {
      this.dom.elements.retryBtn.addEventListener("click", () => {
        if (this.state.currentCourse) {
          this.pdfManager.loadPDF(this.state.currentCourse);
        }
      });
    }

    // Keyboard shortcuts for PDF navigation
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case "ArrowLeft":
          if (this.state.currentPdf && this.state.currentPage > 1) {
            e.preventDefault();
            this.pdfManager.goToPage(this.state.currentPage - 1);
          }
          break;
        case "ArrowRight":
          if (
            this.state.currentPdf &&
            this.state.currentPage < this.state.totalPages
          ) {
            e.preventDefault();
            this.pdfManager.goToPage(this.state.currentPage + 1);
          }
          break;
        // Removed zoom keyboard shortcuts since UI removed
      }
    });
  }

  setupVisibilityHandler() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.matrix.stop();
      } else if (this.matrix.isVisible()) {
        this.matrix.start();
      }
    });
  }

  loadLastViewedCourse() {
    const lastCourseId = localStorage.getItem(
      CONFIG.localStorageKeys.lastViewedCourse
    );
    if (lastCourseId) {
      const course = COURSES.find((c) => c.id === lastCourseId);
      if (course) {
        // Preload but don't display immediately
        setTimeout(() => {
          pdfjsLib
            .getDocument(course.pdfUrl)
            .promise.then((pdf) => {
              console.log(`Preloaded last viewed course: ${course.title}`);
            })
            .catch((err) => {
              console.log("Preload failed:", err);
            });
        }, 1000);
      }
    }
  }
}

// ============================================
// GLOBAL APP INSTANCE
// ============================================
let APP;

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  try {
    APP = new NotesApp();
    console.log("✅ Notes Viewer initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Notes Viewer:", error);

    // Show error to user
    const errorElement = document.createElement("div");
    errorElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff5555;
      color: white;
      padding: 20px;
      text-align: center;
      z-index: 9999;
    `;
    errorElement.textContent =
      "Failed to initialize application. Please refresh the page.";
    document.body.appendChild(errorElement);
  }
});

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  if (APP && APP.matrix) {
    APP.matrix.stop();
  }
});

// Export for debugging (browser-safe version)
if (typeof window !== "undefined") {
  window.NotesApp = NotesApp;
  window.COURSES = COURSES;
}

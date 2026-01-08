// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// ============================================
// COURSE DATA - UPDATE PATHS HERE
// ============================================
const COURSES = [
  {
    id: "la",
    title: "MATRIX THEORY",
    subtitle: "Linear Algebra & Vector Spaces",
    filename: "linear_algebra_notes.pdf",
    size: "24.7 MB",
    color: "#00ffff",
    progress: 45,
    // TRY THESE OPTIONS:
    pdfUrl: "./LA/Week-15.pdf", // OPTION 1: Relative path
    // pdfUrl: 'http://localhost:8000/LA/Week-15.pdf'  // OPTION 2: Local server
    // pdfUrl: 'https://yourdomain.com/notes/Week-15.pdf'  // OPTION 3: Online
  },
  {
    id: "dm",
    title: "LOGIC GRIDS",
    subtitle: "Discrete Mathematics & Graph Theory",
    filename: "discrete_math_notes.pdf",
    size: "18.3 MB",
    color: "#9d00ff",
    progress: 30,
    pdfUrl: "./DM/Week-12.pdf",
  },
  {
    id: "aps",
    title: "STOCHASTIC ENGINE",
    subtitle: "Applied Probability & Statistical Models",
    filename: "probability_stats_notes.pdf",
    size: "32.1 MB",
    color: "#00ffaa",
    progress: 60,
    pdfUrl: "./APS/Week-10.pdf",
  },
  // ============================================
  // TO ADD NEW COURSE: Copy the object above and update values
  // Required fields: id, title, subtitle, icon, filename, size, color, pdfUrl
  // ============================================
];

// ============================================
// GLOBAL STATE
// ============================================
let state = {
  currentCourse: null,
  currentPdf: null,
  currentPage: 1,
  totalPages: 0,
  zoom: 100,
  searchQuery: "",
  // Hash map for faster searching
  searchIndex: new Map(),
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  coursesGrid: document.getElementById("coursesGrid"),
  pdfSection: document.getElementById("pdfSection"),
  pdfCanvas: document.getElementById("pdfCanvas"),
  pdfTitle: document.getElementById("pdfTitle"),
  pageNum: document.getElementById("pageNum"),
  pageCount: document.getElementById("pageCount"),
  prevPage: document.getElementById("prevPage"),
  nextPage: document.getElementById("nextPage"),
  zoomSlider: document.getElementById("zoomSlider"),
  zoomValue: document.getElementById("zoomValue"),
  searchBar: document.getElementById("searchBar"),
  downloadBtn: document.getElementById("downloadBtn"),
  openFullBtn: document.getElementById("openFullBtn"),
  loadingIndicator: document.getElementById("loadingIndicator"),
};

// ============================================
// MATRIX BACKGROUND ANIMATION
// ============================================
class MatrixBackground {
  constructor() {
    this.canvas = document.getElementById("matrixCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.columns = [];
    this.resize();
    this.init();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.init();
  }

  init() {
    const fontSize = 14;
    const columns = Math.floor(this.canvas.width / fontSize);
    this.columns = Array(columns).fill(0);
  }

  draw() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.fillStyle = "#0f0";
    this.ctx.font = '14px "Share Tech Mono"';

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
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  // Initialize matrix background
  const matrix = new MatrixBackground();
  matrix.animate();

  // Build search index
  buildSearchIndex();

  // Render courses
  renderCourses();

  // Setup event listeners
  setupEventListeners();

  // Preload first course PDF
  preloadFirstCourse();
});

// ============================================
// SEARCH INDEXING (Hashing for better search)
// ============================================
function buildSearchIndex() {
  COURSES.forEach((course) => {
    // Create searchable string with course data
    const searchableText = (
      course.title.toLowerCase() +
      " " +
      course.subtitle.toLowerCase() +
      " " +
      course.filename.toLowerCase()
    ).replace(/[^a-z0-9\s]/g, "");

    // Store in hash map with course ID
    state.searchIndex.set(course.id, searchableText);
  });
}

// ============================================
// RENDER COURSE CARDS
// ============================================
function renderCourses() {
  const filteredCourses = COURSES.filter((course) => {
    if (!state.searchQuery) return true;

    const searchText = state.searchIndex.get(course.id);
    if (!searchText) return false;

    // Split query into words for better matching
    const queryWords = state.searchQuery.toLowerCase().split(/\s+/);

    // Check if ALL query words are found in search text
    return queryWords.every((word) => searchText.includes(word));
  });

  elements.coursesGrid.innerHTML = filteredCourses
    .map(
      (course) => `
                    <div class="course-card ${
                      state.currentCourse?.id === course.id ? "active" : ""
                    }" 
                         data-id="${course.id}">
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-subtitle">${course.subtitle}</p>
                        <div class="course-meta">
                            <span class="file-size" data-url="${
                              course.pdfUrl
                            }">Loading...</span>
                        </div>
                    </div>
                `
    )
    .join("");

  // Fetch and animate real file sizes after rendering
  fetchAndAnimateFileSizes();
}

// ============================================
// FETCH REAL FILE SIZES AND ANIMATE
// ============================================
async function fetchAndAnimateFileSizes() {
  const fileSizeElements = document.querySelectorAll(".file-size[data-url]");

  fileSizeElements.forEach(async (element) => {
    const url = element.dataset.url;

    try {
      // Fetch file to get actual size
      const response = await fetch(url, { method: "HEAD" });

      if (response.ok) {
        const contentLength = response.headers.get("content-length");

        if (contentLength) {
          // Convert bytes to MB
          const sizeInMB = parseInt(contentLength) / (1024 * 1024);
          animateSizeValue(element, sizeInMB);
        } else {
          // If content-length not available, try full fetch
          const fullResponse = await fetch(url);
          const blob = await fullResponse.blob();
          const sizeInMB = blob.size / (1024 * 1024);
          animateSizeValue(element, sizeInMB);
        }
      } else {
        element.textContent = "N/A";
      }
    } catch (error) {
      console.log("Could not fetch file size for:", url);
      element.textContent = "N/A";
    }
  });
}

// ============================================
// ANIMATE SIZE VALUE
// ============================================
function animateSizeValue(element, targetMB) {
  const duration = 1500; // Animation duration in ms
  const startTime = performance.now();

  function updateSize(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function for smooth animation
    const easeOutQuart = 1 - Math.pow(1 - progress, 4);
    const currentValue = targetMB * easeOutQuart;

    element.textContent = currentValue.toFixed(2) + " MB";

    if (progress < 1) {
      requestAnimationFrame(updateSize);
    } else {
      element.textContent = targetMB.toFixed(2) + " MB";
    }
  }

  requestAnimationFrame(updateSize);
}

// ============================================
// LOAD PDF FUNCTION - CORRECTED VERSION
// ============================================
async function loadPDF(course) {
  console.log("Loading PDF for:", course.title);
  console.log("PDF URL:", course.pdfUrl);

  // Reset state
  state.currentCourse = course;
  state.currentPdf = null;
  state.currentPage = 1;
  state.totalPages = 0;

  // Update UI
  elements.pdfSection.classList.add("active");
  elements.pdfTitle.innerHTML = `<span class="tech-gradient">${course.title}</span>`;

  // Set download and open URLs
  elements.downloadBtn.onclick = () => window.open(course.pdfUrl, "_blank");
  elements.openFullBtn.href = course.pdfUrl;

  // Show loading skeleton
  elements.loadingIndicator.style.display = "block";
  elements.pdfCanvas.style.display = "none";

  // Reset page controls safely
  elements.pageCount.textContent = "0";
  elements.pageNum.value = "1";
  if (elements.zoomSlider) elements.zoomSlider.value = state.zoom;
  if (elements.zoomValue) elements.zoomValue.textContent = `${state.zoom}%`;

  // Auto-scroll to PDF section
  setTimeout(() => {
    elements.pdfSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 100);

  try {
    // Test if URL is accessible first
    console.log("Testing file accessibility...");

    // Simple fetch to check if file exists
    const testFetch = await fetch(course.pdfUrl);
    if (!testFetch.ok) {
      throw new Error(`HTTP ${testFetch.status}: File not accessible`);
    }
    console.log("File is accessible, proceeding with PDF.js");

    // Load PDF using PDF.js
    const loadingTask = pdfjsLib.getDocument(course.pdfUrl);
    loadingTask.promise.then(
      (pdf) => {
        // Success callback
        state.currentPdf = pdf;
        state.totalPages = pdf.numPages;
        state.currentPage = 1;

        console.log(`✅ PDF loaded successfully! Pages: ${state.totalPages}`);

        // Update page controls SAFELY
        if (elements.pageCount)
          elements.pageCount.textContent = state.totalPages;
        if (elements.pageNum) elements.pageNum.value = state.currentPage;

        // Render first page
        renderPage().then(() => {
          // Hide loading skeleton
          elements.loadingIndicator.style.display = "none";
          elements.pdfCanvas.style.display = "block";

          // Update active card
          document.querySelectorAll(".course-card").forEach((card) => {
            card.classList.toggle("active", card.dataset.id === course.id);
          });
        });
      },
      (error) => {
        // Error callback
        console.error("PDF.js loading error:", error);
        showPDFError(course, error);
      }
    );
  } catch (error) {
    console.error("Initial fetch error:", error);
    showPDFError(course, error);
  }
}

// ============================================
// ERROR HANDLER FUNCTION
// ============================================
function showPDFError(course, error) {
  console.error("Showing error for:", course.title, error);

  // Ensure loading indicator is visible
  elements.loadingIndicator.style.display = "block";
  elements.pdfCanvas.style.display = "none";

  // Create error message
  const errorMessage = `
                <div style="color: #ff5555; text-align: center; max-width: 700px; margin: 50px auto; padding: 30px; background: rgba(255,85,85,0.1); border-radius: 10px; border: 1px solid rgba(255,85,85,0.3);">
                    <div style="font-size: 4rem; margin-bottom: 20px;">⚠️</div>
                    <h2 style="margin-bottom: 20px; color: #ff5555; font-family: var(--font-heading);">PDF LOADING FAILED</h2>
                    
                    <div style="background: rgba(0,0,0,0.3); padding: 20px; border-radius: 8px; margin-bottom: 25px; text-align: left;">
                        <p><strong style="color: var(--accent-cyan);">COURSE:</strong> ${
                          course.title
                        }</p>
                        <p><strong style="color: var(--accent-cyan);">FILE:</strong> ${
                          course.filename || "N/A"
                        }</p>
                        <p><strong style="color: var(--accent-cyan);">PATH:</strong> <code style="color: #ff9999;">${
                          course.pdfUrl
                        }</code></p>
                        <p><strong style="color: var(--accent-cyan);">ERROR:</strong> ${
                          error.message || "Unknown error"
                        }</p>
                    </div>
                    
                    <h3 style="color: var(--accent-cyan); margin: 25px 0 15px;">TROUBLESHOOTING STEPS:</h3>
                    <ol style="text-align: left; margin-bottom: 30px; padding-left: 25px;">
                        <li style="margin-bottom: 10px;">Check if file exists at: <code>${
                          window.location.origin
                        }/${course.pdfUrl}</code></li>
                        <li style="margin-bottom: 10px;">Right-click the link below and check if PDF opens</li>
                        <li style="margin-bottom: 10px;">Run a local server (python -m http.server 8000)</li>
                        <li style="margin-bottom: 10px;">Check browser console (F12) for CORS errors</li>
                        <li>Try opening PDF directly: <a href="${
                          course.pdfUrl
                        }" target="_blank" style="color: #00ffff;">Open PDF</a></li>
                    </ol>
                    
                    <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                        <button class="action-btn" onclick="retryLoad()" style="background: #ff5555; border-color: #ff5555;">
                            <span>🔄</span> RETRY LOADING
                        </button>
                        <a href="${
                          course.pdfUrl
                        }" class="action-btn" target="_blank">
                            <span>📄</span> OPEN PDF DIRECTLY
                        </a>
                        <button class="action-btn" onclick="loadTestPDF()">
                            <span>🧪</span> TEST WITH SAMPLE PDF
                        </button>
                    </div>
                </div>
            `;

  elements.loadingIndicator.innerHTML = errorMessage;
}

// ============================================
// TEST FUNCTION FOR DEBUGGING
// ============================================
window.loadTestPDF = function () {
  // Load a publicly accessible test PDF
  const testCourse = {
    title: "TEST PDF",
    subtitle: "For debugging purposes",
    filename: "dummy.pdf",
    pdfUrl:
      "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  };
  loadPDF(testCourse);
};

// ============================================
// SAFE RENDER PAGE FUNCTION
// ============================================
async function renderPage() {
  if (!state.currentPdf || state.currentPage < 1) {
    console.error("Cannot render: No PDF loaded or invalid page");
    return;
  }

  try {
    const page = await state.currentPdf.getPage(state.currentPage);

    // A4 dimensions at 72 DPI: 595 x 842 pixels
    const A4_WIDTH = 595;
    const A4_HEIGHT = 842;
    const containerWidth = elements.pdfCanvas.parentElement.clientWidth - 60; // Account for padding

    // Calculate scale to fit container while maintaining A4 ratio
    const scale = Math.min(
      (containerWidth / A4_WIDTH) * (state.zoom / 100),
      1.5 // Max zoom limit
    );

    const viewport = page.getViewport({ scale });

    // Set canvas dimensions
    elements.pdfCanvas.height = viewport.height;
    elements.pdfCanvas.width = viewport.width;

    // Render PDF page
    const renderContext = {
      canvasContext: elements.pdfCanvas.getContext("2d"),
      viewport: viewport,
    };

    await page.render(renderContext).promise;
  } catch (error) {
    console.error("Error rendering page:", error);
  }
}

// ============================================
// PRELOAD FIRST COURSE
// ============================================
function preloadFirstCourse() {
  if (COURSES.length > 0) {
    // Preload without displaying
    pdfjsLib
      .getDocument(COURSES[0].pdfUrl)
      .promise.then((pdf) => console.log("First course PDF preloaded"))
      .catch((err) => console.log("Preload failed (may be offline):", err));
  }
}

// ============================================
// EVENT LISTENERS SETUP
// ============================================
function setupEventListeners() {
  // Course Card Click
  elements.coursesGrid.addEventListener("click", (e) => {
    const card = e.target.closest(".course-card");
    if (card) {
      const courseId = card.dataset.id;
      const course = COURSES.find((c) => c.id === courseId);
      if (course) loadPDF(course);
    }
  });

  // Page Navigation
  elements.prevPage.addEventListener("click", () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      elements.pageNum.value = state.currentPage;
      renderPage();
    }
  });

  elements.nextPage.addEventListener("click", () => {
    if (state.currentPage < state.totalPages) {
      state.currentPage++;
      elements.pageNum.value = state.currentPage;
      renderPage();
    }
  });

  elements.pageNum.addEventListener("change", () => {
    const page = parseInt(elements.pageNum.value);
    if (page >= 1 && page <= state.totalPages) {
      state.currentPage = page;
      renderPage();
    } else {
      elements.pageNum.value = state.currentPage;
    }
  });

  // Zoom Control
  elements.zoomSlider.addEventListener("input", () => {
    state.zoom = parseInt(elements.zoomSlider.value);
    elements.zoomValue.textContent = `${state.zoom}%`;
    debouncedRender();
  });

  // Search with debouncing
  let searchTimeout;
  elements.searchBar.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      state.searchQuery = e.target.value.trim().toLowerCase();
      renderCourses();
    }, 300);
  });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
// Debounced render for performance
let renderTimeout;
function debouncedRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(renderPage, 150);
}

// Retry loading function
window.retryLoad = function () {
  if (state.currentCourse) {
    loadPDF(state.currentCourse);
  }
};

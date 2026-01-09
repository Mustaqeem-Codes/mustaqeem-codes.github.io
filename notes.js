// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  pdfWorkerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  defaultZoom: 100,
  debounceDelay: 300,
  animationDuration: 1500
};

// Configure PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfWorkerSrc;

// ============================================
// COURSE DATA
// ============================================
const COURSES = [
  {
    id: "la",
    title: "LINEAR ALGEBRA",
    subtitle:
      "Systems of Linear Equations, Matrix Theory, Vector Spaces.",
    filename: "Linear Algebra.pdf",
    size: "24.7 MB",
    color: "#00ffff",

    // 👁️ Open in browser (NO download)
    openUrl: "https://raw.githubusercontent.com/<username>/Academic_Notes/main/Linear_Algebra.pdf",

    // Force download
    downloadUrl: "https://github.com/<username>/Academic_Notes/blob/main/Linear_Algebra.pdf?raw=1",

    description:
      "Linear Transformations, Eigen Theory, Applications of Linear Algebra",
    pages: 115
  },

  {
    id: "dm",
    title: "LOGIC GRIDS",
    subtitle: "Discrete Mathematics & Graph Theory",
    filename: "Discrete Mathematics.pdf",
    size: "18.3 MB",
    color: "#9d00ff",

    openUrl: "./DM/Week-12.pdf",
    downloadUrl: "./DM/Week-12.pdf",

    description:
      "Discrete mathematics topics including logic, set theory, combinatorics and graph theory.",
    pages: 120
  },

  {
    id: "aps",
    title: "STOCHASTIC ENGINE",
    subtitle: "Applied Probability & Statistical Models",
    filename: "Applied Probability.pdf",
    size: "32.1 MB",
    color: "#00ffaa",

    openUrl: "./APS/Week-10.pdf",
    downloadUrl: "./APS/Week-10.pdf",

    description:
      "Probability theory, statistical models, and their applications in computer science.",
    pages: 210
  }
];


// ============================================
// APPLICATION STATE
// ============================================
let appState = {
  currentCourse: null,
  currentPdf: null,
  currentPage: 1,
  totalPages: 0,
  zoom: CONFIG.defaultZoom,
  searchQuery: "",
  isLoading: false,
  error: null
};

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
  coursesGrid: document.getElementById('coursesGrid'),
  pdfSection: document.getElementById('pdfSection'),
  pdfCanvas: document.getElementById('pdfCanvas'),
  pdfTitle: document.getElementById('pdfTitle'),
  pageNum: document.getElementById('pageNum'),
  pageCount: document.getElementById('pageCount'),
  firstPage: document.getElementById('firstPage'),
  prevPage: document.getElementById('prevPage'),
  nextPage: document.getElementById('nextPage'),
  lastPage: document.getElementById('lastPage'),
  searchBar: document.getElementById('searchBar'),
  searchResults: document.getElementById('searchResults'),
  downloadBtn: document.getElementById('downloadBtn'),
  openFullBtn: document.getElementById('openFullBtn'),
  loadingIndicator: document.getElementById('loadingIndicator'),
  errorIndicator: document.getElementById('errorIndicator'),
  errorMessage: document.getElementById('errorMessage'),
  retryBtn: document.getElementById('retryBtn'),
  currentYear: document.getElementById('currentYear')
};

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('Initializing Notes Viewer...');
  
  // Set current year
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }
  
  // Start matrix background
  initMatrixBackground();
  
  // Render courses
  renderCourses();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('Notes Viewer initialized successfully');
});

// ============================================
// MATRIX BACKGROUND
// ============================================
function initMatrixBackground() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId = null;
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function drawMatrix() {
    // Fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Matrix characters
    ctx.fillStyle = '#0f0';
    ctx.font = '14px "Share Tech Mono"';
    
    // Draw random matrix characters
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);
      ctx.fillText(char, x, y);
    }
    
    animationId = requestAnimationFrame(drawMatrix);
  }
  
  // Handle resize
  window.addEventListener('resize', resizeCanvas);
  
  // Start animation
  resizeCanvas();
  drawMatrix();
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  });
}

// ============================================
// COURSE RENDERING
// ============================================
function renderCourses() {
  if (!elements.coursesGrid) {
    console.error('Courses grid element not found');
    return;
  }
  
  // Filter courses based on search
  const filteredCourses = filterCourses();
  
  // Generate HTML
  const coursesHTML = filteredCourses.map(course => `
    <div class="course-card" data-id="${course.id}" tabindex="0" role="button">
      <h3 class="course-title">${course.title}</h3>
      <p class="course-subtitle">${course.subtitle}</p>
      <p class="course-description">${course.description}</p>
      <div class="course-meta">
        <span class="file-size" data-url="${course.pdfUrl}">Loading size...</span>
        <span class="page-count">${course.pages} pages</span>
      </div>
    </div>
  `).join('');
  
  elements.coursesGrid.innerHTML = coursesHTML;
  
  // Add click events to cards
  document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('click', function() {
      const courseId = this.dataset.id;
      const course = COURSES.find(c => c.id === courseId);
      if (course) {
        loadPDF(course);
      }
    });
    
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const courseId = this.dataset.id;
        const course = COURSES.find(c => c.id === courseId);
        if (course) {
          loadPDF(course);
        }
      }
    });
  });
  
  // Load file sizes
  loadFileSizes();
}

function filterCourses() {
  if (!appState.searchQuery.trim()) {
    return COURSES;
  }
  
  const query = appState.searchQuery.toLowerCase();
  return COURSES.filter(course => {
    return course.title.toLowerCase().includes(query) ||
           course.subtitle.toLowerCase().includes(query) ||
           course.description.toLowerCase().includes(query);
  });
}

// ============================================
// FILE SIZE LOADING
// ============================================
async function loadFileSizes() {
  const fileSizeElements = document.querySelectorAll('.file-size[data-url]');
  
  for (const element of fileSizeElements) {
    const url = element.dataset.url;
    element.classList.add('loading');
    
    try {
      const size = await getFileSize(url);
      animateFileSize(element, size);
    } catch (error) {
      console.warn('Failed to load file size for:', url);
      element.textContent = 'Size unavailable';
      element.classList.remove('loading');
    }
  }
}

async function getFileSize(url) {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    
    if (response.ok) {
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        return parseInt(contentLength);
      }
    }
    
    // Fallback to GET request
    const fullResponse = await fetch(url);
    const blob = await fullResponse.blob();
    return blob.size;
    
  } catch (error) {
    throw new Error(`Failed to fetch file size: ${error.message}`);
  }
}

function animateFileSize(element, bytes) {
  const duration = CONFIG.animationDuration;
  const startTime = performance.now();
  const targetMB = bytes / (1024 * 1024);
  
  function formatSize(mb) {
    if (mb < 0.1) {
      return (mb * 1024).toFixed(2) + ' KB';
    } else if (mb > 1024) {
      return (mb / 1024).toFixed(2) + ' GB';
    }
    return mb.toFixed(2) + ' MB';
  }
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function
    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
    const currentSize = targetMB * easeOutCubic;
    
    element.textContent = formatSize(currentSize);
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = formatSize(targetMB);
      element.classList.remove('loading');
    }
  }
  
  requestAnimationFrame(update);
}

// ============================================
// PDF LOADING
// ============================================
async function loadPDF(course) {
  if (!course) return;
  
  // Update state
  appState.currentCourse = course;
  appState.currentPage = 1;
  appState.isLoading = true;
  appState.error = null;
  
  // Update UI
  showPDFViewer();
  showLoading();
  hideError();
  
  if (elements.pdfTitle) {
    elements.pdfTitle.textContent = course.title;
  }
  
  // Open Full PDF button
  if (elements.openFullBtn) {
    elements.openFullBtn.href = course.openUrl;
    elements.openFullBtn.target = "_blank";
  }
  
  // Download button
  if (elements.downloadBtn) {
    elements.downloadBtn.onclick = () => {
      const a = document.createElement("a");
      a.href = course.downloadUrl;
      a.download = course.filename;
      a.click();
    };
  }
  
  try {
    // Load PDF
    const loadingTask = pdfjsLib.getDocument(course.pdfUrl);
    const pdf = await loadingTask.promise;
    
    appState.currentPdf = pdf;
    appState.totalPages = pdf.numPages;
    
    console.log(`PDF loaded: ${pdf.numPages} pages`);
    
    // Update page controls
    updatePageControls();
    
    // Render first page
    await renderPage();
    
    // Update UI
    hideLoading();
    
    // Update active card
    updateActiveCard(course.id);
    
  } catch (error) {
    console.error('PDF loading error:', error);
    showPDFError(error);
  } finally {
    appState.isLoading = false;
  }
}

async function renderPage() {
  if (!appState.currentPdf || appState.currentPage < 1) {
    throw new Error('No PDF loaded');
  }
  
  try {
    const page = await appState.currentPdf.getPage(appState.currentPage);
    const container = elements.pdfCanvas.parentElement;
    
    if (!container) {
      throw new Error('PDF container not found');
    }
    
    // Calculate dimensions
    const A4_WIDTH = 595;
    const containerWidth = container.clientWidth - 60;
    const scale = Math.min((containerWidth / A4_WIDTH) * (appState.zoom / 100), 1.5);
    
    const viewport = page.getViewport({ scale });
    
    // Set canvas dimensions
    const canvas = elements.pdfCanvas;
    const ctx = canvas.getContext('2d');
    
    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    
    ctx.scale(dpr, dpr);
    
    // Render page
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
  } catch (error) {
    console.error('Error rendering page:', error);
    throw error;
  }
}

// ============================================
// UI UPDATES
// ============================================
function showPDFViewer() {
  if (elements.pdfSection) {
    elements.pdfSection.classList.add('active');
    setTimeout(() => {
      elements.pdfSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }
}

function showLoading() {
  if (elements.loadingIndicator) {
    elements.loadingIndicator.hidden = false;
  }
  if (elements.pdfCanvas) {
    elements.pdfCanvas.style.display = 'none';
  }
}

function hideLoading() {
  if (elements.loadingIndicator) {
    elements.loadingIndicator.hidden = true;
  }
  if (elements.pdfCanvas) {
    elements.pdfCanvas.style.display = 'block';
  }
}

function showError(message) {
  if (elements.errorIndicator && elements.errorMessage) {
    elements.errorMessage.textContent = message;
    elements.errorIndicator.hidden = false;
  }
  hideLoading();
}

function hideError() {
  if (elements.errorIndicator) {
    elements.errorIndicator.hidden = true;
  }
}

function showPDFError(error) {
  let errorMessage = 'Failed to load PDF. ';
  
  if (error.name === 'InvalidPDFException') {
    errorMessage += 'The PDF file appears to be corrupted or invalid.';
  } else if (error.message.includes('NetworkError')) {
    errorMessage += 'Network error. Please check your internet connection.';
  } else if (error.message.includes('CORS')) {
    errorMessage += 'Cross-origin request blocked. The PDF may need to be hosted on the same domain.';
  } else {
    errorMessage += error.message || 'Unknown error occurred.';
  }
  
  showError(errorMessage);
}

function updatePageControls() {
  if (elements.pageNum) {
    elements.pageNum.value = appState.currentPage;
    elements.pageNum.max = appState.totalPages;
  }
  
  if (elements.pageCount) {
    elements.pageCount.textContent = appState.totalPages;
  }
  
  // Update button states
  const isFirstPage = appState.currentPage === 1;
  const isLastPage = appState.currentPage === appState.totalPages;
  
  if (elements.firstPage) elements.firstPage.disabled = isFirstPage;
  if (elements.prevPage) elements.prevPage.disabled = isFirstPage;
  if (elements.nextPage) elements.nextPage.disabled = isLastPage;
  if (elements.lastPage) elements.lastPage.disabled = isLastPage;
}

function updateActiveCard(courseId) {
  document.querySelectorAll('.course-card').forEach(card => {
    card.classList.toggle('active', card.dataset.id === courseId);
  });
}

function downloadPDF(course) {
  if (!course || !course.pdfUrl) return;
  
  const a = document.createElement('a');
  a.href = course.pdfUrl;
  a.download = course.filename || 'document.pdf';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Search
  if (elements.searchBar) {
    let searchTimeout;
    elements.searchBar.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        appState.searchQuery = e.target.value.trim();
        renderCourses();
      }, CONFIG.debounceDelay);
    });
  }
  
  // Page navigation
  if (elements.firstPage) {
    elements.firstPage.addEventListener('click', () => goToPage(1));
  }
  
  if (elements.prevPage) {
    elements.prevPage.addEventListener('click', () => goToPage(appState.currentPage - 1));
  }
  
  if (elements.nextPage) {
    elements.nextPage.addEventListener('click', () => goToPage(appState.currentPage + 1));
  }
  
  if (elements.lastPage) {
    elements.lastPage.addEventListener('click', () => goToPage(appState.totalPages));
  }
  
  // Page number input
  if (elements.pageNum) {
    elements.pageNum.addEventListener('change', (e) => {
      const page = parseInt(e.target.value);
      if (!isNaN(page)) {
        goToPage(page);
      }
    });
    
    elements.pageNum.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) {
          goToPage(page);
        }
      }
    });
  }
  
  // Retry button
  if (elements.retryBtn) {
    elements.retryBtn.addEventListener('click', () => {
      if (appState.currentCourse) {
        loadPDF(appState.currentCourse);
      }
    });
  }
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    if (appState.currentPdf) {
      switch(e.key) {
        case 'ArrowLeft':
          if (appState.currentPage > 1) {
            e.preventDefault();
            goToPage(appState.currentPage - 1);
          }
          break;
        case 'ArrowRight':
          if (appState.currentPage < appState.totalPages) {
            e.preventDefault();
            goToPage(appState.currentPage + 1);
          }
          break;
      }
    }
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================
let renderTimeout;

function goToPage(pageNumber) {
  if (!appState.currentPdf) return;
  
  const page = Math.max(1, Math.min(appState.totalPages, pageNumber));
  if (page !== appState.currentPage) {
    appState.currentPage = page;
    debouncedRender();
  }
}

function debouncedRender() {
  clearTimeout(renderTimeout);
  renderTimeout = setTimeout(() => {
    renderPage().catch(error => {
      console.error('Error in debounced render:', error);
      showPDFError(error);
    });
  }, CONFIG.debounceDelay);
}

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
});

// Export for debugging
window.NOTES_APP = {
  state: appState,
  courses: COURSES,
  loadPDF: loadPDF
};

console.log('Notes.js loaded successfully');
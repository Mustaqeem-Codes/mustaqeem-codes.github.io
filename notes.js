// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  pdfWorkerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  defaultZoom: 100,
  debounceDelay: 300,
  animationDuration: 1500,
  corsProxy: 'https://corsproxy.io/?', // CORS proxy for GitHub raw URLs
  fallbackPdf: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' // Fallback test PDF
};

pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfWorkerSrc;

// ============================================
// COURSE DATA WITH MULTIPLE OPTIONS
// ============================================
const COURSES = [
  {
    id: "la",
    title: "LINEAR ALGEBRA",
    subtitle: "Systems of Linear Equations, Matrix Operations, Vector Spaces, Linear Transformations, Eigenvalues & Eigenvectors, Diagonalization, Applications in Engineering & CS",
    
    // OPTION 1: GitHub Pages URL (Primary - if PDFs are in docs folder)
    githubPagesUrl: "https://mustaqeem-codes.github.io/Academic_Notes/Linear_Algebra.pdf",
    
    // OPTION 2: GitHub Raw URL with CORS proxy (Fallback)
    githubRawUrl: "https://raw.githubusercontent.com/Mustaqeem-Codes/mustaqeem-codes.github.io/main/Academic_Notes/Linear_Algebra.pdf",
    
    // OPTION 3: Direct raw URL (may have CORS issues)
    directUrl: "https://github.com/Mustaqeem-Codes/mustaqeem-codes.github.io/raw/main/Academic_Notes/Linear_Algebra.pdf",
    
    // Current active URL (will be determined)
    pdfPath: "", // Will be set dynamically
    filename: "Linear_Algebra.pdf",
    pages: 115,
    size: "52.9 MB",
    highlight: "Comprehensive Linear Algebra Concepts for CS & Engineering",
    description: "Covers fundamental linear algebra topics including matrix operations, vector spaces, linear transformations, eigenvalues and eigenvectors, and their applications in engineering and computer science.",
    color: "#00ffff",
    category: "Mathematics",
    tags: ["linear-algebra", "matrices", "vector-spaces", "eigenvalues"]
  },
  {
    id: "aps",
    title: "APPLIED PROBABILITY & STATISTICS",
    subtitle: "Probability Theory, Random Variables, Distributions, Markov Chains, Statistical Models, Queueing Theory, CS Applications, Predictive Modeling",
    
    githubPagesUrl: "https://mustaqeem-codes.github.io/Academic_Notes/Applied_Probability_and_Statistics.pdf",
    githubRawUrl: "https://raw.githubusercontent.com/Mustaqeem-Codes/mustaqeem-codes.github.io/main/Academic_Notes/Applied_Probability_and_Statistics.pdf",
    directUrl: "https://github.com/Mustaqeem-Codes/mustaqeem-codes.github.io/raw/main/Academic_Notes/Applied_Probability_and_Statistics.pdf",
    pdfPath: "",
    filename: "Applied_Probability_and_Statistics.pdf",
    pages: 89,
    size: "73.7 MB",
    highlight: "Applied Probability & Statistical Concepts for Data & CS",
    description: "Introduces probability theory, stochastic processes, and statistical modeling with practical applications in computer science, data analysis, and predictive modeling.",
    color: "#00ffaa",
    category: "Mathematics",
    tags: ["probability", "statistics", "stochastic", "modeling"]
  },
  {
    id: "dm",
    title: "DISCRETE MATHEMATICS",
    subtitle: "Logic, Set Theory, Combinatorics, Graph Theory, Boolean Algebra, Relations & Functions, Algorithms & Complexity, CS Applications",
    
    githubPagesUrl: "https://mustaqeem-codes.github.io/Academic_Notes/Discrete_Mathematics.pdf",
    githubRawUrl: "https://raw.githubusercontent.com/Mustaqeem-Codes/mustaqeem-codes.github.io/main/Academic_Notes/Discrete_Mathematics.pdf",
    directUrl: "https://github.com/Mustaqeem-Codes/mustaqeem-codes.github.io/raw/main/Academic_Notes/Discrete_Mathematics.pdf",
    pdfPath: "",
    filename: "Discrete_Mathematics.pdf",
    pages: 92,
    size: "68.3 MB",
    highlight: "Key Discrete Math Concepts for Algorithms & Computer Science",
    description: "Covers key topics in discrete mathematics including propositional logic, set theory, combinatorial analysis, graph theory, and their applications in algorithms and computer science.",
    color: "#9d00ff",
    category: "Mathematics",
    tags: ["discrete-math", "logic", "graph-theory", "combinatorics"]
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
  fallbackMode: false,
  activePdfUrl: ""
};

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
// URL VALIDATION & FALLBACK SYSTEM
// ============================================
async function testUrlAccessibility(url) {
  try {
    console.log('Testing URL accessibility:', url);
    
    // Try HEAD request first
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    // If HEAD works or fails gracefully, try GET
    const getResponse = await fetch(url, { 
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    
    // Check if we got a response (even if CORS blocked)
    if (getResponse.type === 'opaque') {
      console.log('URL accessible but CORS restricted');
      return { accessible: true, corsRestricted: true };
    }
    
    return { accessible: true, corsRestricted: false };
    
  } catch (error) {
    console.log('URL test failed:', error.message);
    return { accessible: false, corsRestricted: false, error: error.message };
  }
}

async function determineBestUrl(course) {
  console.log('Determining best URL for:', course.title);
  
  // Try GitHub Pages URL first
  let testResult = await testUrlAccessibility(course.githubPagesUrl);
  if (testResult.accessible) {
    console.log('Using GitHub Pages URL');
    return course.githubPagesUrl;
  }
  
  // Try GitHub Raw URL with CORS proxy
  const proxiedUrl = CONFIG.corsProxy + encodeURIComponent(course.githubRawUrl);
  testResult = await testUrlAccessibility(proxiedUrl);
  if (testResult.accessible) {
    console.log('Using CORS-proxied GitHub Raw URL');
    return proxiedUrl;
  }
  
  // Try direct GitHub Raw URL
  testResult = await testUrlAccessibility(course.githubRawUrl);
  if (testResult.accessible) {
    console.log('Using direct GitHub Raw URL');
    return course.githubRawUrl;
  }
  
  // Try direct URL
  testResult = await testUrlAccessibility(course.directUrl);
  if (testResult.accessible) {
    console.log('Using direct URL');
    return course.directUrl;
  }
  
  // All failed, use fallback
  console.log('All URLs failed, using fallback');
  appState.fallbackMode = true;
  return CONFIG.fallbackPdf;
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Initializing Notes Viewer...');
  
  if (elements.currentYear) {
    elements.currentYear.textContent = new Date().getFullYear();
  }
  
  // Initialize matrix background
  initMatrixBackground();
  
  // Determine best URLs for all courses
  await initializeCourseUrls();
  
  // Render courses
  renderCourses();
  
  // Setup event listeners
  setupEventListeners();
  
  console.log('Notes Viewer initialized successfully');
});

async function initializeCourseUrls() {
  console.log('Initializing course URLs...');
  
  for (const course of COURSES) {
    const bestUrl = await determineBestUrl(course);
    course.pdfPath = bestUrl;
    console.log(`Course "${course.title}" using URL:`, bestUrl);
  }
}

function initMatrixBackground() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let animationId = null;
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#0f0';
    ctx.font = '14px "Share Tech Mono"';
    
    // Draw matrix rain effect
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const char = String.fromCharCode(0x30a0 + Math.random() * 96);
      ctx.fillText(char, x, y);
    }
    
    animationId = requestAnimationFrame(draw);
  }
  
  window.addEventListener('resize', resize);
  resize();
  draw();
  
  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (animationId) cancelAnimationFrame(animationId);
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
  
  const query = appState.searchQuery.toLowerCase();
  
  // Filter courses based on search
  const filteredCourses = COURSES.filter(course => {
    if (!query) return true;
    
    return course.title.toLowerCase().includes(query) ||
           course.subtitle.toLowerCase().includes(query) ||
           course.description.toLowerCase().includes(query) ||
           course.tags.some(tag => tag.toLowerCase().includes(query)) ||
           course.category.toLowerCase().includes(query);
  });
  
  // Show search results
  if (elements.searchResults) {
    if (query && filteredCourses.length > 0) {
      elements.searchResults.textContent = `Found ${filteredCourses.length} course${filteredCourses.length !== 1 ? 's' : ''}`;
      elements.searchResults.style.display = 'block';
    } else if (query && filteredCourses.length === 0) {
      elements.searchResults.textContent = 'No courses found';
      elements.searchResults.style.display = 'block';
    } else {
      elements.searchResults.style.display = 'none';
    }
  }
  
  // Generate HTML for courses
  const coursesHTML = filteredCourses.map(course => `
    <div class="course-card ${appState.currentCourse?.id === course.id ? 'active' : ''}" 
         data-id="${course.id}" 
         tabindex="0" 
         role="button"
         aria-label="View ${course.title} notes">
      <h3 class="course-title" style="color: ${course.color}">${course.title}</h3>
      <p class="course-subtitle">${course.subtitle}</p>
      <div class="course-meta">
        <span class="course-info">
          <strong>${course.size}</strong> • ${course.pages} pages • ${course.category}
        </span>
        ${appState.fallbackMode && course.pdfPath === CONFIG.fallbackPdf ? 
          '<span class="fallback-badge">Using Sample PDF</span>' : ''}
      </div>
      <div class="course-tags">
        ${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
  
  elements.coursesGrid.innerHTML = coursesHTML;
  
  // Add event listeners to course cards
  document.querySelectorAll('.course-card').forEach(card => {
    const courseId = card.dataset.id;
    const course = COURSES.find(c => c.id === courseId);
    
    if (!course) return;
    
    // Click event
    card.addEventListener('click', () => {
      loadPDF(course);
    });
    
    // Keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadPDF(course);
      }
    });
  });
}

// ============================================
// PDF LOADING WITH ENHANCED ERROR HANDLING
// ============================================
async function loadPDF(course) {
  if (!course || appState.isLoading) return;
  
  console.log('Loading PDF:', course.title);
  console.log('Using URL:', course.pdfPath);
  
  appState.currentCourse = course;
  appState.currentPage = 1;
  appState.isLoading = true;
  appState.activePdfUrl = course.pdfPath;
  
  // Update UI
  showPDFViewer();
  showLoading();
  hideError();
  
  // Set PDF title
  elements.pdfTitle.textContent = course.title;
  
  // Setup download button
  elements.downloadBtn.onclick = () => {
    const a = document.createElement('a');
    a.href = course.pdfPath;
    a.download = course.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // Setup open in new tab button
  elements.openFullBtn.onclick = () => {
    let openUrl = course.pdfPath;
    
    // If using CORS proxy, extract original URL
    if (openUrl.includes(CONFIG.corsProxy)) {
      openUrl = decodeURIComponent(openUrl.replace(CONFIG.corsProxy, ''));
    }
    
    // For GitHub raw URLs, convert to blob URL for viewing
    if (openUrl.includes('raw.githubusercontent.com')) {
      openUrl = openUrl.replace('raw.githubusercontent.com', 'github.com')
                       .replace('/raw/', '/blob/');
    }
    
    window.open(openUrl, '_blank', 'noopener,noreferrer');
  };
  
  try {
    // Try to load PDF with multiple fallbacks
    let pdf = null;
    let loadingError = null;
    
    // Try standard loading first
    try {
      const loadingTask = pdfjsLib.getDocument({
        url: course.pdfPath,
        withCredentials: false,
        httpHeaders: {
          'Accept': 'application/pdf'
        }
      });
      
      pdf = await loadingTask.promise;
    } catch (firstError) {
      loadingError = firstError;
      console.log('First loading attempt failed:', firstError.message);
      
      // If using CORS proxy and it failed, try direct URL
      if (course.pdfPath.includes(CONFIG.corsProxy)) {
        console.log('Trying direct URL as fallback...');
        try {
          const directLoadingTask = pdfjsLib.getDocument({
            url: course.githubRawUrl,
            withCredentials: false
          });
          pdf = await directLoadingTask.promise;
          appState.activePdfUrl = course.githubRawUrl;
        } catch (secondError) {
          loadingError = secondError;
          
          // Try fallback PDF
          console.log('Using fallback PDF');
          const fallbackTask = pdfjsLib.getDocument(CONFIG.fallbackPdf);
          pdf = await fallbackTask.promise;
          appState.activePdfUrl = CONFIG.fallbackPdf;
          appState.fallbackMode = true;
        }
      }
    }
    
    if (!pdf) {
      throw new Error('Could not load PDF from any source');
    }
    
    appState.currentPdf = pdf;
    appState.totalPages = pdf.numPages;
    
    console.log(`✅ PDF loaded successfully: ${pdf.numPages} pages`);
    
    // Update UI controls
    updatePageControls();
    
    // Render first page
    await renderPage();
    
    // Update UI
    hideLoading();
    
    // Update active card
    updateActiveCard(course.id);
    
  } catch (error) {
    console.error('PDF loading failed completely:', error);
    
    // Show detailed error
    let errorMessage = `Failed to load "${course.title}" PDF.\n\n`;
    errorMessage += `Attempted URL: ${course.pdfPath}\n`;
    errorMessage += `Error: ${error.message}\n\n`;
    
    if (error.name === 'InvalidPDFException') {
      errorMessage += "The PDF file may be corrupted or in an unsupported format.\n";
    } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
      errorMessage += "Network error or CORS restriction.\n";
      errorMessage += "Try uploading PDFs to a different hosting service.\n";
    } else {
      errorMessage += "Please check if the PDF exists at the specified location.\n";
    }
    
    errorMessage += "\nPossible solutions:\n";
    errorMessage += "1. Upload PDFs to GitHub Pages /docs folder\n";
    errorMessage += "2. Use Google Drive or Dropbox for hosting\n";
    errorMessage += "3. Check if PDF files are properly uploaded\n";
    
    showPDFError(new Error(errorMessage));
  } finally {
    appState.isLoading = false;
  }
}

async function renderPage() {
  if (!appState.currentPdf || appState.currentPage < 1) {
    throw new Error('No PDF loaded or invalid page number');
  }
  
  try {
    const page = await appState.currentPdf.getPage(appState.currentPage);
    const container = elements.pdfCanvas.parentElement;
    const canvas = elements.pdfCanvas;
    const ctx = canvas.getContext('2d');
    
    if (!container) {
      throw new Error('PDF container not found');
    }
    
    // Calculate dimensions
    const A4_WIDTH = 595;
    const containerWidth = container.clientWidth - 60;
    const scale = Math.min((containerWidth / A4_WIDTH) * (appState.zoom / 100), 1.5);
    
    const viewport = page.getViewport({ scale });
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    
    ctx.scale(dpr, dpr);
    
    // Clear canvas
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    
    // Render PDF page
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    
    await page.render(renderContext).promise;
    
    // Update page controls
    updatePageControls();
    
  } catch (error) {
    console.error('Error rendering PDF page:', error);
    throw error;
  }
}

// ============================================
// PAGE NAVIGATION
// ============================================
function goToPage(pageNumber) {
  if (!appState.currentPdf) return;
  
  const newPage = Math.max(1, Math.min(appState.totalPages, pageNumber));
  if (newPage !== appState.currentPage) {
    appState.currentPage = newPage;
    updatePageControls();
    renderPage().catch(error => {
      console.error('Error going to page:', error);
      showPDFError(error);
    });
  }
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

// ============================================
// UI HELPER FUNCTIONS
// ============================================
function showPDFViewer() {
  if (elements.pdfSection) {
    elements.pdfSection.classList.add('active');
    
    // Smooth scroll to PDF viewer
    setTimeout(() => {
      elements.pdfSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }
}

function showLoading() {
  if (elements.loadingIndicator) {
    elements.loadingIndicator.hidden = false;
  }
  if (elements.pdfCanvas) {
    elements.pdfCanvas.style.opacity = '0.3';
    elements.pdfCanvas.style.pointerEvents = 'none';
  }
}

function hideLoading() {
  if (elements.loadingIndicator) {
    elements.loadingIndicator.hidden = true;
  }
  if (elements.pdfCanvas) {
    elements.pdfCanvas.style.opacity = '1';
    elements.pdfCanvas.style.pointerEvents = 'auto';
  }
}

function showPDFError(error) {
  if (elements.errorIndicator && elements.errorMessage) {
    elements.errorMessage.textContent = error.message;
    elements.errorIndicator.hidden = false;
  }
  hideLoading();
}

function hideError() {
  if (elements.errorIndicator) {
    elements.errorIndicator.hidden = true;
  }
}

function updateActiveCard(courseId) {
  document.querySelectorAll('.course-card').forEach(card => {
    card.classList.toggle('active', card.dataset.id === courseId);
  });
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
  // Search functionality
  if (elements.searchBar) {
    let searchTimeout;
    elements.searchBar.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        appState.searchQuery = e.target.value.trim();
        renderCourses();
      }, CONFIG.debounceDelay);
    });
    
    // Clear search on Escape
    elements.searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.target.value = '';
        appState.searchQuery = '';
        renderCourses();
      }
    });
  }
  
  // Page navigation buttons
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
        case 'Home':
          e.preventDefault();
          goToPage(1);
          break;
        case 'End':
          e.preventDefault();
          goToPage(appState.totalPages);
          break;
      }
    }
  });
}

// ============================================
// EXPORT FOR DEBUGGING
// ============================================
window.NOTES_APP = {
  state: appState,
  courses: COURSES,
  config: CONFIG,
  loadPDF: loadPDF,
  testUrls: async function() {
    console.log('Testing all course URLs...');
    for (const course of COURSES) {
      console.log(`\nTesting: ${course.title}`);
      console.log('GitHub Pages:', course.githubPagesUrl);
      console.log('GitHub Raw:', course.githubRawUrl);
      console.log('Direct:', course.directUrl);
      console.log('Current:', course.pdfPath);
      
      const result = await testUrlAccessibility(course.pdfPath);
      console.log('Accessible:', result.accessible);
    }
  }
};

console.log('Notes.js loaded successfully');
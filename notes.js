// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  pdfWorkerSrc: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  defaultZoom: 100,
  debounceDelay: 300,
  animationDuration: 1500
};

pdfjsLib.GlobalWorkerOptions.workerSrc = CONFIG.pdfWorkerSrc;

// ============================================
// COURSE DATA (Using Local Paths for Speed/CORS)
// ============================================
const COURSES = [
  {
    id: "la",
    title: "LINEAR ALGEBRA",
    subtitle: "Systems of Linear Equations, Matrix Operations, Vector Spaces, Linear Transformations, Eigenvalues & Eigenvectors, Diagonalization, Applications in Engineering & CS",
    pdfPath: "Academic_Notes/Linear_Algebra.pdf",
    filename: "Linear_Algebra.pdf",
    pages: 115,
    size: "24.7 MB",
    highlight: "Comprehensive Linear Algebra Concepts for CS & Engineering",
    description: "Covers fundamental linear algebra topics including matrix operations, vector spaces, linear transformations, eigenvalues and eigenvectors, and their applications in engineering and computer science.",
    color: "#00ffff",
    guidance: "Click to preview, download, and explore course content"
  },
  {
    id: "aps",
    title: "APPLIED PROBABILITY & STATISTICS",
    subtitle: "Probability Theory, Random Variables, Distributions, Markov Chains, Statistical Models, Queueing Theory, CS Applications, Predictive Modeling",
    pdfPath: "Academic_Notes/Applied_Probability_and_Statistics.pdf",
    filename: "Applied_Probability_and_Statistics.pdf",
    pages: 89,
    size: "73.7 MB",
    highlight: "Applied Probability & Statistical Concepts for Data & CS",
    description: "Introduces probability theory, stochastic processes, and statistical modeling with practical applications in computer science, data analysis, and predictive modeling.",
    color: "#00ffaa",
    guidance: "Click to preview, download, and explore course content"
  },
  {
    id: "dm",
    title: "DISCRETE MATHEMATICS",
    subtitle: "Logic, Set Theory, Combinatorics, Graph Theory, Boolean Algebra, Relations & Functions, Algorithms & Complexity, CS Applications",
    pdfPath: "Academic_Notes/Discrete_Mathematics.pdf",
    filename: "Discrete_Mathematics.pdf",
    pages: 92,
    size: "68.3 MB",
    highlight: "Key Discrete Math Concepts for Algorithms & Computer Science",
    description: "Covers key topics in discrete mathematics including propositional logic, set theory, combinatorial analysis, graph theory, and their applications in algorithms and computer science.",
    color: "#9d00ff",
    guidance: "Click to preview, download, and explore course content"
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
  isLoading: false
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
document.addEventListener('DOMContentLoaded', () => {
  if (elements.currentYear) elements.currentYear.textContent = new Date().getFullYear();
  initMatrixBackground();
  renderCourses();
  setupEventListeners();
});

function initMatrixBackground() {
  const canvas = document.getElementById('matrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  window.addEventListener('resize', resize);
  resize();

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    ctx.font = '14px "Share Tech Mono"';
    for (let i = 0; i < 50; i++) {
      ctx.fillText(String.fromCharCode(0x30a0 + Math.random() * 96), Math.random() * canvas.width, Math.random() * canvas.height);
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// ============================================
// RENDERING & LOGIC
// ============================================
function renderCourses() {
  const query = appState.searchQuery.toLowerCase();

  const filtered = COURSES.filter(c =>
    c.title.toLowerCase().includes(query) ||
    c.subtitle.toLowerCase().includes(query)
  );

  elements.coursesGrid.innerHTML = filtered.map(course => `
    <div class="course-card" data-id="${course.id}" tabindex="0" role="button">
      <h3 class="course-title">${course.title}</h3>
      <p class="course-subtitle">${course.subtitle}</p>
      <p class="course-guidance">${course.guidance}</p>
      <div class="course-meta">
        <span class="course-info">
          ${course.size} — ${course.pages} pages — ${course.highlight}
        </span>
      </div>
    </div>
  `).join('');

  // Add click & keyboard accessibility
  document.querySelectorAll('.course-card').forEach(card => {
    const course = COURSES.find(c => c.id === card.dataset.id);

    // Click
    card.addEventListener('click', () => {
      if (course) loadPDF(course);
    });

    // Keyboard: Enter or Space
    card.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && course) {
        e.preventDefault();
        loadPDF(course);
      }
    });
  });
}


async function loadPDF(course) {
  if (!course || appState.isLoading) return;
  
  appState.currentCourse = course;
  appState.currentPage = 1;
  appState.isLoading = true;

  showPDFViewer();
  showLoading();
  hideError();

  elements.pdfTitle.textContent = course.title;
  elements.openFullBtn.href = course.pdfPath;
  elements.downloadBtn.onclick = () => {
    const a = document.createElement("a");
    a.href = course.pdfPath;
    a.download = course.filename;
    a.click();
  };

  try {
    // Instant loading from local path
    const loadingTask = pdfjsLib.getDocument(course.pdfPath);
    const pdf = await loadingTask.promise;
    
    appState.currentPdf = pdf;
    appState.totalPages = pdf.numPages;
    
    updatePageControls();
    await renderPage(); // Initial render is instant
    hideLoading();
    updateActiveCard(course.id);
  } catch (error) {
    showPDFError(error);
  } finally {
    appState.isLoading = false;
  }
}

async function renderPage() {
  if (!appState.currentPdf) return;
  
  try {
    const page = await appState.currentPdf.getPage(appState.currentPage);
    const container = elements.pdfCanvas.parentElement;
    const canvas = elements.pdfCanvas;
    const ctx = canvas.getContext('2d');
    
    const viewport = page.getViewport({ scale: (container.clientWidth / page.getViewport({scale:1}).width) * 0.95 });
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = viewport.width * dpr;
    canvas.height = viewport.height * dpr;
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    
    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
  } catch (error) {
    console.error('Render error:', error);
  }
}

function updatePageControls() {
  elements.pageNum.value = appState.currentPage;
  elements.pageCount.textContent = appState.totalPages;
  elements.prevPage.disabled = appState.currentPage <= 1;
  elements.nextPage.disabled = appState.currentPage >= appState.totalPages;
}

function goToPage(num) {
  const newPage = Math.max(1, Math.min(appState.totalPages, num));
  if (newPage !== appState.currentPage) {
    appState.currentPage = newPage;
    updatePageControls();
    renderPage(); // Quick update
  }
}

// ============================================
// UI HELPERS
// ============================================
function showPDFViewer() { 
  elements.pdfSection.classList.add('active');
  elements.pdfSection.scrollIntoView({ behavior: 'smooth' });
}
function showLoading() { elements.loadingIndicator.hidden = false; elements.pdfCanvas.style.opacity = '0'; }
function hideLoading() { elements.loadingIndicator.hidden = true; elements.pdfCanvas.style.opacity = '1'; }
function hideError() { elements.errorIndicator.hidden = true; }
function updateActiveCard(id) {
  document.querySelectorAll('.course-card').forEach(c => c.classList.toggle('active', c.dataset.id === id));
}

function showPDFError(error) {
  elements.errorMessage.textContent = error.message;
  elements.errorIndicator.hidden = false;
  hideLoading();
}

function setupEventListeners() {
  elements.searchBar.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    renderCourses();
  });

  elements.prevPage.addEventListener('click', () => goToPage(appState.currentPage - 1));
  elements.nextPage.addEventListener('click', () => goToPage(appState.currentPage + 1));
  elements.firstPage.addEventListener('click', () => goToPage(1));
  elements.lastPage.addEventListener('click', () => goToPage(appState.totalPages));
  
  elements.pageNum.addEventListener('change', (e) => goToPage(parseInt(e.target.value)));
  
  elements.retryBtn.addEventListener('click', () => loadPDF(appState.currentCourse));
}
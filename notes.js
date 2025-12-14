// Clean JavaScript for A4 Viewer
let currentImageIndex = 0;
let isAnimating = false;

// Image data for 91 pages
const images = [
  "LA/Linear Algebra _1.png",
  "LA/Linear Algebra _2.png",
  "LA/Linear Algebra _3.png",
  "LA/Linear Algebra _4.png",
  "LA/Linear Algebra _5.png",
  "LA/Linear Algebra _6.png",
  "LA/Linear Algebra _7.png",
  "LA/Linear Algebra _8.png",
  "LA/Linear Algebra _9.png",
  "LA/Linear Algebra _10.png",

  "LA/Linear Algebra _11.png",
  "LA/Linear Algebra _12.png",
  "LA/Linear Algebra _13.png",
  "LA/Linear Algebra _14.png",
  "LA/Linear Algebra _15.png",
  "LA/Linear Algebra _16.png",
  "LA/Linear Algebra _17.png",
  "LA/Linear Algebra _18.png",
  "LA/Linear Algebra _19.png",
  "LA/Linear Algebra _20.png",

  "LA/Linear Algebra _21.png",
  "LA/Linear Algebra _22.png",
  "LA/Linear Algebra _23.png",
  "LA/Linear Algebra _24.png",
  "LA/Linear Algebra _25.png",
  "LA/Linear Algebra _26.png",
  "LA/Linear Algebra _27.png",
  "LA/Linear Algebra _28.png",
  "LA/Linear Algebra _29.png",
  "LA/Linear Algebra _30.png",

  "LA/Linear Algebra _31.png",
  "LA/Linear Algebra _32.png",
  "LA/Linear Algebra _33.png",
  "LA/Linear Algebra _34.png",
  "LA/Linear Algebra _35.png",
  "LA/Linear Algebra _36.png",
  "LA/Linear Algebra _37.png",
  "LA/Linear Algebra _38.png",
  "LA/Linear Algebra _39.png",
  "LA/Linear Algebra _40.png",

  "LA/Linear Algebra _41.png",
  "LA/Linear Algebra _42.png",
  "LA/Linear Algebra _43.png",
  "LA/Linear Algebra _44.png",
  "LA/Linear Algebra _45.png",
  "LA/Linear Algebra _46.png",
  "LA/Linear Algebra _47.png",
  "LA/Linear Algebra _48.png",
  "LA/Linear Algebra _49.png",
  "LA/Linear Algebra _50.png",

  "LA/Linear Algebra _51.png",
  "LA/Linear Algebra _52.png",
  "LA/Linear Algebra _53.png",
  "LA/Linear Algebra _54.png",
  "LA/Linear Algebra _55.png",
  "LA/Linear Algebra _56.png",
  "LA/Linear Algebra _57.png",
  "LA/Linear Algebra _58.png",
  "LA/Linear Algebra _59.png",
  "LA/Linear Algebra _60.png",

  "LA/Linear Algebra _61.png",
  "LA/Linear Algebra _62.png",
  "LA/Linear Algebra _63.png",
  "LA/Linear Algebra _64.png",
  "LA/Linear Algebra _65.png",
  "LA/Linear Algebra _66.png",
  "LA/Linear Algebra _67.png",
  "LA/Linear Algebra _68.png",
  "LA/Linear Algebra _69.png",
  "LA/Linear Algebra _70.png",

  "LA/Linear Algebra _71.png",
  "LA/Linear Algebra _72.png",
  "LA/Linear Algebra _73.png",
  "LA/Linear Algebra _74.png",
  "LA/Linear Algebra _75.png",
  "LA/Linear Algebra _76.png",
  "LA/Linear Algebra _77.png",
  "LA/Linear Algebra _78.png",
  "LA/Linear Algebra _79.png",
  "LA/Linear Algebra _80.png",

  "LA/Linear Algebra _81.png",
  "LA/Linear Algebra _82.png",
  "LA/Linear Algebra _83.png",
  "LA/Linear Algebra _84.png",
  "LA/Linear Algebra _85.png",
  "LA/Linear Algebra _86.png",
  "LA/Linear Algebra _87.png",
  "LA/Linear Algebra _88.png",
  "LA/Linear Algebra _89.png",
  "LA/Linear Algebra _90.png",

  "LA/Linear Algebra _91.png"
];
function openA4Viewer(index) {
    if (isAnimating) return;
    
    currentImageIndex = index;
    const viewer = document.getElementById('a4Viewer');
    const thumbnail = document.querySelector(`[data-index="${index}"]`);
    
    // Simple fade in
    viewer.classList.add('active');
    updateViewer();
    document.body.style.overflow = 'hidden';
}

function closeA4Viewer() {
    const viewer = document.getElementById('a4Viewer');
    viewer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function changePage(direction) {
    if (isAnimating) return;
    
    isAnimating = true;
    currentImageIndex = (currentImageIndex + direction + images.length) % images.length;
    
    // Smooth transition
    const imgElement = document.getElementById('a4FullImage');
    imgElement.style.opacity = '0';
    
    setTimeout(() => {
        updateViewer();
        setTimeout(() => {
            imgElement.style.opacity = '1';
            isAnimating = false;
        }, 50);
    }, 200);
}

function updateViewer() {
    const imgElement = document.getElementById('a4FullImage');
    const currentNum = document.getElementById('currentImgNum');
    const totalNum = document.getElementById('totalImgNum');
    
    imgElement.src = images[currentImageIndex];
    currentNum.textContent = currentImageIndex + 1;
    totalNum.textContent = images.length;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const viewer = document.getElementById('a4Viewer');
    if (!viewer.classList.contains('active')) return;
    
    if (e.key === 'Escape') closeA4Viewer();
    if (e.key === 'ArrowLeft') changePage(-1);
    if (e.key === 'ArrowRight') changePage(1);
});

// Close on background click
document.getElementById('a4Viewer').addEventListener('click', (e) => {
    if (e.target.id === 'a4Viewer') {
        closeA4Viewer();
    }
});

// Preload first few images for better performance
function preloadImages() {
    const maxPreload = 5;
    for (let i = 0; i < Math.min(maxPreload, images.length); i++) {
        const img = new Image();
        img.src = images[i];
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    preloadImages();
    // Set total images count
    document.getElementById('totalImgNum').textContent = images.length;
});
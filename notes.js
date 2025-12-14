// Clean JavaScript for A4 Viewer
let currentImageIndex = 0;
let isAnimating = false;

// Image data for 91 pages
const images = [
  "LA/Linear Algebra _1.png",
  "LA/Linear Algebra _2.jpg",
  "LA/Linear Algebra _3.jpg",
  "LA/Linear Algebra _4.jpg",
  "LA/Linear Algebra _5.jpg",
  "LA/Linear Algebra _6.jpg",
  "LA/Linear Algebra _7.jpg",
  "LA/Linear Algebra _8.jpg",
  "LA/Linear Algebra _9.jpg",
  "LA/Linear Algebra _10.jpg",

  "LA/Linear Algebra _11.jpg",
  "LA/Linear Algebra _12.jpg",
  "LA/Linear Algebra _13.jpg",
  "LA/Linear Algebra _14.jpg",
  "LA/Linear Algebra _15.jpg",
  "LA/Linear Algebra _16.jpg",
  "LA/Linear Algebra _17.jpg",
  "LA/Linear Algebra _18.jpg",
  "LA/Linear Algebra _19.jpg",
  "LA/Linear Algebra _20.jpg",

  "LA/Linear Algebra _21.jpg",
  "LA/Linear Algebra _22.jpg",
  "LA/Linear Algebra _23.jpg",
  "LA/Linear Algebra _24.jpg",
  "LA/Linear Algebra _25.jpg",
  "LA/Linear Algebra _26.jpg",
  "LA/Linear Algebra _27.jpg",
  "LA/Linear Algebra _28.jpg",
  "LA/Linear Algebra _29.jpg",
  "LA/Linear Algebra _30.jpg",

  "LA/Linear Algebra _31.jpg",
  "LA/Linear Algebra _32.jpg",
  "LA/Linear Algebra _33.jpg",
  "LA/Linear Algebra _34.jpg",
  "LA/Linear Algebra _35.jpg",
  "LA/Linear Algebra _36.jpg",
  "LA/Linear Algebra _37.jpg",
  "LA/Linear Algebra _38.jpg",
  "LA/Linear Algebra _39.jpg",
  "LA/Linear Algebra _40.jpg",

  "LA/Linear Algebra _41.jpg",
  "LA/Linear Algebra _42.jpg",
  "LA/Linear Algebra _43.jpg",
  "LA/Linear Algebra _44.jpg",
  "LA/Linear Algebra _45.jpg",
  "LA/Linear Algebra _46.jpg",
  "LA/Linear Algebra _47.jpg",
  "LA/Linear Algebra _48.jpg",
  "LA/Linear Algebra _49.jpg",
  "LA/Linear Algebra _50.jpg",

  "LA/Linear Algebra _51.jpg",
  "LA/Linear Algebra _52.jpg",
  "LA/Linear Algebra _53.jpg",
  "LA/Linear Algebra _54.jpg",
  "LA/Linear Algebra _55.jpg",
  "LA/Linear Algebra _56.jpg",
  "LA/Linear Algebra _57.jpg",
  "LA/Linear Algebra _58.jpg",
  "LA/Linear Algebra _59.jpg",
  "LA/Linear Algebra _60.jpg",

  "LA/Linear Algebra _61.jpg",
  "LA/Linear Algebra _62.jpg",
  "LA/Linear Algebra _63.jpg",
  "LA/Linear Algebra _64.jpg",
  "LA/Linear Algebra _65.jpg",
  "LA/Linear Algebra _66.jpg",
  "LA/Linear Algebra _67.jpg",
  "LA/Linear Algebra _68.jpg",
  "LA/Linear Algebra _69.jpg",
  "LA/Linear Algebra _70.jpg",

  "LA/Linear Algebra _71.jpg",
  "LA/Linear Algebra _72.jpg",
  "LA/Linear Algebra _73.jpg",
  "LA/Linear Algebra _74.jpg",
  "LA/Linear Algebra _75.jpg",
  "LA/Linear Algebra _76.jpg",
  "LA/Linear Algebra _77.jpg",
  "LA/Linear Algebra _78.jpg",
  "LA/Linear Algebra _79.jpg",
  "LA/Linear Algebra _80.jpg",

  "LA/Linear Algebra _81.jpg",
  "LA/Linear Algebra _82.jpg",
  "LA/Linear Algebra _83.jpg",
  "LA/Linear Algebra _84.jpg",
  "LA/Linear Algebra _85.jpg",
  "LA/Linear Algebra _86.jpg",
  "LA/Linear Algebra _87.jpg",
  "LA/Linear Algebra _88.jpg",
  "LA/Linear Algebra _89.jpg",
  "LA/Linear Algebra _90.jpg",

  "LA/Linear Algebra _91.jpg"
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

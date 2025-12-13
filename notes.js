// Clean JavaScript for A4 Viewer
let currentImageIndex = 0;
let isAnimating = false;

// Image data
const images = [
    'Pics/Mid DateSheet.jpg',
    'Pics/TimeTable.jpg'
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
        // ===== CONFIGURATION =====
        const CONFIG = {
            rings: 2,
            ringSectors: 30,
            ringRadius: 5, // rem (adjusted for your container size)
            animDuration: 6, // seconds
            loadingText: "Loading..."
        };

        // ===== DOM ELEMENTS =====
        const preloader = document.getElementById('preloader');
        const loadingOverlay = document.getElementById('loadingOverlay');
        const profileImage = document.getElementById('profileImage');
        const progressBar = document.getElementById('progressBar');
        const bgAnimation = document.getElementById('bgAnimation');
        const imageContainer = document.querySelector('.image-container');

        // ===== INITIALIZE 3D RING ANIMATION =====
        function initRingAnimation() {
            preloader.innerHTML = '';
            
            // Set CSS properties
            preloader.style.setProperty('--ring-radius', `${CONFIG.ringRadius}rem`);
            preloader.style.setProperty('--ring-sectors', CONFIG.ringSectors);
            preloader.style.setProperty('--anim-duration', `${CONFIG.animDuration}s`);
            preloader.style.setProperty('--ring-count', CONFIG.rings);
            
            // Create rings
            for (let r = 0; r < CONFIG.rings; r++) {
                const ring = document.createElement('div');
                ring.className = 'preloader__ring';
                
                // Create sectors
                for (let s = 0; s < CONFIG.ringSectors; s++) {
                    const sector = document.createElement('div');
                    sector.className = 'preloader__sector';
                    
                    // Assign text character
                    const char = CONFIG.loadingText[s] || "";
                    if (char) {
                        sector.textContent = char;
                        // Color matches your hover effect color
                        const hue = 180; // Cyan color
                        const saturation = 100;
                        const lightness = 70 + (s % 2) * 10; // Slight variation
                        sector.style.color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
                    }
                    
                    // Position sector
                    const angle = (360 / CONFIG.ringSectors) * s;
                    sector.style.transform = `rotateY(${angle}deg) translateZ(${CONFIG.ringRadius}rem)`;
                    
                    ring.appendChild(sector);
                }
                
                preloader.appendChild(ring);
            }
        }

        // ===== CREATE BACKGROUND PARTICLES =====
        function createBackgroundParticles() {
            const particleCount = 15;
            
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'bg-particle';
                
                // Random properties
                const size = Math.random() * 80 + 40;
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                const duration = Math.random() * 20 + 10;
                const delay = Math.random() * 5;
                
                // Apply styles
                particle.style.width = `${size}px`;
                particle.style.height = `${size}px`;
                particle.style.left = `${x}vw`;
                particle.style.top = `${y}vh`;
                particle.style.animationDuration = `${duration}s`;
                particle.style.animationDelay = `${delay}s`;
                
                // Opacity variation
                particle.style.opacity = 0.02 + Math.random() * 0.03;
                
                bgAnimation.appendChild(particle);
            }
        }

        // ===== IMAGE LOADING LOGIC =====
        function loadProfileImage() {
            return new Promise((resolve) => {
                let loaded = false;
                let progress = 0;
                
                // Simulate progress if browser doesn't support progress events
                const progressInterval = setInterval(() => {
                    if (!loaded && progress < 90) {
                        progress += Math.random() * 10;
                        progress = Math.min(progress, 90);
                        updateProgress(progress);
                    }
                }, 200);
                
                // Check if image is already cached
                if (profileImage.complete && profileImage.naturalHeight !== 0) {
                    clearInterval(progressInterval);
                    updateProgress(100);
                    setTimeout(() => resolve(), 100);
                    return;
                }
                
                // Image load events
                profileImage.onload = function() {
                    clearInterval(progressInterval);
                    loaded = true;
                    updateProgress(100);
                    
                    // Small delay for smooth transition
                    setTimeout(() => resolve(), 300);
                };
                
                profileImage.onerror = function() {
                    clearInterval(progressInterval);
                    console.warn('Image might take longer to load or failed');
                    // Still show progress and resolve
                    updateProgress(100);
                    setTimeout(() => resolve(), 500);
                };
                
                // Force load with cache busting
                const originalSrc = profileImage.src.split('?')[0];
                profileImage.src = originalSrc + '?t=' + Date.now();
            });
        }

        function updateProgress(percent) {
            progressBar.style.width = `${percent}%`;
            
            // Update ring animation speed based on progress
            const speedMultiplier = 0.8 + (percent / 100) * 0.4;
            preloader.style.animationDuration = `${CONFIG.animDuration / speedMultiplier}s`;
        }

        // ===== REVEAL IMAGE =====
        function revealImage() {
            return new Promise((resolve) => {
                // Fade out loading overlay
                loadingOverlay.classList.add('fade-out');
                
                // Wait for fade out to complete
                setTimeout(() => {
                    // Add loaded class to image
                    profileImage.classList.add('loaded');
                    
                    // Remove loading overlay completely after animation
                    setTimeout(() => {
                        loadingOverlay.style.display = 'none';
                        resolve();
                    }, 1000);
                }, 800);
            });
        }

        // ===== INITIALIZE EVERYTHING =====
        async function init() {
            console.log('Starting loading animation...');
            
            // Initialize animations
            initRingAnimation();
            createBackgroundParticles();
            
            // Start image loading
            console.log('Loading profile image...');
            await loadProfileImage();
            
            // Reveal image
            console.log('Revealing image...');
            await revealImage();
            
            console.log('Loading complete! Image ready with your exact styling.');
        }

        // ===== START ON PAGE LOAD =====
        window.addEventListener('DOMContentLoaded', init);

        // ===== ADD INTERACTIVITY =====
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX / window.innerWidth - 0.5;
            mouseY = e.clientY / window.innerHeight - 0.5;
            
            // Slight parallax effect on rings while loading
            if (!loadingOverlay.classList.contains('fade-out')) {
                const rotateY = mouseX * 8;
                const rotateX = -mouseY * 8 + 25;
                preloader.style.transform = `rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        });

        // Error handling and fallback
        window.addEventListener('error', (e) => {
            console.error('Error occurred:', e.error);
            
            // Force reveal after 5 seconds even if loading fails
            setTimeout(() => {
                if (!profileImage.classList.contains('loaded')) {
                    updateProgress(100);
                    revealImage();
                }
            }, 5000);
        });

        // Ensure image container hover works after loading
        document.addEventListener('DOMContentLoaded', () => {
            // Re-enable hover effects after image loads
            setTimeout(() => {
                imageContainer.style.pointerEvents = 'auto';
            }, 1500);
        });
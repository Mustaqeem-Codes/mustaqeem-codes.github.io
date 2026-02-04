document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('intro-overlay');
    const bgContainer = document.querySelector('.intro-bg-animation');
    const textElement = document.getElementById('intro-typing-text');
    const body = document.body;
    const brandName = "MUHAMMAD MUSTAQEEM";
    
    // Track if exit has already been triggered to prevent double execution
    let exitTriggered = false;

    // A. Initial State: Lock Scroll
    body.classList.add('intro-active');

    // B. Build Advanced 3D Warp Field - Reduced particle count for better performance
    function initWarp() {
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 60 : 120; // Fewer particles on mobile
        
        for (let i = 0; i < particleCount; i++) {
            const stream = document.createElement('div');
            stream.className = 'data-stream';
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 900 + 100;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            stream.style.left = `calc(50% + ${x}px)`;
            stream.style.top = `calc(50% + ${y}px)`;
            stream.style.animationDelay = (Math.random() * 2.5) + "s";
            bgContainer.appendChild(stream);
        }
    }

    // C. Advanced Typing Logic
    let charIndex = 0;
    function type() {
        if (charIndex < brandName.length) {
            textElement.textContent += brandName.charAt(charIndex);
            charIndex++;
            setTimeout(type, 80);
        } else {
            setTimeout(triggerExit, 2000);
        }
    }

    // D. UPDATED CLEANUP SEQUENCE - WITH MEMORY CLEANUP
    function triggerExit() {
        // Prevent double execution
        if (exitTriggered) return;
        exitTriggered = true;
        
        // Step 1: Start exit animation
        overlay.classList.add('zoom-out-exit');
        
        // Step 2: Immediately block overlay interaction
        overlay.style.pointerEvents = 'none';
        
        // Step 3: Remove intro styles BEFORE removing overlay
        setTimeout(() => {
            body.classList.remove('intro-active');
            body.classList.add('intro-removed'); // Add cleanup class
            
            // Reset body styles completely
            body.style.overflow = '';
            body.style.height = '';
            body.style.position = '';
            body.style.width = '';
            
            // Force browser reflow to ensure styles apply
            void body.offsetHeight;
        }, 800); // Slightly before animation ends

        // Step 4: Remove overlay from DOM and cleanup memory
        setTimeout(() => {
            // Remove all data-stream elements first to help garbage collection
            if (bgContainer) {
                while (bgContainer.firstChild) {
                    bgContainer.removeChild(bgContainer.firstChild);
                }
            }
            
            if (overlay && overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
            
            // Ensure all content is fully visible
            document.querySelectorAll('#canvas-container, #main-header, section').forEach(el => {
                el.style.visibility = 'visible';
                el.style.opacity = '1';
            });
            
            console.log("Intro cleanup complete. All interactions restored.");
            
            // Dispatch custom event for any listening components
            document.dispatchEvent(new CustomEvent('introComplete'));
        }, 1200); // Shorter timeout for better UX
    }

    // E. Force cleanup if user tries to interact early
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' || e.key === ' ') {
            triggerExit();
        }
    }, { once: true });
    
    document.addEventListener('click', (e) => {
        // If user clicks during intro, skip to end
        if (body.classList.contains('intro-active')) {
            e.preventDefault();
            triggerExit();
        }
    }, { once: true });

    initWarp();
    type();
});
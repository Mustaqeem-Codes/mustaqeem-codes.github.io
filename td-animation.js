// 3D Background Animation - Isolated to avoid conflicts

(function() {
    'use strict';
    
    // Check for WebGL support
    function isWebGLAvailable() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext && 
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
    
    // Check for mobile device
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Don't initialize if WebGL not supported
    if (!isWebGLAvailable()) {
        document.documentElement.classList.add('no-webgl');
        console.log('WebGL not supported - 3D background disabled');
        return;
    }
    
    // Don't initialize on low-end mobile devices
    if (isMobile() && /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        const isLowEnd = /(Android 4|Android 5|iPhone OS 9|iPhone OS 10)/i.test(navigator.userAgent);
        if (isLowEnd) {
            document.documentElement.classList.add('no-webgl');
            console.log('Low-end mobile device - 3D background disabled for performance');
            return;
        }
    }
    
    // Initialize 3D scene
    let scene, camera, renderer;
    let particleMesh, sphere;
    let mouseX = 0, mouseY = 0;
    let animationId = null;
    let isAnimating = false;
    
    function init() {
        // Scene Setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        // Renderer with performance settings
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('webgl', { 
            alpha: true, 
            antialias: !isMobile(), // Disable antialias on mobile for performance
            powerPreference: 'high-performance'
        });
        
        renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            context: context,
            alpha: true,
            antialias: !isMobile(),
            preserveDrawingBuffer: false
        });
        
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile() ? 1 : 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        
        const container = document.getElementById('td-canvas-container');
        if (container) {
            container.appendChild(renderer.domElement);
        }
        
        // Adjust particle count based on device
        const particleCount = isMobile() ? 2000 : 5000;
        
        // Particles (Digital Dust)
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for(let i = 0; i < particleCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 15;
        }
        
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: isMobile() ? 0.02 : 0.015,
            color: 0x00f3ff,
            transparent: true,
            opacity: isMobile() ? 0.6 : 0.8
        });
        
        particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particleMesh);
        
        // Central Hologram (A wireframe dodecahedron)
        const geometry = new THREE.IcosahedronGeometry(1.5, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x00f3ff, 
            wireframe: true,
            transparent: true,
            opacity: 0.2
        });
        
        sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        camera.position.z = 5;
        
        // Mouse Movement Effect (only on desktop)
        if (!isMobile()) {
            window.addEventListener('mousemove', onMouseMove, false);
        }
        
        // Touch movement for mobile
        if (isMobile()) {
            window.addEventListener('touchmove', onTouchMove, { passive: true });
        }
        
        // Setup GSAP Scroll Animations
        setupScrollAnimations();
        
        // Start animation
        isAnimating = true;
        animate();
        
        // Handle visibility change (pause when tab not active)
        document.addEventListener('visibilitychange', onVisibilityChange);
    }
    
    function onMouseMove(event) {
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    }
    
    function onTouchMove(event) {
        if (event.touches.length > 0) {
            const touch = event.touches[0];
            mouseX = (touch.clientX / window.innerWidth) - 0.5;
            mouseY = (touch.clientY / window.innerHeight) - 0.5;
        }
    }
    
    function setupScrollAnimations() {
        // Only use GSAP if it's available
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            console.log('GSAP not loaded - scroll animations disabled');
            return;
        }
        
        gsap.registerPlugin(ScrollTrigger);
        
        // Camera zoom on scroll
        gsap.to(camera.position, {
            z: 2,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
        
        // Sphere rotation on scroll
        gsap.to(sphere.rotation, {
            y: Math.PI * 2,
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: 2,
                invalidateOnRefresh: true
            }
        });
    }
    
    function animate() {
        if (!isAnimating) return;
        
        animationId = requestAnimationFrame(animate);
        
        // Smooth Camera Follow (only if not on mobile for better performance)
        if (!isMobile()) {
            camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
            camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        }
        
        camera.lookAt(scene.position);
        
        // Slower animations on mobile for battery saving
        const speedMultiplier = isMobile() ? 0.5 : 1;
        particleMesh.rotation.y += 0.001 * speedMultiplier;
        sphere.rotation.x += 0.002 * speedMultiplier;
        
        renderer.render(scene, camera);
    }
    
    function onVisibilityChange() {
        if (document.hidden) {
            // Pause animation when tab is not visible
            isAnimating = false;
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        } else {
            // Resume animation when tab becomes visible
            if (!isAnimating) {
                isAnimating = true;
                animate();
            }
        }
    }
    
    function onResize() {
        if (!camera || !renderer) return;
        
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        
        // Update GSAP ScrollTrigger on resize
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }
    
    // Cleanup function
    function cleanup() {
        isAnimating = false;
        
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        
        // Remove event listeners
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('resize', onResize);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        
        // Clean up GSAP
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
        
        // Dispose Three.js resources
        if (scene) {
            scene.traverse(object => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) {
                    if (Array.isArray(object.material)) {
                        object.material.forEach(material => material.dispose());
                    } else {
                        object.material.dispose();
                    }
                }
            });
        }
        
        if (renderer) {
            renderer.dispose();
            const container = document.getElementById('td-canvas-container');
            if (container && renderer.domElement.parentNode === container) {
                container.removeChild(renderer.domElement);
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Handle resize
    window.addEventListener('resize', onResize, false);
    
    // Make cleanup available globally in case you need it
    window.tdCleanup = cleanup;
    
    // Error handling
    window.addEventListener('error', function(e) {
        if (e.message.includes('WebGL') || e.message.includes('Three')) {
            console.error('3D Animation Error:', e.message);
            document.documentElement.classList.add('no-webgl');
            cleanup();
        }
    });
    
})();
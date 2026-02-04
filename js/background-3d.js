document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('canvas-container');
    if (!container) {
        console.error('Canvas container not found!');
        return;
    }

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for high DPI
    container.appendChild(renderer.domElement);

    // Particles (Digital Dust)
    const particlesGeometry = new THREE.BufferGeometry();
    // Optimize particle count for mobile devices and low-end hardware
    const isMobile = window.innerWidth < 768;
    const isLowEnd = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4;
    const count = isMobile ? 1000 : (isLowEnd ? 2500 : 5000);
    const positions = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.015,
        color: 0x00f3ff,
        transparent: true,
        opacity: 0.8
    });
    const particleMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particleMesh);

    // Central Hologram (A wireframe dodecahedron)
    const geometry = new THREE.IcosahedronGeometry(2, 1);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 5;

    // Mouse Movement Effect with throttling
    let mouseX = 0;
    let mouseY = 0;
    let lastMouseUpdate = 0;
    const MOUSE_THROTTLE = 33; // ~30fps for mouse updates
    
    document.addEventListener('mousemove', (event) => {
        const now = performance.now();
        if (now - lastMouseUpdate < MOUSE_THROTTLE) return;
        lastMouseUpdate = now;
        mouseX = (event.clientX / window.innerWidth) - 0.5;
        mouseY = (event.clientY / window.innerHeight) - 0.5;
    });

    // Scroll Animations with GSAP
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(camera.position, {
            z: 2,
            scrollTrigger: {
                trigger: "#education",
                start: "top bottom",
                end: "top top",
                scrub: 1
            }
        });

        gsap.to(sphere.rotation, {
            y: Math.PI * 2,
            scrollTrigger: {
                trigger: document.body,
                start: "top top",
                end: "bottom bottom",
                scrub: 2
            }
        });
    } else {
        console.warn('GSAP or ScrollTrigger not loaded. Scroll animations disabled.');
    }

    // Animation state management
    let isAnimating = true;
    let animationFrameId = null;

    // Animation Loop
    function animate() {
        if (!isAnimating) return;
        
        animationFrameId = requestAnimationFrame(animate);
        
        // Smooth Camera Follow
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.05;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.05;
        camera.lookAt(scene.position);

        particleMesh.rotation.y += 0.001;
        sphere.rotation.x += 0.002;
        
        renderer.render(scene, camera);
    }

    // Pause animation when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            isAnimating = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
                animationFrameId = null;
            }
        } else {
            isAnimating = true;
            animate();
        }
    });

    // Pause animation when canvas scrolls out of view
    const canvasObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !document.hidden) {
                if (!isAnimating) {
                    isAnimating = true;
                    animate();
                }
            } else {
                isAnimating = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            }
        });
    }, { threshold: 0.1 });

    canvasObserver.observe(container);

    animate();

    // Handle Resize with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }, 150);
    });
});
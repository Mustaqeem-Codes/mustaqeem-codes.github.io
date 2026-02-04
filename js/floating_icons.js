document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('invisibleLines');
    const githubIconsContainer = document.getElementById('githubIcons');
    const particlesContainer = document.getElementById('particles');
    const overlay = document.querySelector('.floating-icons-overlay');
    
    if (!canvas || !githubIconsContainer || !overlay) return;

    const ctx = canvas.getContext('2d');

    // Circle parameters
    let circleRadiusX = 150; // Default fallback for horizontal radius
    let circleRadiusY = 150; // Default fallback for vertical radius
    let orbitOffsetY = 0; // Vertical offset for the orbit center
    // Center is 0,0 because we are positioning relative to the centered #githubIcons div
    const centerX = 0;
    const centerY = 0;
    
    // 3D rotation state
    let rotationX = 25;
    let rotationY = 35;
    let rotationZ = 15;
    const perspective = 1000;
    let animationId = null;

    // Circles data
    const circles = [
        {
            id: 'react',
            icon: 'fab fa-react',
            color: '#61DAFB',
            angle: 0,
            speed: 0.004,
            getPoint: (angle) => ({
                x: Math.cos(angle) * circleRadiusX,
                y: Math.sin(angle) * circleRadiusY,
                z: 0
            })
        },
        {
            id: 'node',
            icon: 'fab fa-node-js',
            color: '#339933',
            angle: 60,
            speed: 0.005,
            getPoint: (angle) => ({
                x: Math.cos(angle) * circleRadiusX,
                y: 0,
                z: Math.sin(angle) * circleRadiusX
            })
        },
        {
            id: 'postgres',
            icon: 'devicon-postgresql-plain',
            color: '#336791',
            angle: 120,
            speed: 0.006,
            getPoint: (angle) => ({
                x: 0,
                y: Math.cos(angle) * circleRadiusY,
                z: Math.sin(angle) * circleRadiusY
            })
        },
        {
            id: 'vscode',
            icon: 'devicon-vscode-plain',
            color: '#007ACC',
            angle: 180,
            speed: 0.007,
            getPoint: (angle) => ({
                x: Math.cos(angle) * circleRadiusX * 0.7071,
                y: Math.sin(angle) * circleRadiusY * 0.7071,
                z: Math.sin(angle) * circleRadiusX * 0.7071
            })
        },
        {
            id: 'vscommunity',
            icon: 'devicon-visualstudio-plain',
            color: '#5C2D91',
            angle: 240,
            speed: 0.008,
            getPoint: (angle) => ({
                x: Math.cos(angle) * circleRadiusX * 0.7071,
                y: Math.cos(angle) * circleRadiusY * 0.7071,
                z: Math.sin(angle) * circleRadiusX * 0.7071
            })
        },
        {
            id: 'github',
            icon: 'fab fa-github',
            color: '#181717',
            angle: 300,
            speed: 0.009,
            getPoint: (angle) => ({
                x: Math.cos(angle) * circleRadiusX * 0.8,
                y: Math.sin(angle) * circleRadiusY * 0.6,
                z: Math.sin(angle) * circleRadiusX * 0.5
            })
        },
        {
            id: 'leetcode',
            image: 'Pics/LeetCode.png',
            color: '#FFA116',
            angle: 45,
            speed: 0.006,
            getPoint: (angle) => ({
                x: Math.sin(angle) * circleRadiusX * 0.5,
                y: Math.cos(angle) * circleRadiusY * 0.9,
                z: Math.sin(angle) * circleRadiusX * 0.8
            })
        }
    ];

    function updateDimensions() {
        // Match canvas size to the overlay container
        canvas.width = overlay.clientWidth;
        canvas.height = overlay.clientHeight;
        
        const imgContainer = document.querySelector('.image-container');
        if (imgContainer) {
            const rect = imgContainer.getBoundingClientRect();
            const baseRadius = (rect.width / 2) - 25;

            if (window.innerWidth > 768) { // Wide screens
                circleRadiusX = baseRadius + 30; // left/right 30px more
                circleRadiusY = baseRadius + 45; // top 60px, bottom 30px -> avg 45
                orbitOffsetY = -15; // Shift center up by (60-30)/2
            } else { // Mobile screens
                circleRadiusX = baseRadius; // left/right no change
                circleRadiusY = baseRadius + 60; // top/bottom 60px more
                orbitOffsetY = 0;
            }
        }
    }

    function createSocialIcons() {
        githubIconsContainer.innerHTML = '';
        circles.forEach(circle => {
            const iconElement = document.createElement('div');
            iconElement.id = `icon-${circle.id}`;
            iconElement.className = `social-icon ${circle.id}`;
            iconElement.style.backgroundColor = circle.color;
            
            if (circle.image) {
                iconElement.innerHTML = `<img src="${circle.image}" alt="${circle.id}" style="width: 24px; height: 24px; object-fit: contain;">`;
            } else {
                iconElement.innerHTML = `<i class="${circle.icon}"></i>`;
            }
            githubIconsContainer.appendChild(iconElement);
        });
    }

    function createParticles() {
        if (!particlesContainer) return;
        particlesContainer.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            const size = 1 + Math.random() * 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particlesContainer.appendChild(particle);
        }
    }

    function projectPoint(x, y, z) {
        const radX = rotationX * Math.PI / 180;
        const radY = rotationY * Math.PI / 180;
        const radZ = rotationZ * Math.PI / 180;

        let rotatedY = y * Math.cos(radX) - z * Math.sin(radX);
        let rotatedZ = y * Math.sin(radX) + z * Math.cos(radX);

        let tempX = x * Math.cos(radY) + rotatedZ * Math.sin(radY);
        rotatedZ = -x * Math.sin(radY) + rotatedZ * Math.cos(radY);
        x = tempX;

        tempX = x * Math.cos(radZ) - rotatedY * Math.sin(radZ);
        rotatedY = x * Math.sin(radZ) + rotatedY * Math.cos(radZ);
        x = tempX;

        const scale = perspective / (perspective + rotatedZ);
        return { x: x * scale + centerX, y: rotatedY * scale + centerY, z: rotatedZ, scale: scale };
    }

    function updateSocialIcons() {
        circles.forEach(circle => {
            circle.angle += circle.speed;
            const point = circle.getPoint(circle.angle);
            const projected = projectPoint(point.x, point.y, point.z);
            const iconElement = document.getElementById(`icon-${circle.id}`);
            if (iconElement) {
                const finalY = projected.y + orbitOffsetY;
                iconElement.style.transform = `translate(-50%, -50%) translate(${projected.x}px, ${finalY}px) scale(1)`;
                iconElement.style.opacity = projected.scale > 0.3 ? '1' : '0';
                iconElement.style.zIndex = Math.floor(projected.scale * 100);
            }
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        rotationY += 0.15;
        rotationX += 0.07;
        updateSocialIcons();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    updateDimensions();
    createSocialIcons();
    createParticles();
    animate();

    window.addEventListener('resize', updateDimensions);
});
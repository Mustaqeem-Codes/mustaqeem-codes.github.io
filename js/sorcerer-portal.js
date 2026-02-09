/**
 * Sorcerer Portal - Doctor Strange Style Animation
 * Fully isolated component - queries only inside .sorcerer-portal
 * Starts after 5 seconds with safe delayed init
 */

(function () {
  'use strict';

  // Portal state - scoped to this IIFE
  let portalContainer = null;
  let canvas = null;
  let ctx = null;
  let iconLayer = null;
  let animationId = null;
  let isInitialized = false;

  // Animation state
  let canvasSize = 500;
  let C = 250; // Center point
  let radius = 0;
  let rotation = 0;
  let spinSpeed = 0.035;
  let scrollPower = 0;
  let mouseX = 0;
  let mouseY = 0;
  let isHoveringIcon = false;

  // Particle systems
  const sparks = [];
  const runes = [];
  const iconEls = [];

  // Icon definitions with brand colors
  const ICONS = [
    // 12:00
    { class: 'fab fa-react', brandClass: 'icon-react', name: 'React' },
    // 02:00
    { class: 'fab fa-js-square', brandClass: 'icon-js', name: 'JavaScript' },
    // 04:00
    { class: 'fab fa-node-js', brandClass: 'icon-nodejs', name: 'Node.js' },
    // 06:00
    { class: 'fas fa-database', brandClass: 'icon-database', name: 'Database' },
    // 08:00
    { class: 'fab fa-css3-alt', brandClass: 'icon-css3', name: 'CSS3' },
    // 10:00
    { class: 'fab fa-git-alt', brandClass: 'icon-git', name: 'Git' }
  ];

  /**
   * Initialize rune particles
   */
  function initRunes() {
    runes.length = 0;
    for (let i = 0; i < 60; i++) {
      runes.push({
        angle: (i / 60) * Math.PI * 2,
        radiusOffset: Math.random() * 8 - 4,
        speed: 0.02 + Math.random() * 0.03,
        size: 1 + Math.random() * 2.5,
        pulse: 0.5 + Math.random() * 0.5,
        pulseSpeed: 3 + Math.random() * 2
      });
    }
  }

  /**
   * Create orbiting icons
   */
  function createIcons() {
    if (!iconLayer) return;

    iconLayer.innerHTML = '';
    iconEls.length = 0;

    ICONS.forEach((icon, index) => {
      const el = document.createElement('a');
      el.className = `portal-icon ${icon.brandClass}`;
      el.innerHTML = `<i class="${icon.class}"></i>`;
      el.title = icon.name;

      if (icon.link) {
        el.href = icon.link;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }

      el.addEventListener('mouseenter', () => {
        isHoveringIcon = true;
        el.style.zIndex = '40';
        createIconPulse(el);
      });

      el.addEventListener('mouseleave', () => {
        isHoveringIcon = false;
        el.style.zIndex = '20';
      });

      iconLayer.appendChild(el);
      iconEls.push({ element: el, index });
    });
  }

  /**
   * Emit spark particle
   */
  function emitSpark(angle, velocity = 4) {
    const tangent = angle + Math.PI / 2 + (Math.random() - 0.5) * 0.3;
    sparks.push({
      x: C + Math.cos(angle) * radius,
      y: C + Math.sin(angle) * radius,
      vx: Math.cos(tangent) * (velocity + Math.random() * velocity),
      vy: Math.sin(tangent) * (velocity + Math.random() * velocity),
      life: 1,
      size: Math.random() * 2 + 1,
      color: `rgba(255, ${180 + Math.random() * 75}, 60, 1)`
    });
  }

  /**
   * Create pulse effect around icon
   */
  function createIconPulse(icon) {
    try {
      const iconColor = getComputedStyle(icon).color;
      const transformMatch = icon.style.transform.match(/translate\(([\d.-]+)px[\s,]+([\d.-]+)px/);
      if (!transformMatch) return;

      const iconX = parseFloat(transformMatch[1]) + 22;
      const iconY = parseFloat(transformMatch[2]) + 22;

      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        sparks.push({
          x: iconX,
          y: iconY,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
          life: 1,
          size: Math.random() * 2 + 2,
          color: iconColor.replace(')', ', 1)').replace('rgb', 'rgba')
        });
      }
    } catch (e) {
      // Silently fail - non-critical effect
    }
  }

  /**
   * Main portal drawing function
   */
  function drawPortal() {
    if (!ctx || !isInitialized) return;

    // Clear with fade effect for motion blur
    ctx.fillStyle = 'rgba(5, 5, 5, 0.12)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    rotation += spinSpeed + scrollPower;

    // Enhanced outer edge layers
    for (let i = 0; i < 4; i++) {
      ctx.save();
      ctx.strokeStyle = i === 0 ? '#ff8c00' : `rgba(255,140,0,${0.7 - i * 0.2})`;
      ctx.lineWidth = 2 + i * 1.5;

      const dashPattern = i === 0 ? [18, 12, 40, 10]
        : i === 1 ? [12, 8, 30, 8]
          : i === 2 ? [8, 6, 20, 6] : [6, 4, 15, 4];

      ctx.setLineDash(dashPattern);
      ctx.lineDashOffset = -rotation * (80 - i * 20);
      ctx.shadowBlur = 25 + i * 10;
      ctx.shadowColor = '#ff6600';

      ctx.beginPath();
      const edgeRadius = radius + i * 3;
      ctx.arc(C, C, edgeRadius, 0, Math.PI * 2);
      ctx.stroke();

      if (i === 0 && Math.random() > 0.7) {
        const randomAngle = rotation + Math.random() * Math.PI * 2;
        emitSpark(randomAngle, 3);
      }

      ctx.restore();
    }

    // Inner rune ring
    ctx.save();
    ctx.setLineDash([8, 16, 4, 12]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 220, 140, 0.8)';
    ctx.lineDashOffset = rotation * 0.4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(255, 180, 60, 0.6)';

    ctx.beginPath();
    ctx.arc(C, C, radius * 0.82, rotation * 0.3, Math.PI * 2 + rotation * 0.3);
    ctx.stroke();
    ctx.restore();

    // Animated rune particles
    runes.forEach(rune => {
      rune.angle += rune.speed;
      const currentRadius = radius * 0.78 + rune.radiusOffset;
      const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.001 * rune.pulseSpeed);

      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 200, 80, ${0.3 + rune.pulse * pulse * 0.4})`;
      ctx.arc(
        C + Math.cos(rune.angle) * currentRadius,
        C + Math.sin(rune.angle) * currentRadius,
        rune.size * pulse,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Energy core with swirl
    const gradient = ctx.createRadialGradient(
      C, C, radius * 0.1,
      C, C, radius * 0.85
    );
    gradient.addColorStop(0, 'rgba(255, 180, 60, 0.4)');
    gradient.addColorStop(0.3, 'rgba(255, 140, 40, 0.15)');
    gradient.addColorStop(0.7, 'rgba(255, 100, 20, 0.05)');
    gradient.addColorStop(1, 'transparent');

    ctx.save();
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(C, C, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Icon orbit with mouse interaction
    const iconSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const iconOffset = (iconSize < 14) ? 16 : 22;

    iconEls.forEach(({ element, index }) => {
      const angle = rotation + index * (Math.PI * 2 / iconEls.length);
      const orbitRadius = radius * 0.88;
      const x = C + Math.cos(angle) * orbitRadius;
      const y = C + Math.sin(angle) * orbitRadius;

      element.style.transform = `translate(${x - iconOffset}px, ${y - iconOffset}px)`;

      if (Math.random() > 0.85 && !isHoveringIcon) {
        emitSpark(angle, 2);
      }

      const dx = x - mouseX;
      const dy = y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const attraction = (100 - distance) / 100;
        element.style.transform = `translate(${x - iconOffset}px, ${y - iconOffset}px) scale(${1 + attraction * 0.3})`;
      }
    });

    // Spark update & render
    for (let i = sparks.length - 1; i >= 0; i--) {
      const spark = sparks[i];
      spark.life -= 0.03;
      spark.vy += 0.2;

      const dx = spark.x - mouseX;
      const dy = spark.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        const force = (150 - distance) / 150;
        spark.vx += (dx / distance) * force * 0.5;
        spark.vy += (dy / distance) * force * 0.5;
      }

      spark.x += spark.vx;
      spark.y += spark.vy;

      ctx.save();
      ctx.fillStyle = spark.color.replace('1)', `${spark.life})`);
      ctx.shadowBlur = spark.size * 2;
      ctx.shadowColor = spark.color;
      ctx.beginPath();
      ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (spark.life <= 0) {
        sparks.splice(i, 1);
      }
    }

    scrollPower *= 0.92;
    animationId = requestAnimationFrame(drawPortal);
  }

  /**
   * Portal opening animation using GSAP
   */
  function openPortal() {
    if (typeof gsap === 'undefined') {
      // Fallback if GSAP not available
      radius = canvasSize * 0.42 + 10; // Increased radius
      spinSpeed = 0.035;
      revealIcons();
      drawPortal();
      return;
    }

    gsap.to({ r: 0 }, {
      r: canvasSize * 0.42 + 10, // Increased radius
      duration: 1.8,
      ease: 'expo.out',
      onUpdate: function () {
        radius = this.targets()[0].r;

        if (radius > 50 && Math.random() > 0.7) {
          const angle = Math.random() * Math.PI * 2;
          emitSpark(angle, radius / 30);
        }
      },
      onComplete: function () {
        spinSpeed = 0.035;
        revealIcons();
      }
    });

    drawPortal();
  }

  /**
   * Reveal icons with staggered animation
   */
  function revealIcons() {
    if (typeof gsap === 'undefined') {
      // Fallback without GSAP
      iconEls.forEach(({ element }) => {
        element.style.opacity = '1';
        element.style.transform = element.style.transform.replace('scale(0.5)', 'scale(1)');
      });
      return;
    }

    gsap.to(portalContainer.querySelectorAll('.portal-icon'), {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.5)',
      onStart: function () {
        iconEls.forEach(({ element }) => {
          element.style.boxShadow =
            '0 0 25px currentColor, inset 0 0 15px rgba(255, 200, 80, 0.5), 0 0 40px rgba(255, 140, 0, 0.4)';
        });
      }
    });
  }

  /**
   * Handle scroll for portal spin
   */
  function handleScroll() {
    scrollPower = Math.min(window.scrollY * 0.00015, 0.25);

    if (scrollPower > 0.1 && Math.random() > 0.8) {
      const randomAngle = Math.random() * Math.PI * 2;
      emitSpark(randomAngle, scrollPower * 15);
    }
  }

  /**
   * Handle mouse movement
   */
  function handleMouseMove(e) {
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    const dx = mouseX - C;
    const dy = mouseY - C;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (Math.abs(distance - radius) < 20 && Math.random() > 0.9) {
      const angle = Math.atan2(dy, dx);
      emitSpark(angle, 3);
    }
  }

  /**
   * Handle resize for responsiveness
   */
  function handleResize() {
    if (!portalContainer || !canvas) return;

    const containerWidth = portalContainer.offsetWidth;
    canvasSize = containerWidth;
    C = canvasSize / 2;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Update radius proportionally (increased radius)
    if (radius > 0) {
      radius = canvasSize * 0.42 + 10;
    }
  }

  /**
   * Add initial ambient particles
   */
  function addAmbientParticles() {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 80 + 40;
      sparks.push({
        x: C + Math.cos(angle) * r,
        y: C + Math.sin(angle) * r,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random() * 0.5 + 0.5,
        size: Math.random() * 1.5 + 0.5,
        color: `rgba(255, ${160 + Math.random() * 60}, 40, 1)`
      });
    }
  }

  /**
   * Main initialization function
   */
  function init() {
    // Find portal container - only query inside .sorcerer-portal
    portalContainer = document.querySelector('.sorcerer-portal');
    if (!portalContainer) {
      console.warn('Sorcerer Portal: Container not found');
      return;
    }

    // Get canvas and context
    canvas = portalContainer.querySelector('.portal-canvas');
    if (!canvas) {
      console.warn('Sorcerer Portal: Canvas not found');
      return;
    }

    ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('Sorcerer Portal: Canvas context not available');
      return;
    }

    // Get icon layer
    iconLayer = portalContainer.querySelector('.icon-layer');

    // Set canvas size based on container
    handleResize();

    // Initialize systems
    initRunes();
    createIcons();
    addAmbientParticles();

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    portalContainer.addEventListener('mousemove', handleMouseMove, { passive: true });

    isInitialized = true;

    // Start portal opening animation
    openPortal();
  }

  /**
   * Cleanup function
   */
  function destroy() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    window.removeEventListener('scroll', handleScroll);
    window.removeEventListener('resize', handleResize);

    if (portalContainer) {
      portalContainer.removeEventListener('mousemove', handleMouseMove);
    }

    isInitialized = false;
  }

  /**
   * Safe delayed initialization
   * Waits for DOMContentLoaded + 5 seconds as per requirements
   */
  function safeInit() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () {
        setTimeout(init, 5000);
      });
    } else {
      // DOM already loaded
      setTimeout(init, 5000);
    }
  }

  // Start initialization
  safeInit();

  // Expose destroy for cleanup if needed
  window.SorcererPortal = { destroy };

})();

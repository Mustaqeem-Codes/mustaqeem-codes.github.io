# Website Performance Optimization - Phase 1 Tracker

## Phase 1: Critical Fixes (Images + 3D Throttle + Critical CSS)

### [ ] 1. Image Optimization
- [ ] Convert Pic_Sitting.png → WebP  
- [ ] Convert DSA Certificate.png → WebP
- [ ] Convert AI Prompt Certificate.png → WebP
- [ ] Update index.html image references + lazy loading

### [x] 2. 3D Background Throttling (js/background-3d.js)
   - [x] Particles: Mobile=500, Desktop=2k  
   - [x] RAF pause complete
   - [x] Resize throttling + DPI cap
- [ ] Reduce particles: Mobile=500, Desktop=2k
- [ ] Proper RAF pause (tab visibility + IntersectionObserver)
- [ ] Add LOD for low-end devices

### [ ] 3. Critical CSS (styles/Home.css → index.html)
- [ ] Inline critical Home.css (<14kb)
- [ ] Defer non-critical CSS files
- [ ] Purge unused @keyframes

### [ ] 4. Testing & Validation
- [ ] Lighthouse audit (before/after)
- [ ] Scroll smoothness test (Chrome DevTools FPS)
- [ ] Cross-device verification

**Next**: Phase 2 (JS RAF pooling + lazy sections)

*Updated: $(date)*

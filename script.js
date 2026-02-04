/* UPDATED: Simplified Main Logic with Performance Optimizations */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  const menuIcon = document.getElementById("menu-icon");
  const nav = document.getElementById("nav");

  // Throttle utility for scroll events
  let scrollTicking = false;
  let lastScrollY = 0;

  // 1. Sticky Header on Scroll - Throttled with requestAnimationFrame
  window.addEventListener("scroll", () => {
    lastScrollY = window.scrollY;
    
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        if (lastScrollY > 50) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // 2. Mobile Menu Toggle
  if (menuIcon) {
    menuIcon.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuIcon.classList.toggle("toggle");
    });
  }

  // 3. Close menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuIcon.classList.remove("toggle");
    });
  });
});

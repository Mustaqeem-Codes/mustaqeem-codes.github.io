/* UPDATED: Simplified Main Logic */
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("main-header");
  const menuIcon = document.getElementById("menu-icon");
  const nav = document.getElementById("nav");

  // 1. Sticky Header on Scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

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

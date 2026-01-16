document.addEventListener("DOMContentLoaded", function () {
  const header = document.getElementById("main-header");
  const menuIcon = document.getElementById("menu-icon");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");
  const scrollProgress = document.querySelector(".scroll-progress");

  header.classList.remove("hidden");

  menuIcon.addEventListener("click", function () {
    nav.classList.toggle("show");
    menuIcon.classList.toggle("active");

    if (nav.classList.contains("show")) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (nav.classList.contains("show")) {
        nav.classList.remove("show");
        menuIcon.classList.remove("active");
        document.body.style.overflow = "";
      }

      navLinks.forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  document.addEventListener("click", function (event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);

    if (
      !isClickInsideNav &&
      !isClickOnMenuIcon &&
      nav.classList.contains("show")
    ) {
      nav.classList.remove("show");
      menuIcon.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / windowHeight) * 100;
    scrollProgress.style.width = scrolled + "%";

    if (scrollTop > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    updateActiveNavLink();
  });

  function updateActiveNavLink() {
    let current = "";
    const sections = document.querySelectorAll(".demo-section");

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").substring(1) === current) {
        link.classList.add("active");
      }
    });
  }

  updateActiveNavLink();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 920) {
      nav.classList.remove("show");
      menuIcon.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

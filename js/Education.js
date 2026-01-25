/* Logic: Detects when the education section is in view 
   and triggers the "Slide-in" from left and right.
*/

document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".education-section");
  const leftCard = document.querySelector(".university-overview");
  const rightCards = document.querySelector(".right-cards-container");
  const progressFills = document.querySelectorAll(".progress-fill");

  const options = { threshold: 0.25 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Trigger card animations
        leftCard.classList.add("animate-in");
        rightCards.classList.add("animate-in");

        // Trigger progress bar animations after cards arrive
        setTimeout(() => {
          progressFills.forEach((bar) => {
            const width = bar.getAttribute("style").match(/\d+%/);
            if (width) bar.style.width = width[0];
          });
        }, 1000);

        // Disconnect after animation plays once
        observer.unobserve(entry.target);
      }
    });
  }, options);

  observer.observe(section);
});




document.addEventListener("DOMContentLoaded", () => {
  const strips = Array.from(document.querySelectorAll(".semester-strip"));

  // Helper: close all strips
  const closeAll = () => {
    strips.forEach(strip => strip.classList.remove("active"));
  };

  // Helper: open a pair by index
  const openPair = (index) => {
    closeAll();

    strips[index]?.classList.add("active");

    // Open neighbor in same row
    if (index % 2 === 0) {
      strips[index + 1]?.classList.add("active");
    } else {
      strips[index - 1]?.classList.add("active");
    }
  };

  // 🔥 Initial state: Semester 1 & 2 open
  if (strips.length >= 2) {
    strips[0].classList.add("active");
    strips[1].classList.add("active");
  }

  // Click handling
  strips.forEach((strip, index) => {
    const header = strip.querySelector(".semester-header");

    header.addEventListener("click", () => {
      // If this strip is already active, do nothing
      if (strip.classList.contains("active")) return;

      openPair(index);
    });
  });
});

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
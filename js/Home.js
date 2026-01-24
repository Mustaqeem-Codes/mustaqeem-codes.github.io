const words = [
  "Full Stack Developer",
  "React.js Specialist",
  "Node.js Developer",
  "JavaScript Developer",
];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.querySelector(".typing-text");

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typingElement.textContent = currentWord.substring(0, charIndex--);
  } else {
    typingElement.textContent = currentWord.substring(0, charIndex++);
  }

  if (!isDeleting && charIndex === currentWord.length + 1) {
    isDeleting = true;
    setTimeout(type, 1000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 200);
  } else {
    setTimeout(type, isDeleting ? 60 : 120);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  type();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".animate").forEach((el) => {
    observer.observe(el);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.getElementById("home");
  const spinningCard = document.querySelector(".spinning-card-inner");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          homeSection.classList.add("content-visible");
          if (spinningCard) spinningCard.style.animationPlayState = "running";
        } else {
          if (spinningCard) spinningCard.style.animationPlayState = "paused";
        }
      });
    },
    { threshold: 0.2 }
  );

  if (homeSection) observer.observe(homeSection);
});


// Hide default browser tooltip for download button
document.addEventListener('DOMContentLoaded', function() {
  const downloadBtn = document.querySelector('.cv-portfolio-download-btn');
  if (downloadBtn) {
    // Store original title
    const originalTitle = downloadBtn.getAttribute('title');
    
    // Remove title attribute to hide default tooltip
    downloadBtn.removeAttribute('title');
    
    // Optional: Restore title when leaving page (for accessibility)
    downloadBtn.addEventListener('mouseleave', function() {
      // Only restore if not already restored
      if (!this.getAttribute('title')) {
        setTimeout(() => {
          this.setAttribute('title', originalTitle);
        }, 100);
      }
    });
    
    // Remove again on hover
    downloadBtn.addEventListener('mouseenter', function() {
      this.removeAttribute('title');
    });
  }
});
const imageUrls = [
  "Pics/home-intro.jpg",
  "Pics/UET-Lahore-Admissions-Entry-Test.jpg",
  "Pics/smart-classroom_01.jpg",
];

const slider = document.getElementById("verticalSlider");
let currentSlide = 0;
let isAnimating = false;

function initSlider() {
  slider.innerHTML = "";
  const allImages = [...imageUrls, ...imageUrls, ...imageUrls];

  allImages.forEach((url, index) => {
    const slide = document.createElement("div");
    slide.className = `slide-item ${
      index === imageUrls.length ? "active-slide" : ""
    }`;

    const img = document.createElement("img");
    img.src = url;
    img.className = "slide-img";
    img.alt = `University Image ${(index % imageUrls.length) + 1}`;

    slide.appendChild(img);
    slider.appendChild(slide);
  });

  currentSlide = imageUrls.length;
  updateSlider();
}

function updateSlider() {
  const firstSlide = document.querySelector(".slide-item");
  const slideHeight = firstSlide ? firstSlide.offsetHeight : 400;

  const slides = document.querySelectorAll(".slide-item");
  slides.forEach((slide) => slide.classList.remove("active-slide"));

  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("active-slide");
  }

  slider.style.transition = "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)";
  const translateY = -(currentSlide * slideHeight);
  slider.style.transform = `translateY(${translateY}px)`;
}

function nextSlide() {
  if (isAnimating) return;

  isAnimating = true;
  currentSlide++;

  updateSlider();

  if (currentSlide >= imageUrls.length * 2) {
    setTimeout(() => {
      slider.style.transition = "none";
      currentSlide = imageUrls.length;
      updateSlider();

      setTimeout(() => {
        slider.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        isAnimating = false;
      }, 50);
    }, 800);
  } else {
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
}

function prevSlide() {
  if (isAnimating) return;

  isAnimating = true;
  currentSlide--;

  updateSlider();

  if (currentSlide < imageUrls.length) {
    setTimeout(() => {
      slider.style.transition = "none";
      currentSlide = imageUrls.length * 2 - 1;
      updateSlider();

      setTimeout(() => {
        slider.style.transition = "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        isAnimating = false;
      }, 50);
    }, 800);
  } else {
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }
}

function autoSlide() {
  if (!isAnimating) {
    nextSlide();
  }
}

function initEducationObserver() {
  const educationSection = document.getElementById("education");
  if (!educationSection) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          educationSection.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(educationSection);
}

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  initEducationObserver();

  setInterval(autoSlide, 4000);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      prevSlide();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      nextSlide();
    }
  });
});

window.addEventListener("resize", () => {
  updateSlider();
});

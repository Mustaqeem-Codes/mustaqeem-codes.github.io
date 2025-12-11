//================== Header ==================
document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('main-header');
  const menuIcon = document.getElementById('menu-icon');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollProgress = document.querySelector('.scroll-progress');
  
  // Variables for scroll handling
  let lastScrollTop = 0;
  let scrollTimeout;
  
  // Show header initially
  header.classList.remove('hidden');
  
  // Toggle mobile menu
  menuIcon.addEventListener('click', function() {
    nav.classList.toggle('show');
    menuIcon.classList.toggle('active');
    
    // Toggle body overflow when menu is open
    if (nav.classList.contains('show')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
  
  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        menuIcon.classList.remove('active');
        document.body.style.overflow = '';
      }
      
      // Update active nav link
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInsideNav = nav.contains(event.target);
    const isClickOnMenuIcon = menuIcon.contains(event.target);
    
    if (!isClickInsideNav && !isClickOnMenuIcon && nav.classList.contains('show')) {
      nav.classList.remove('show');
      menuIcon.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
// ============ Scroll Handling ============



  // Handle scroll events for sticky header
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Update scroll progress indicator
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (scrollTop / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
    
    // Add scrolled class for header styling
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Handle header show/hide on scroll direction
    clearTimeout(scrollTimeout);
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.classList.add('hidden');
    } else {
      // Scrolling up
      header.classList.remove('hidden');
    }
    
    lastScrollTop = scrollTop;
    
    // Auto-hide header after stopping scrolling (mobile-friendly)
    scrollTimeout = setTimeout(function() {
      if (scrollTop > 100) {
        header.classList.add('hidden');
      }
    }, 1500);
    
    // Update active nav link based on scroll position
    updateActiveNavLink();
  });
  
  // Function to update active nav link based on scroll position
  function updateActiveNavLink() {
    let current = '';
    const sections = document.querySelectorAll('.demo-section');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.scrollY >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  }
  
  // Initialize active nav link
  updateActiveNavLink();
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Handle window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 920) {
      // Close mobile menu on desktop
      nav.classList.remove('show');
      menuIcon.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});


// ================= Typing Progress Bar ============

// Typing animation (already present)
const words = [
  "Full Stack Developer", 
  "React.js Specialist",
  "Node.js Developer",
  "JavaScript Developer"
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

  // Animation on scroll/load
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  document.querySelectorAll('.animate').forEach(el => {
    observer.observe(el);
  });
});


// ============== loading screen ==================
// Home Section Entrance Animation
function animateHomeSection() {
  const homeSection = document.getElementById('home');
  const homeLeft = document.querySelector('.home-left');
  const homeRight = document.querySelector('.home-right');
  
  if (!homeSection || !homeLeft || !homeRight) return;
  
  // Function to check if element is in viewport
  function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // Trigger when element is 25% from the top of viewport
    return rect.top <= windowHeight * 0.75;
  }
  
  // Function to trigger animations
  function triggerAnimations() {
    if (isInViewport(homeSection)) {
      homeLeft.classList.add('show-animate');
      homeRight.classList.add('show-animate');
      
      // Remove event listener after animation triggers
      window.removeEventListener('scroll', triggerAnimations);
    }
  }
  
  // Initial check on page load
  setTimeout(() => {
    triggerAnimations();
  }, 300); // Small delay for page to settle
  
  // Check on scroll
  window.addEventListener('scroll', triggerAnimations);
  
  // Also trigger on resize (in case of layout changes)
  window.addEventListener('resize', triggerAnimations);
}

// Run when DOM is loaded
document.addEventListener('DOMContentLoaded', animateHomeSection);

// Also run on page load (in case images load slowly)
window.addEventListener('load', animateHomeSection);

// Scroll-triggered animation (repeats when scrolling up/down)
function animateOnScroll() {
  const homeSection = document.getElementById('home');
  const homeLeft = document.querySelector('.home-left');
  const homeRight = document.querySelector('.home-right');
  
  if (!homeSection || !homeLeft || !homeRight) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add animation classes
        homeLeft.classList.add('show-animate');
        homeRight.classList.add('show-animate');
      } else {
        // Remove classes when out of view (optional)
        // homeLeft.classList.remove('show-animate');
        // homeRight.classList.remove('show-animate');
      }
    });
  }, {
    threshold: 0.3, // Trigger when 30% visible
    rootMargin: '0px 0px -100px 0px' // Trigger slightly before entering view
  });
  
  observer.observe(homeSection);
}

document.addEventListener('DOMContentLoaded', animateOnScroll);




// -----------------------Education Section--------------------------
      // Image URLs - using your existing images
      const imageUrls = [
        'Pics/home-intro.jpg',
        'Pics/UET-Lahore-Admissions-Entry-Test.jpg',
        'Pics/smart-classroom_01.jpg'
      ];

      const slider = document.getElementById('verticalSlider');
      let currentSlide = 0;
      let isAnimating = false;

      // Initialize slider with images
      function initSlider() {
        // Clear existing slides
        slider.innerHTML = '';
        
        // Create duplicate images for seamless looping
        // We need 3 copies: current set, next set (for smooth transition)
        const allImages = [...imageUrls, ...imageUrls, ...imageUrls];
        
        allImages.forEach((url, index) => {
          const slide = document.createElement('div');
          slide.className = `slide-item ${index === imageUrls.length ? 'active-slide' : ''}`;
          
          const img = document.createElement('img');
          img.src = url;
          img.className = 'slide-img';
          img.alt = `University Image ${(index % imageUrls.length) + 1}`;
          
          slide.appendChild(img);
          slider.appendChild(slide);
        });
        
        // Start at the second set (middle section)
        currentSlide = imageUrls.length;
        updateSlider();
      }

      function updateSlider() {
        // Compute slide height dynamically (responsive)
        const firstSlide = document.querySelector('.slide-item');
        const slideHeight = firstSlide ? firstSlide.offsetHeight : 400;

        // Remove active class from all slides
        const slides = document.querySelectorAll('.slide-item');
        slides.forEach(slide => slide.classList.remove('active-slide'));

        // Add active class to current slide
        if (slides[currentSlide]) {
          slides[currentSlide].classList.add('active-slide');
        }

        // Calculate translateY value using dynamic height
        const translateY = -(currentSlide * slideHeight);
        slider.style.transform = `translateY(${translateY}px)`;
      }

      function nextSlide() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentSlide++;
        
        // Update slider position
        updateSlider();
        
        // Check if we've reached the end of the second set
        if (currentSlide >= imageUrls.length * 2) {
          // Reset to middle section seamlessly
          setTimeout(() => {
            slider.style.transition = 'none';
            currentSlide = imageUrls.length;
            updateSlider();
            
            // Re-enable transition
            setTimeout(() => {
              slider.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
              isAnimating = false;
            }, 50);
          }, 800);
        } else {
          // Normal transition
          setTimeout(() => {
            isAnimating = false;
          }, 800);
        }
      }

      function prevSlide() {
        if (isAnimating) return;
        
        isAnimating = true;
        currentSlide--;
        
        // Update slider position
        updateSlider();
        
        // Check if we've reached the beginning of the second set
        if (currentSlide < imageUrls.length) {
          // Reset to middle section seamlessly
          setTimeout(() => {
            slider.style.transition = 'none';
            currentSlide = imageUrls.length * 2 - 1;
            updateSlider();
            
            // Re-enable transition
            setTimeout(() => {
              slider.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
              isAnimating = false;
            }, 50);
          }, 800);
        } else {
          // Normal transition
          setTimeout(() => {
            isAnimating = false;
          }, 800);
        }
      }

      // Auto slide function
      function autoSlide() {
        if (!isAnimating) {
          nextSlide();
        }
      }

      // Initialize when page loads
      document.addEventListener('DOMContentLoaded', () => {
        initSlider();
        
        // Start auto-sliding every 3 seconds
        setInterval(autoSlide, 3000);
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            nextSlide();
          }
        });
      });

      // Adjust on window resize
      window.addEventListener('resize', () => {
        updateSlider();
      });



// ==============================================
// SKILLS CONFIGURATION - EDIT THIS SECTION TO UPDATE SKILLS
// ==============================================

// Configuration object for all skills
const skillsConfig = {
  // Programming skills (left side - linear bars)
  programmingSkills: [
    { selector: '.oop', percent: 85, label: 'Object-Oriented Programming (OOP) concepts and implementation' },
    { selector: '.database', percent: 80, label: 'Database Design & SQL Queries (PostgreSQL, Oracle SQL)' },
    { selector: '.frontend', percent: 88, label: 'Frontend Development (HTML, CSS, JavaScript)' },
    { selector: '.backend', percent: 75, label: 'Backend Fundamentals (REST APIs, Node.js basics)' },
    { selector: '.problem-solving', percent: 90, label: 'Problem Solving & Programming Logic' },
    { selector: '.version-control', percent: 82, label: 'Version Control (Git Workflows, GitHub)' }
  ],

  // Professional skills (right side - circular bars)
  professionalSkills: [
    { selector: '.mstools', percent: 88, label: 'Microsoft Office (Word, Excel, PowerPoint)' },
    { selector: '.communication', percent: 84, label: 'Communication skills' },
    { selector: '.teamwork', percent: 90, label: 'Teamwork and collaboration' },
    { selector: '.git', percent: 82, label: 'Git & GitHub version control' }
  ],

  // Animation settings
  animation: {
    linearDelay: 300,    // Delay between each linear skill animation (ms)
    circularDelay: 200,  // Delay between each circular skill animation (ms)
    duration: 1500       // Duration of each animation (ms)
  }
};

// ==============================================
// ANIMATION CONTROLLER - NO NEED TO EDIT BELOW
// ==============================================

/**
 * Handles all skill animations and interactions
 */
class SkillsAnimator {
  constructor(config) {
    this.config = config;
    this.animationStarted = false;
    this.observer = null;
    this.init();
  }

  /**
   * Initialize the animation controller
   */
  init() {
    if ('IntersectionObserver' in window) {
      this.setupIntersectionObserver();
    } else {
      // Fallback for older browsers
      window.addEventListener('load', () => this.startAnimations());
    }
  }

  /**
   * Set up IntersectionObserver to trigger animations when section is visible
   */
  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.animationStarted) {
            this.animationStarted = true;
            this.startAnimations();
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const section = document.querySelector('.skills-container');
    if (section) {
      this.observer.observe(section);
    }
  }

  /**
   * Start all animations
   */
  startAnimations() {
    this.animateProgrammingSkills();
  }

  /**
   * Animate programming skills (left side - linear bars)
   */
  animateProgrammingSkills() {
    this.config.programmingSkills.forEach((skill, index) => {
      setTimeout(() => {
        const element = document.querySelector(skill.selector);
        if (!element) return;

        element.classList.add('visible');
        element.setAttribute('aria-valuenow', skill.percent);
        element.setAttribute('aria-label', skill.label);

        this.animateProgress(
          `${skill.selector} .progress-bar`,
          `${skill.selector} .skill-percent`,
          skill.percent,
          element
        );

        // Start professional skills animations after programming ones complete
        if (index === this.config.programmingSkills.length - 1) {
          setTimeout(() => this.animateProfessionalSkills(), 500);
        }
      }, index * this.config.animation.linearDelay);
    });
  }

  /**
   * Animate professional skills (right side - circular bars)
   */
  animateProfessionalSkills() {
    this.config.professionalSkills.forEach((skill, index) => {
      setTimeout(() => {
        const container = document.querySelector(`${skill.selector}`)?.closest('.circle-item');
        if (!container) return;

        container.classList.add('visible');
        const progressElement = container.querySelector('[role="progressbar"]');
        progressElement.setAttribute('aria-valuenow', skill.percent);
        progressElement.setAttribute('aria-label', skill.label);

        this.animateProgress(
          `${skill.selector} .circle-progress`,
          `${skill.selector} .circle-text`,
          skill.percent,
          progressElement,
          true
        );
      }, index * this.config.animation.circularDelay);
    });
  }

  /**
   * Animate progress bar/circle
   * @param {string} barSelector - Selector for the progress element
   * @param {string} textSelector - Selector for the text element
   * @param {number} targetPercent - Target percentage to animate to
   * @param {HTMLElement} element - The ARIA progressbar element
   * @param {boolean} isCircle - Whether this is a circular progress indicator
   */
  animateProgress(barSelector, textSelector, targetPercent, element, isCircle = false) {
    const bar = document.querySelector(barSelector);
    const text = document.querySelector(textSelector);
    if (!bar || !text) return;

    // Remove CSS transitions to control everything via JavaScript
    bar.style.transition = 'none';

    const startTime = performance.now();
    const startValue = 0;
    const duration = this.config.animation.duration;
    const circumference = isCircle ? 2 * Math.PI * 50 : 0;

    let animationFrameId;

    const animate = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const currentValue = startValue + (targetPercent - startValue) * progress;
      const displayValue = Math.floor(currentValue);

      // Update both elements simultaneously with the same value
      if (isCircle) {
        const offset = circumference - (circumference * currentValue) / 100;
        bar.style.strokeDashoffset = offset;
      } else {
        bar.style.width = currentValue + '%';
      }

      // Update text and ARIA attributes
      text.textContent = displayValue + '%';
      element.setAttribute('aria-valuenow', displayValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Ensure final values are exact when animation completes
        if (isCircle) {
          const finalOffset = circumference - (circumference * targetPercent) / 100;
          bar.style.strokeDashoffset = finalOffset;
        } else {
          bar.style.width = targetPercent + '%';
        }
        text.textContent = targetPercent + '%';
        element.setAttribute('aria-valuenow', targetPercent);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SkillsAnimator(skillsConfig);
});

// ==================projects===============================

document.addEventListener('DOMContentLoaded', function () {
  const modal = document.querySelector('.modal');
  const closeModal = document.querySelector('.close-modal');
  const modalContent = document.querySelector('.modal-content');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Apply directional animation classes and observer
  function applyAnimationsToCards(container = document) {
    container.querySelectorAll('.project-card').forEach((card) => {
      if (!card.classList.contains('from-left') &&
        !card.classList.contains('from-right') &&
        !card.classList.contains('from-bottom')) {

        const rect = card.getBoundingClientRect();
        const center = window.innerWidth / 2;
        const cardCenter = rect.left + rect.width / 2;

        if (cardCenter < center - 100) {
          card.classList.add('from-right');
        } else if (cardCenter > center + 100) {
          card.classList.add('from-left');
        } else {
          card.classList.add('from-bottom');
        }
      }

      observer.observe(card);
    });

    // Trigger animation slightly after load
    setTimeout(() => {
      container.querySelectorAll('.project-card').forEach(card => {
        card.classList.add('visible');
      });
    }, 200);
  }

  applyAnimationsToCards(); // Initial call

  // Modal View Output
  document.querySelectorAll('.view-output-btn').forEach(button => {
    button.addEventListener('click', function () {
      const card = this.closest('.project-card');
      const images = card.getAttribute('data-output-images').split(',');

      modalContent.innerHTML = '';
      images.forEach(imgSrc => {
        const img = document.createElement('img');
        img.src = imgSrc.trim();
        img.className = 'output-image';
        img.alt = 'Project output';
        modalContent.appendChild(img);
      });

      modal.classList.add('active');
    });
  });

  closeModal.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  // Download Button Animation
  document.querySelectorAll('.download-btn').forEach(button => {
    button.addEventListener('click', function () {
      const url = this.getAttribute('data-url');
      const btnText = this.querySelector('.btn-text');
      const checkmark = this.querySelector('.checkmark');

      this.classList.add('downloading');
      btnText.textContent = 'Downloading...';
      checkmark.style.display = 'none';

      const a = document.createElement('a');
      a.href = url;
      a.download = url.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setTimeout(() => {
        this.classList.remove('downloading');
        btnText.style.display = 'none';
        checkmark.style.display = 'inline';

        setTimeout(() => {
          btnText.style.display = 'inline';
          btnText.textContent = 'Download';
          checkmark.style.display = 'none';
        }, 2000);
      }, 1500);
    });
  });

  // Optional: Reapply animations if you dynamically add cards in future
  // Example:
  // const newCard = document.createElement('div');
  // newCard.classList.add('project-card');
  // newCard.innerHTML = `...your card HTML...`;
  // document.querySelector('.projects-container').appendChild(newCard);
  // applyAnimationsToCards(document.querySelector('.projects-container'));
});



// ================================= testimonials ===========================
document.addEventListener('DOMContentLoaded', function () {
  const starsCount = 40;
  const starColors = ['#0ef', '#f0f', '#ff0', '#0f0', '#f00', '#0ff', '#fff'];
  const section = document.querySelector('.tmq-testimonials');

  for (let i = 0; i < starsCount; i++) {
    const star = document.createElement('i');
    star.className = 'fas fa-star tmq-flying-star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${Math.random() * 1 + 0.5}rem`;
    star.style.color = starColors[Math.floor(Math.random() * starColors.length)];
    section.appendChild(star);

    let x = Math.random() * 100;
    let y = Math.random() * 100;
    let xSpeed = (Math.random() - 0.5) * 0.2;
    let ySpeed = (Math.random() - 0.5) * 0.2;

    function moveStar() {
      x += xSpeed;
      y += ySpeed;
      if (x <= 0 || x >= 100) xSpeed *= -1;
      if (y <= 0 || y >= 100) ySpeed *= -1;
      star.style.left = `${x}%`;
      star.style.top = `${y}%`;
      requestAnimationFrame(moveStar);
    }

    star.style.opacity = 1;
    moveStar();
  }

  const cards = document.querySelectorAll('.tmq-testimonial-item');

  function activateCards() {
    cards.forEach((card, i) => {
      card.classList.add('active');

      const img = card.querySelector('img');
      const dir = card.dataset.dir;
      img.classList.add(`from-${dir}`);

      setTimeout(() => {
        img.classList.add('animate-img');
        card.querySelector('h2').classList.add('show-name');

        setTimeout(() => {
          const text = card.querySelector('.tmq-testimonial-text');
          const full = text.textContent;
          text.textContent = '';
          text.style.opacity = '1';
          let j = 0;
          const type = () => {
            if (j < full.length) {
              text.textContent += full.charAt(j++);
              setTimeout(type, 15);
            }
          };
          type();

          setTimeout(() => {
            card.querySelectorAll('.tmq-rating i').forEach((star, idx) => {
              star.style.color = 'gold';
              star.style.opacity = 0;
              setTimeout(() => {
                star.style.opacity = 1;
              }, idx * 200);
            });
          }, full.length * 15 + 500);
        }, 800);
      }, i * 200); // Stagger the animations
    });
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) activateCards();
    });
  }, { threshold: 0.3 });

  observer.observe(document.querySelector('.tmq-testimonials'));
});




// ============================== footer ==================================

document.addEventListener('DOMContentLoaded', function () {
  const contactForm = document.getElementById('contactForm');

  // Form Validation
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    const name = document.getElementById('name').value.trim();
    if (name === '') {
      document.getElementById('nameError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('nameError').style.display = 'none';
    }

    // Validate Email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      document.getElementById('emailError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('emailError').style.display = 'none';
    }

    // Validate Phone (optional but if provided, validate format)
    const phone = document.getElementById('phone').value.trim();
    if (phone && !/^[\d\s\-()+]{10,}$/.test(phone)) {
      document.getElementById('phoneError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('phoneError').style.display = 'none';
    }

    // Validate Subject
    const subject = document.getElementById('subject').value.trim();
    if (subject === '') {
      document.getElementById('subjectError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('subjectError').style.display = 'none';
    }

    // Validate Message
    const message = document.getElementById('message').value.trim();
    if (message === '') {
      document.getElementById('messageError').style.display = 'block';
      isValid = false;
    } else {
      document.getElementById('messageError').style.display = 'none';
    }

    if (isValid) {
      // If form is valid, send data to server
      sendFormData({
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message
      });
    }
  });

  // Function to send form data to server
  function sendFormData(formData) {
    // Show a "sending" state to the user
    const submitBtn = contactForm.querySelector('.submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Using Fetch API to send data to your LOCAL backend
    fetch('/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        // If the server responds with an error, throw it to be caught in the .catch() block
        return response.json().then(errorData => {
          throw new Error(errorData.error || 'Server error');
        });
      }
      return response.json();
    })
    .then(data => {
      alert('Thank you for your message! We will get back to you soon.');
      contactForm.reset();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('There was an error submitting your form. Please try again. Error: ' + error.message);
    })
    .finally(() => {
      // Re-enable the button regardless of success or failure
      submitBtn.textContent = 'Send Message';
      submitBtn.disabled = false;
    });
  }
});




const hijriMonthNames = [
  "Muharram", "Safar", "Rabiʿ al-Awwal", "Rabiʿ ath-Thani",
  "Jumada al-Awwal", "Jumada ath-Thaniyah", "Rajab", "Shaʿban",
  "Ramadan", "Shawwal", "Dhu al-Qaʿdah", "Dhu al-Ḥijjah"
];

function gregorianToHijri(gDate) {
  const m = gDate.getMonth() + 1;
  const y = gDate.getFullYear();
  const d = gDate.getDate();
  const a = Math.floor((14 - m) / 12);
  const yAdj = y + 4800 - a;
  const mAdj = m + 12 * a - 3;
  const jd = d + Math.floor((153 * mAdj + 2) / 5) + 365 * yAdj +
    Math.floor(yAdj / 4) - Math.floor(yAdj / 100) +
    Math.floor(yAdj / 400) - 32045;

  const islamicEpoch = 1948439;
  let l = jd - islamicEpoch;
  const n = Math.floor(l / 10631);
  l = l - 10631 * n;
  const j = Math.floor((l - 1) / 354.36667);
  l = l - Math.floor(354.36667 * j);
  const hijriMonth = Math.min(12, Math.ceil((l) / 29.5));
  const hijriDay = jd - islamicEpoch - Math.floor(354.36667 * (n * 30 + j)) - Math.floor(29.5 * (hijriMonth - 1));
  const hijriYear = n * 30 + j + 1;
  return { day: hijriDay, month: hijriMonth, year: hijriYear };
}

function updateTime() {
  const now = new Date();

  // Update time
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  document.getElementById("time").textContent = `${hh}:${mm}:${ss}`;

  // Gregorian date
  const gregOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const gregDate = now.toLocaleDateString('en-US', gregOptions);

  // Hijri date
  const hijri = gregorianToHijri(now);
  const hijriDate = `${hijri.day} ${hijriMonthNames[hijri.month - 1]} ${hijri.year}`;

  const dateEl = document.getElementById("dates");

  if (window.innerWidth <= 500) {
    // On small screens: use line break
    dateEl.innerHTML = `${gregDate}<br>${hijriDate} (Islamic)`;
  } else {
    // On large screens: single line with spacing
    const spacer = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
    dateEl.textContent = `${gregDate}${spacer}|${spacer}${hijriDate} (Islamic)`;
  }
}

updateTime(); // initial run
setInterval(updateTime, 1000); // update every second
window.addEventListener("resize", updateTime); // update on screen resize


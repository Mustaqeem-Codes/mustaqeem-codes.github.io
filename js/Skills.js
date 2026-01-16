const skillsConfig = {
  programmingSkills: [
    {
      selector: ".oop",
      percent: 85,
      label: "Object-Oriented Programming (OOP) concepts and implementation",
    },
    {
      selector: ".database",
      percent: 80,
      label: "Database Design & SQL Queries (PostgreSQL, Oracle SQL)",
    },
    {
      selector: ".frontend",
      percent: 88,
      label: "Frontend Development (HTML, CSS, JavaScript)",
    },
    {
      selector: ".backend",
      percent: 75,
      label: "Backend Fundamentals (REST APIs, Node.js basics)",
    },
    {
      selector: ".problem-solving",
      percent: 90,
      label: "Problem Solving & Programming Logic",
    },
    {
      selector: ".version-control",
      percent: 82,
      label: "Version Control (Git Workflows, GitHub)",
    },
  ],

  professionalSkills: [
    {
      selector: ".mstools",
      percent: 88,
      label: "Microsoft Office (Word, Excel, PowerPoint)",
    },
    {
      selector: ".communication",
      percent: 84,
      label: "Communication skills",
    },
    {
      selector: ".teamwork",
      percent: 90,
      label: "Teamwork and collaboration",
    },
    {
      selector: ".git",
      percent: 82,
      label: "Git & GitHub version control",
    },
  ],

  animation: {
    linearDelay: 300,
    circularDelay: 200,
    duration: 1500,
  },
};

class SkillsAnimator {
  constructor(config) {
    this.config = config;
    this.animationStarted = false;
    this.observer = null;
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      this.setupIntersectionObserver();
    } else {
      window.addEventListener("load", () => this.startAnimations());
    }
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.animationStarted) {
            this.animationStarted = true;
            this.startAnimations();
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    const section = document.querySelector(".skills-container");
    if (section) {
      this.observer.observe(section);
    }
  }

  startAnimations() {
    this.animateProgrammingSkills();
  }

  animateProgrammingSkills() {
    this.config.programmingSkills.forEach((skill, index) => {
      setTimeout(() => {
        const element = document.querySelector(skill.selector);
        if (!element) return;

        element.classList.add("visible");
        element.setAttribute("aria-valuenow", skill.percent);
        element.setAttribute("aria-label", skill.label);

        this.animateProgress(
          `${skill.selector} .progress-bar`,
          `${skill.selector} .skill-percent`,
          skill.percent,
          element
        );

        if (index === this.config.programmingSkills.length - 1) {
          setTimeout(() => this.animateProfessionalSkills(), 500);
        }
      }, index * this.config.animation.linearDelay);
    });
  }

  animateProfessionalSkills() {
    this.config.professionalSkills.forEach((skill, index) => {
      setTimeout(() => {
        const container = document
          .querySelector(`${skill.selector}`)
          ?.closest(".circle-item");
        if (!container) return;

        container.classList.add("visible");
        const progressElement = container.querySelector('[role="progressbar"]');
        progressElement.setAttribute("aria-valuenow", skill.percent);
        progressElement.setAttribute("aria-label", skill.label);

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

  animateProgress(
    barSelector,
    textSelector,
    targetPercent,
    element,
    isCircle = false
  ) {
    const bar = document.querySelector(barSelector);
    const text = document.querySelector(textSelector);
    if (!bar || !text) return;

    bar.style.transition = "none";

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

      if (isCircle) {
        const offset = circumference - (circumference * currentValue) / 100;
        bar.style.strokeDashoffset = offset;
      } else {
        bar.style.width = currentValue + "%";
      }

      text.textContent = displayValue + "%";
      element.setAttribute("aria-valuenow", displayValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (isCircle) {
          const finalOffset =
            circumference - (circumference * targetPercent) / 100;
          bar.style.strokeDashoffset = finalOffset;
        } else {
          bar.style.width = targetPercent + "%";
        }
        text.textContent = targetPercent + "%";
        element.setAttribute("aria-valuenow", targetPercent);
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

document.addEventListener("DOMContentLoaded", () => {
  new SkillsAnimator(skillsConfig);
});

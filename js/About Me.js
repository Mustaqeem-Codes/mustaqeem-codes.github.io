// JavaScript works exactly as before, IDs are unchanged
const uetCard = document.getElementById("uet-card");
const uetGlare = document.getElementById("uet-glare");

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const rotateX = (centerY - y) / 30;
  const rotateY = (x - centerX) / 30;

  uetCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  const rect = uetCard.getBoundingClientRect();
  uetGlare.style.setProperty("--x", `${x - rect.left}px`);
  uetGlare.style.setProperty("--y", `${y - rect.top}px`);
});

document.addEventListener("mouseleave", () => {
  uetCard.style.transform = `rotateX(0deg) rotateY(0deg)`;
});

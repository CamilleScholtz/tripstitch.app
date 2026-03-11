document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header.is-hidden");
  if (!header) return;

  const hero = document.querySelector(".hero");
  if (!hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle("is-hidden", entry.isIntersecting);
    },
    { threshold: 0 }
  );

  observer.observe(hero);
});

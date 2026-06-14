// Liquid-glass refraction only renders correctly in Chromium; Safari parses
// backdrop-filter: url() but draws nothing, so gate it on a class instead of
// @supports (which only checks syntax).
if (window.chrome) {
  document.documentElement.classList.add("liquid-glass");
}

// Gate the scroll-reveal hidden state on JS being available, so content
// never stays invisible without it.
document.documentElement.classList.add("js-reveal");

document.addEventListener("DOMContentLoaded", () => {
  const revealed = document.querySelectorAll("[data-reveal]");
  if (revealed.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px" }
    );
    revealed.forEach((el) => revealObserver.observe(el));
  }

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

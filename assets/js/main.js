document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector("header.liquidGL");
  if (!header || typeof window.liquidGL !== "function") {
    header?.classList.add("liquidGL-fallback");
    return;
  }
  try {
    window.liquidGL({
      target: "header.liquidGL",
      snapshot: "body",
      resolution: 1.5,
      refraction: 0.015,
      frost: 12,
      shadow: false,
      specular: false,
      reveal: "fade",
    });
  } catch {
    header.classList.add("liquidGL-fallback");
  }
});

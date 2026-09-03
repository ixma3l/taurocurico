type StampCarouselRoot = HTMLElement & {
  __stampCarouselReady?: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function initStampCarousel(root: HTMLElement): void {
  const carouselRoot = root as StampCarouselRoot;
  if (carouselRoot.__stampCarouselReady) return;

  const toggle = root.querySelector<HTMLButtonElement>(
    "[data-stamp-carousel-toggle]",
  );
  const track = root.querySelector<HTMLElement>("[data-stamp-carousel-track]");
  if (!toggle || !track) return;

  carouselRoot.__stampCarouselReady = true;

  const view = root.ownerDocument.defaultView ?? window;
  const reducedMotion = view.matchMedia(REDUCED_MOTION_QUERY);
  let isUserPaused = false;

  const update = () => {
    const isReducedMotion = reducedMotion.matches;
    const isPaused = isReducedMotion || isUserPaused;

    root.classList.toggle("is-paused", isPaused);
    root.dataset.paused = String(isPaused);
    toggle.disabled = isReducedMotion;
    toggle.setAttribute("aria-pressed", String(isPaused));
    toggle.setAttribute(
      "aria-label",
      isReducedMotion
        ? "Animación detenida por movimiento reducido"
        : isUserPaused
          ? "Reanudar carrusel de sellos"
          : "Pausar carrusel de sellos",
    );
  };

  toggle.addEventListener("click", () => {
    if (reducedMotion.matches) return;
    isUserPaused = !isUserPaused;
    update();
  });
  reducedMotion.addEventListener("change", update);
  update();
}

export function initAllStampCarousels(): void {
  document
    .querySelectorAll<HTMLElement>("[data-stamp-carousel]")
    .forEach((root) => initStampCarousel(root));
}

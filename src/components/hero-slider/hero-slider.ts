export function initHeroSlider(root: HTMLElement): void {
  if (
    (root as HTMLElement & { __heroSliderReady?: boolean }).__heroSliderReady
  ) {
    return;
  }

  (root as HTMLElement & { __heroSliderReady?: boolean }).__heroSliderReady =
    true;

  const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
  const dots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-dot]"),
  );
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-next]");
  const progressBar = root.querySelector<HTMLElement>("[data-progress]");

  if (!slides.length) return;

  const autoPlayMs = Number(root.dataset.autoplay ?? "4500");
  let current = 0;
  let autoplayId: number | null = null;

  const restartProgress = () => {
    if (!progressBar) return;
    progressBar.classList.remove("is-animating");
    progressBar.style.setProperty("--autoplay", `${autoPlayMs}ms`);
    void progressBar.offsetWidth;
    progressBar.classList.add("is-animating");
  };

  const setSlide = (index: number) => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const isActive = i === current;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    dots.forEach((dot, i) => {
      const isActive = i === current;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });

    restartProgress();
  };

  const nextSlide = () => setSlide(current + 1);
  const prevSlide = () => setSlide(current - 1);

  const stopAutoplay = () => {
    if (autoplayId !== null) {
      window.clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  const startAutoplay = () => {
    if (slides.length <= 1) {
      restartProgress();
      return;
    }

    stopAutoplay();
    autoplayId = window.setInterval(nextSlide, autoPlayMs);
    restartProgress();
  };

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    startAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    startAutoplay();
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setSlide(index);
      startAutoplay();
    });
  });

  root.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      nextSlide();
      startAutoplay();
    }

    if (event.key === "ArrowLeft") {
      prevSlide();
      startAutoplay();
    }
  });

  setSlide(0);
  startAutoplay();
}

export function initAllHeroSliders(): void {
  document
    .querySelectorAll<HTMLElement>("[data-hero-slider]")
    .forEach((root) => initHeroSlider(root));
}

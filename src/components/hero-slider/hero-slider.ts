const TRANSITION_PHASE_MS = 500;
const SWIPE_THRESHOLD_PX = 50;

type SliderRoot = HTMLElement & { __heroSliderReady?: boolean };

export function initHeroSlider(root: HTMLElement): void {
  const sliderRoot = root as SliderRoot;
  if (sliderRoot.__heroSliderReady) return;

  const slides = Array.from(root.querySelectorAll<HTMLElement>("[data-slide]"));
  if (!slides.length) return;

  sliderRoot.__heroSliderReady = true;

  const dots = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-dot]"),
  );
  const prevBtn = root.querySelector<HTMLButtonElement>("[data-prev]");
  const nextBtn = root.querySelector<HTMLButtonElement>("[data-next]");
  const controls = root.querySelector<HTMLElement>("[data-controls]");
  const view = root.ownerDocument.defaultView ?? window;
  const reducedMotion = view.matchMedia?.(
    "(prefers-reduced-motion: reduce)",
  ).matches ?? false;

  let current = 0;
  let isAnimating = false;
  let touchStartX: number | null = null;

  if (controls) controls.hidden = slides.length < 2;

  const setSlideAccessibility = (activeIndex: number | null) => {
    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.inert = !isActive;
    });
  };

  const updateDots = () => {
    dots.forEach((dot, index) => {
      const isActive = index === current;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  const showSlide = (index: number) => {
    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === index;
      slide.classList.toggle("is-active", isActive);
      slide.classList.remove("is-leaving");
    });
    setSlideAccessibility(index);
  };

  const goToSlide = (index: number) => {
    if (slides.length < 2 || isAnimating) return;

    const target = (index + slides.length) % slides.length;
    if (target === current) return;

    if (reducedMotion) {
      current = target;
      updateDots();
      showSlide(current);
      return;
    }

    isAnimating = true;
    const previous = current;
    current = target;

    updateDots();
    slides[previous].classList.remove("is-active");
    slides[previous].classList.add("is-leaving");
    setSlideAccessibility(null);

    view.setTimeout(() => {
      slides[previous].classList.remove("is-leaving");
      slides[current].classList.add("is-active");
      setSlideAccessibility(current);

      view.setTimeout(() => {
        isAnimating = false;
      }, TRANSITION_PHASE_MS);
    }, TRANSITION_PHASE_MS);
  };

  const nextSlide = () => goToSlide(current + 1);
  const prevSlide = () => goToSlide(current - 1);

  prevBtn?.addEventListener("click", prevSlide);
  nextBtn?.addEventListener("click", nextSlide);

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  root.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextSlide();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prevSlide();
    }
  });

  root.addEventListener(
    "touchstart",
    (event: TouchEvent) => {
      touchStartX = event.changedTouches[0]?.screenX ?? null;
    },
    { passive: true },
  );

  root.addEventListener(
    "touchend",
    (event: TouchEvent) => {
      const touchEndX = event.changedTouches[0]?.screenX;
      if (touchStartX === null || touchEndX === undefined) return;

      const distance = touchEndX - touchStartX;
      touchStartX = null;

      if (distance < -SWIPE_THRESHOLD_PX) nextSlide();
      else if (distance > SWIPE_THRESHOLD_PX) prevSlide();
    },
    { passive: true },
  );

  current = Math.max(
    0,
    slides.findIndex((slide) => slide.classList.contains("is-active")),
  );
  showSlide(current);
  updateDots();
}

export function initAllHeroSliders(): void {
  document
    .querySelectorAll<HTMLElement>("[data-hero-slider]")
    .forEach((root) => initHeroSlider(root));
}

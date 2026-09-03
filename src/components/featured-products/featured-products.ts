type FeaturedProductsRoot = HTMLElement & {
  __featuredProductsReady?: boolean;
};

export function initFeaturedProductsCarousel(root: HTMLElement): void {
  const carouselRoot = root as FeaturedProductsRoot;
  if (carouselRoot.__featuredProductsReady) return;

  const items = Array.from(
    root.querySelectorAll<HTMLElement>("[data-featured-product]"),
  );
  const track = root.querySelector<HTMLElement>(
    "[data-featured-products-track]",
  );
  const previousButton = root.querySelector<HTMLButtonElement>(
    "[data-featured-products-previous]",
  );
  const nextButton = root.querySelector<HTMLButtonElement>(
    "[data-featured-products-next]",
  );
  const controls = root.querySelector<HTMLElement>(
    "[data-featured-products-controls]",
  );

  if (!items.length || !track || !previousButton || !nextButton) return;

  carouselRoot.__featuredProductsReady = true;

  const view = root.ownerDocument.defaultView ?? window;
  let currentIndex = 0;

  const getVisibleCount = (): number => {
    const value = view
      .getComputedStyle(root)
      .getPropertyValue("--featured-products-visible-count");
    const parsedValue = Number.parseInt(value, 10);

    if (!Number.isFinite(parsedValue) || parsedValue < 1) return 1;
    return Math.min(parsedValue, items.length);
  };

  const update = () => {
    const visibleCount = getVisibleCount();
    const maximumIndex = Math.max(0, items.length - visibleCount);
    currentIndex = Math.min(Math.max(currentIndex, 0), maximumIndex);

    root.dataset.currentIndex = String(currentIndex);
    root.style.setProperty(
      "--featured-products-current-index",
      String(currentIndex),
    );

    const isAtStart = currentIndex === 0;
    const isAtEnd = currentIndex === maximumIndex;
    previousButton.disabled = isAtStart;
    nextButton.disabled = isAtEnd;
    previousButton.setAttribute("aria-disabled", String(isAtStart));
    nextButton.setAttribute("aria-disabled", String(isAtEnd));

    if (controls) controls.hidden = maximumIndex === 0;
  };

  previousButton.addEventListener("click", () => {
    currentIndex -= 1;
    update();
  });

  nextButton.addEventListener("click", () => {
    currentIndex += 1;
    update();
  });

  view.addEventListener("resize", update);
  update();
}

export function initAllFeaturedProductsCarousels(): void {
  document
    .querySelectorAll<HTMLElement>("[data-featured-products]")
    .forEach((root) => initFeaturedProductsCarousel(root));
}

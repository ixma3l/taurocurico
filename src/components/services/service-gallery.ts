type ServiceGalleryRoot = HTMLElement & { __serviceGalleryReady?: boolean };

export function initServiceGallery(root: HTMLElement): void {
  const galleryRoot = root as ServiceGalleryRoot;
  if (galleryRoot.__serviceGalleryReady) return;

  galleryRoot.__serviceGalleryReady = true;

  const mainImage = root.querySelector<HTMLImageElement>(
    "[data-service-gallery-image]",
  );
  const thumbnails = Array.from(
    root.querySelectorAll<HTMLButtonElement>(
      "[data-service-gallery-thumbnail]",
    ),
  );
  const previousButton = root.querySelector<HTMLButtonElement>(
    "[data-service-gallery-previous]",
  );
  const nextButton = root.querySelector<HTMLButtonElement>(
    "[data-service-gallery-next]",
  );

  if (!mainImage || thumbnails.length === 0 || !previousButton || !nextButton) {
    return;
  }

  const selectThumbnail = (
    thumbnail: HTMLButtonElement,
    focusThumbnail = false,
    revealThumbnail = false,
  ): void => {
    const nextImage = thumbnail.dataset.image;
    const nextAlt = thumbnail.dataset.alt;
    const nextIndex = thumbnail.dataset.index;

    if (!nextImage || !nextAlt || nextIndex === undefined) return;

    root.dataset.selectedIndex = nextIndex;
    thumbnails.forEach((candidate) => {
      const isSelected = candidate === thumbnail;
      candidate.classList.toggle("is-selected", isSelected);
      candidate.setAttribute("aria-pressed", String(isSelected));
    });

    if (
      mainImage.getAttribute("src") !== nextImage ||
      mainImage.getAttribute("alt") !== nextAlt
    ) {
      mainImage.classList.add("is-swapping");
      mainImage.setAttribute("src", nextImage);
      mainImage.setAttribute("alt", nextAlt);

      const finishSwap = () => mainImage.classList.remove("is-swapping");
      mainImage.addEventListener("load", finishSwap, { once: true });
      globalThis.setTimeout(finishSwap, 260);
    }

    if (
      revealThumbnail &&
      typeof thumbnail.scrollIntoView === "function"
    ) {
      thumbnail.scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    if (focusThumbnail) thumbnail.focus();
  };

  const moveSelection = (offset: number, focusThumbnail = false): void => {
    const currentIndex = thumbnails.findIndex(
      (thumbnail) => thumbnail.dataset.index === root.dataset.selectedIndex,
    );
    const safeCurrentIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex =
      (safeCurrentIndex + offset + thumbnails.length) % thumbnails.length;
    selectThumbnail(thumbnails[nextIndex], focusThumbnail, true);
  };

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => selectThumbnail(thumbnail));
  });
  previousButton.addEventListener("click", () => moveSelection(-1));
  nextButton.addEventListener("click", () => moveSelection(1));
  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    moveSelection(event.key === "ArrowLeft" ? -1 : 1, true);
  });
}

export function initAllServiceGalleries(): void {
  document
    .querySelectorAll<HTMLElement>("[data-service-gallery]")
    .forEach((root) => initServiceGallery(root));
}

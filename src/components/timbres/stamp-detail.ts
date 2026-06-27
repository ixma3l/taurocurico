export function initStampDetail(root: HTMLElement): void {
  if ((root as HTMLElement & { __stampDetailReady?: boolean }).__stampDetailReady) {
    return;
  }

  (root as HTMLElement & { __stampDetailReady?: boolean }).__stampDetailReady = true;

  const image = root.querySelector<HTMLImageElement>("[data-stamp-image]");
  const colorButtons = Array.from(
    root.querySelectorAll<HTMLButtonElement>("[data-stamp-color]"),
  );

  if (!image || colorButtons.length === 0) {
    return;
  }

  const applySelection = (button: HTMLButtonElement) => {
    const nextColor = button.dataset.color;
    const nextImage = button.dataset.image;

    if (!nextColor || !nextImage) {
      return;
    }

    root.dataset.selectedColor = nextColor;

    colorButtons.forEach((candidate) => {
      const isActive = candidate === button;
      candidate.classList.toggle("is-selected", isActive);
      candidate.setAttribute("aria-pressed", String(isActive));
    });

    if (image.getAttribute("src") === nextImage) {
      return;
    }

    image.classList.add("is-swapping");
    image.setAttribute("src", nextImage);

    const finishSwap = () => image.classList.remove("is-swapping");
    image.addEventListener("load", finishSwap, { once: true });
    window.setTimeout(finishSwap, 260);
  };

  colorButtons.forEach((button) => {
    button.addEventListener("click", () => applySelection(button));
  });
}

export function initAllStampDetails(): void {
  document
    .querySelectorAll<HTMLElement>("[data-stamp-detail]")
    .forEach((root) => initStampDetail(root));
}

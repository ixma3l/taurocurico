import { describe, expect, it, vi } from "vitest";

import { initServiceGallery } from "../src/components/services/service-gallery";

type Listener = (event: {
  key?: string;
  preventDefault: () => void;
  target?: unknown;
}) => void;

const createClassList = (initial: string[] = []) => {
  const values = new Set(initial);

  return {
    add: (className: string) => values.add(className),
    remove: (className: string) => values.delete(className),
    toggle: (className: string, force: boolean) => {
      if (force) values.add(className);
      else values.delete(className);
    },
    contains: (className: string) => values.has(className),
  };
};

const createGalleryFixture = () => {
  const imageListeners = new Map<string, Listener[]>();
  const image = {
    attributes: new Map<string, string>([
      ["src", "one.svg"],
      ["alt", "Primera imagen"],
    ]),
    classList: createClassList(),
    getAttribute(name: string) {
      return this.attributes.get(name) ?? null;
    },
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    },
    addEventListener(event: string, listener: Listener) {
      imageListeners.set(event, [...(imageListeners.get(event) ?? []), listener]);
    },
    dispatch(event: string) {
      for (const listener of imageListeners.get(event) ?? []) {
        listener({ preventDefault: () => undefined });
      }
    },
  };

  const makeButton = (dataset: Record<string, string>) => {
    const listeners = new Map<string, Listener[]>();
    const attributes = new Map<string, string>();
    const button = {
      dataset,
      attributes,
      classList: createClassList(),
      focus: vi.fn(),
      scrollIntoView: vi.fn(),
      setAttribute(name: string, value: string) {
        attributes.set(name, value);
      },
      addEventListener(event: string, listener: Listener) {
        listeners.set(event, [...(listeners.get(event) ?? []), listener]);
      },
      dispatch(event: string, detail: Partial<Parameters<Listener>[0]> = {}) {
        for (const listener of listeners.get(event) ?? []) {
          listener({ preventDefault: () => undefined, target: button, ...detail });
        }
      },
      listenerCount(event: string) {
        return listeners.get(event)?.length ?? 0;
      },
    };
    return button;
  };

  const thumbnails = [
    makeButton({ image: "one.svg", alt: "Primera imagen", index: "0" }),
    makeButton({ image: "two.svg", alt: "Segunda imagen", index: "1" }),
    makeButton({ image: "three.svg", alt: "Tercera imagen", index: "2" }),
    makeButton({ image: "four.svg", alt: "Cuarta imagen", index: "3" }),
    makeButton({ image: "five.svg", alt: "Quinta imagen", index: "4" }),
    makeButton({ image: "six.svg", alt: "Sexta imagen", index: "5" }),
    makeButton({ image: "seven.svg", alt: "Séptima imagen", index: "6" }),
  ];
  thumbnails[0].classList.add("is-selected");
  thumbnails[0].setAttribute("aria-pressed", "true");

  const previous = makeButton({});
  const next = makeButton({});
  const rootListeners = new Map<string, Listener[]>();
  const root = {
    dataset: { selectedIndex: "0" },
    querySelector(selector: string) {
      if (selector === "[data-service-gallery-image]") return image;
      if (selector === "[data-service-gallery-previous]") return previous;
      if (selector === "[data-service-gallery-next]") return next;
      return null;
    },
    querySelectorAll(selector: string) {
      return selector === "[data-service-gallery-thumbnail]" ? thumbnails : [];
    },
    addEventListener(event: string, listener: Listener) {
      rootListeners.set(event, [...(rootListeners.get(event) ?? []), listener]);
    },
    dispatch(event: string, detail: Partial<Parameters<Listener>[0]> = {}) {
      for (const listener of rootListeners.get(event) ?? []) {
        listener({ preventDefault: () => undefined, target: root, ...detail });
      }
    },
    listenerCount(event: string) {
      return rootListeners.get(event)?.length ?? 0;
    },
  };

  return { image, next, previous, root, thumbnails };
};

describe("service gallery runtime behavior", () => {
  it("selects a thumbnail and updates the main image source, alt, and state", () => {
    vi.useFakeTimers();
    const { image, root, thumbnails } = createGalleryFixture();

    initServiceGallery(root as unknown as HTMLElement);
    thumbnails[1].dispatch("click");

    expect(image.getAttribute("src")).toBe("two.svg");
    expect(image.getAttribute("alt")).toBe("Segunda imagen");
    expect(root.dataset.selectedIndex).toBe("1");
    expect(thumbnails[0].attributes.get("aria-pressed")).toBe("false");
    expect(thumbnails[1].attributes.get("aria-pressed")).toBe("true");
    expect(thumbnails[1].classList.contains("is-selected")).toBe(true);
    expect(image.classList.contains("is-swapping")).toBe(true);

    image.dispatch("load");
    expect(image.classList.contains("is-swapping")).toBe(false);
    vi.useRealTimers();
  });

  it("finishes the image swap through the timeout fallback", () => {
    vi.useFakeTimers();
    const { image, root, thumbnails } = createGalleryFixture();

    initServiceGallery(root as unknown as HTMLElement);
    thumbnails[2].dispatch("click");
    expect(image.classList.contains("is-swapping")).toBe(true);

    vi.advanceTimersByTime(260);
    expect(image.classList.contains("is-swapping")).toBe(false);
    vi.useRealTimers();
  });

  it("wraps previous and next navigation across an arbitrary gallery size", () => {
    vi.useFakeTimers();
    const { image, next, previous, root, thumbnails } = createGalleryFixture();

    initServiceGallery(root as unknown as HTMLElement);
    previous.dispatch("click");
    expect(image.getAttribute("src")).toBe("seven.svg");
    expect(root.dataset.selectedIndex).toBe("6");
    expect(thumbnails[6].scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });

    next.dispatch("click");
    expect(image.getAttribute("src")).toBe("one.svg");
    expect(root.dataset.selectedIndex).toBe("0");
    expect(thumbnails[0].scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
    vi.useRealTimers();
  });

  it("supports ArrowLeft and ArrowRight from the gallery and its thumbnails", () => {
    vi.useFakeTimers();
    const { image, root, thumbnails } = createGalleryFixture();
    const preventDefault = vi.fn();

    initServiceGallery(root as unknown as HTMLElement);
    root.dispatch("keydown", {
      key: "ArrowRight",
      preventDefault,
      target: root,
    });
    expect(image.getAttribute("src")).toBe("two.svg");
    expect(thumbnails[1].scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });

    root.dispatch("keydown", {
      key: "ArrowLeft",
      preventDefault,
      target: thumbnails[1],
    });
    expect(image.getAttribute("src")).toBe("one.svg");
    expect(thumbnails[0].focus).toHaveBeenCalled();
    expect(thumbnails[0].scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
    expect(preventDefault).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it("continues navigation when scrollIntoView is unavailable", () => {
    vi.useFakeTimers();
    const { image, next, root, thumbnails } = createGalleryFixture();
    delete (thumbnails[1] as { scrollIntoView?: unknown }).scrollIntoView;

    initServiceGallery(root as unknown as HTMLElement);

    expect(() => next.dispatch("click")).not.toThrow();
    expect(image.getAttribute("src")).toBe("two.svg");
    expect(root.dataset.selectedIndex).toBe("1");
    vi.useRealTimers();
  });

  it("does nothing when required elements or thumbnail data are missing", () => {
    const missingRoot = {
      querySelector: () => null,
      querySelectorAll: () => [],
    };
    expect(() => initServiceGallery(missingRoot as unknown as HTMLElement)).not.toThrow();

    const { image, root, thumbnails } = createGalleryFixture();
    delete thumbnails[1].dataset.alt;
    initServiceGallery(root as unknown as HTMLElement);
    thumbnails[1].dispatch("click");
    expect(image.getAttribute("src")).toBe("one.svg");
    expect(image.getAttribute("alt")).toBe("Primera imagen");
  });

  it("initializes each gallery only once", () => {
    const { next, previous, root, thumbnails } = createGalleryFixture();

    initServiceGallery(root as unknown as HTMLElement);
    initServiceGallery(root as unknown as HTMLElement);

    expect(previous.listenerCount("click")).toBe(1);
    expect(next.listenerCount("click")).toBe(1);
    expect(root.listenerCount("keydown")).toBe(1);
    expect(
      thumbnails.every((thumbnail) => thumbnail.listenerCount("click") === 1),
    ).toBe(true);
  });
});

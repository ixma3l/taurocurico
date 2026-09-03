import { afterEach, describe, expect, it, vi } from "vitest";

import { initFeaturedProductsCarousel } from "./featured-products";

class FakeStyle {
  private readonly values = new Map<string, string>();

  setProperty(name: string, value: string) {
    this.values.set(name, value);
  }

  getPropertyValue(name: string) {
    return this.values.get(name) ?? "";
  }
}

class FakeElement extends EventTarget {
  readonly attributes = new Map<string, string>();
  readonly dataset: Record<string, string> = {};
  readonly listenerCounts = new Map<string, number>();
  readonly style = new FakeStyle();
  disabled = false;
  hidden = false;
  inert = false;

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (callback) {
      this.listenerCounts.set(type, (this.listenerCounts.get(type) ?? 0) + 1);
    }
    super.addEventListener(type, callback, options);
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }

  click() {
    if (!this.disabled) {
      this.dispatchEvent(new Event("click"));
    }
  }
}

class FakeView extends EventTarget {
  readonly listenerCounts = new Map<string, number>();

  constructor(public visibleCount: number) {
    super();
  }

  override addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions,
  ) {
    if (callback) {
      this.listenerCounts.set(type, (this.listenerCounts.get(type) ?? 0) + 1);
    }
    super.addEventListener(type, callback, options);
  }

  getComputedStyle() {
    return {
      getPropertyValue: (name: string) =>
        name === "--featured-products-visible-count"
          ? String(this.visibleCount)
          : "",
    } as CSSStyleDeclaration;
  }

  requestAnimationFrame(callback: FrameRequestCallback) {
    callback(0);
    return 1;
  }

  cancelAnimationFrame() {}
}

type CarouselFixture = ReturnType<typeof createCarousel>;

function createCarousel(itemCount = 5, visibleCount = 4) {
  const items = Array.from({ length: itemCount }, () => new FakeElement());
  const track = new FakeElement();
  const previous = new FakeElement();
  const next = new FakeElement();
  const controls = new FakeElement();
  const view = new FakeView(visibleCount);
  const root = new FakeElement() as FakeElement & {
    ownerDocument: { defaultView: FakeView };
    querySelectorAll: (selector: string) => FakeElement[];
    querySelector: (selector: string) => FakeElement | null;
  };

  root.ownerDocument = { defaultView: view };
  root.querySelectorAll = (selector) =>
    selector === "[data-featured-product]" ? items : [];
  root.querySelector = (selector) => {
    if (selector === "[data-featured-products-track]") return track;
    if (selector === "[data-featured-products-previous]") return previous;
    if (selector === "[data-featured-products-next]") return next;
    if (selector === "[data-featured-products-controls]") return controls;
    return null;
  };

  initFeaturedProductsCarousel(root as unknown as HTMLElement);
  return { root, items, track, previous, next, controls, view };
}

function expectPosition(
  fixture: CarouselFixture,
  index: number,
  previousDisabled: boolean,
  nextDisabled: boolean,
) {
  expect(fixture.root.dataset.currentIndex).toBe(String(index));
  expect(
    fixture.root.style.getPropertyValue("--featured-products-current-index"),
  ).toBe(String(index));
  expect(fixture.previous.disabled).toBe(previousDisabled);
  expect(fixture.next.disabled).toBe(nextDisabled);
  expect(fixture.previous.getAttribute("aria-disabled")).toBe(
    String(previousDisabled),
  );
  expect(fixture.next.getAttribute("aria-disabled")).toBe(String(nextDisabled));
}

afterEach(() => {
  vi.useRealTimers();
});

describe("initFeaturedProductsCarousel", () => {
  it("starts at the first product with previous disabled", () => {
    const fixture = createCarousel();

    expectPosition(fixture, 0, true, false);
    expect(fixture.controls.hidden).toBe(false);
  });

  it("moves exactly one product with next and previous", () => {
    const fixture = createCarousel(5, 2);

    fixture.next.click();
    expectPosition(fixture, 1, false, false);

    fixture.next.click();
    expectPosition(fixture, 2, false, false);

    fixture.previous.click();
    expectPosition(fixture, 1, false, false);
  });

  it("clamps at both ends and synchronizes terminal button states", () => {
    const fixture = createCarousel(5, 2);

    fixture.previous.click();
    expectPosition(fixture, 0, true, false);

    fixture.next.click();
    fixture.next.click();
    fixture.next.click();
    expectPosition(fixture, 3, false, true);

    fixture.next.click();
    expectPosition(fixture, 3, false, true);
  });

  it("recalculates the visible count on resize and clamps the current index", () => {
    const fixture = createCarousel(5, 4);

    fixture.next.click();
    expectPosition(fixture, 1, false, true);

    fixture.view.visibleCount = 2;
    fixture.view.dispatchEvent(new Event("resize"));
    expectPosition(fixture, 1, false, false);

    fixture.next.click();
    expectPosition(fixture, 2, false, false);

    fixture.view.visibleCount = 4;
    fixture.view.dispatchEvent(new Event("resize"));
    expectPosition(fixture, 1, false, true);
  });

  it("disables and hides controls when every product already fits", () => {
    const fixture = createCarousel(3, 4);

    expectPosition(fixture, 0, true, true);
    expect(fixture.controls.hidden).toBe(true);
  });

  it("initializes idempotently without duplicate click or resize listeners", () => {
    const fixture = createCarousel(5, 2);
    const nextListeners = fixture.next.listenerCounts.get("click");
    const previousListeners = fixture.previous.listenerCounts.get("click");
    const resizeListeners = fixture.view.listenerCounts.get("resize");

    initFeaturedProductsCarousel(fixture.root as unknown as HTMLElement);

    expect(fixture.next.listenerCounts.get("click")).toBe(nextListeners);
    expect(fixture.previous.listenerCounts.get("click")).toBe(previousListeners);
    expect(fixture.view.listenerCounts.get("resize")).toBe(resizeListeners);

    fixture.next.click();
    expectPosition(fixture, 1, false, false);
  });

  it("does not move from touch gestures or elapsed time", () => {
    vi.useFakeTimers();
    const fixture = createCarousel(5, 2);
    const touchStart = new Event("touchstart") as Event & {
      changedTouches: Array<{ screenX: number }>;
    };
    const touchEnd = new Event("touchend") as Event & {
      changedTouches: Array<{ screenX: number }>;
    };
    Object.defineProperty(touchStart, "changedTouches", {
      value: [{ screenX: 200 }],
    });
    Object.defineProperty(touchEnd, "changedTouches", {
      value: [{ screenX: 20 }],
    });

    fixture.root.dispatchEvent(touchStart);
    fixture.root.dispatchEvent(touchEnd);
    vi.advanceTimersByTime(60_000);

    expectPosition(fixture, 0, true, false);
  });
});

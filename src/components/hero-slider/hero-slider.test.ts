import { afterEach, describe, expect, it, vi } from "vitest";

import { initHeroSlider } from "./hero-slider";

class FakeClassList {
  private readonly values = new Set<string>();

  constructor(...initial: string[]) {
    initial.forEach((value) => this.values.add(value));
  }

  add(...values: string[]) {
    values.forEach((value) => this.values.add(value));
  }

  remove(...values: string[]) {
    values.forEach((value) => this.values.delete(value));
  }

  toggle(value: string, force?: boolean) {
    const enabled = force ?? !this.values.has(value);
    if (enabled) this.values.add(value);
    else this.values.delete(value);
    return enabled;
  }

  contains(value: string) {
    return this.values.has(value);
  }
}

class FakeElement extends EventTarget {
  readonly classList: FakeClassList;
  readonly dataset: Record<string, string> = {};
  readonly attributes = new Map<string, string>();
  inert = false;
  hidden = false;

  constructor(...classes: string[]) {
    super();
    this.classList = new FakeClassList(...classes);
  }

  setAttribute(name: string, value: string) {
    this.attributes.set(name, value);
  }

  getAttribute(name: string) {
    return this.attributes.get(name) ?? null;
  }

  click() {
    this.dispatchEvent(new Event("click"));
  }
}

type SliderFixture = ReturnType<typeof createSlider>;

function createSlider(slideCount = 3, reducedMotion = false) {
  const slides = Array.from(
    { length: slideCount },
    (_, index) => new FakeElement("hero-slide", ...(index === 0 ? ["is-active"] : [])),
  );
  const dots = Array.from(
    { length: slideCount },
    (_, index) => new FakeElement("hero-slider__dot", ...(index === 0 ? ["is-active"] : [])),
  );
  const previous = new FakeElement();
  const next = new FakeElement();
  const controls = new FakeElement();
  const root = new FakeElement() as FakeElement & {
    ownerDocument: { defaultView: Pick<Window, "matchMedia" | "setTimeout" | "clearTimeout"> };
    querySelectorAll: (selector: string) => FakeElement[];
    querySelector: (selector: string) => FakeElement | null;
  };

  root.ownerDocument = {
    defaultView: {
      matchMedia: () => ({ matches: reducedMotion }) as MediaQueryList,
      setTimeout: globalThis.setTimeout.bind(globalThis) as Window["setTimeout"],
      clearTimeout: globalThis.clearTimeout.bind(globalThis),
    },
  };
  root.querySelectorAll = (selector) =>
    selector === "[data-slide]" ? slides : selector === "[data-dot]" ? dots : [];
  root.querySelector = (selector) => {
    if (selector === "[data-prev]") return previous;
    if (selector === "[data-next]") return next;
    if (selector === "[data-controls]") return controls;
    return null;
  };

  initHeroSlider(root as unknown as HTMLElement);
  return { root, slides, dots, previous, next, controls };
}

function keydown(root: FakeElement, key: string) {
  const event = new Event("keydown", { cancelable: true }) as Event & { key: string };
  Object.defineProperty(event, "key", { value: key });
  root.dispatchEvent(event);
  return event;
}

function swipe(root: FakeElement, start: number, end: number) {
  const touchEvent = (type: string, screenX: number) => {
    const event = new Event(type) as Event & { changedTouches: Array<{ screenX: number }> };
    Object.defineProperty(event, "changedTouches", { value: [{ screenX }] });
    return event;
  };

  root.dispatchEvent(touchEvent("touchstart", start));
  root.dispatchEvent(touchEvent("touchend", end));
}

function expectActive(fixture: SliderFixture, index: number) {
  fixture.slides.forEach((slide, slideIndex) => {
    const active = slideIndex === index;
    expect(slide.classList.contains("is-active")).toBe(active);
    expect(slide.getAttribute("aria-hidden")).toBe(String(!active));
    expect(slide.inert).toBe(!active);
  });
  fixture.dots.forEach((dot, dotIndex) => {
    const active = dotIndex === index;
    expect(dot.classList.contains("is-active")).toBe(active);
    expect(dot.getAttribute("aria-pressed")).toBe(String(active));
  });
}

afterEach(() => {
  vi.useRealTimers();
});

describe("initHeroSlider", () => {
  it("runs the image exit and entrance sequentially and locks interaction", () => {
    vi.useFakeTimers();
    const fixture = createSlider();

    fixture.next.click();

    expect(fixture.dots[1].getAttribute("aria-pressed")).toBe("true");
    expect(fixture.slides[0].classList.contains("is-leaving")).toBe(true);
    expect(fixture.slides[1].classList.contains("is-active")).toBe(false);

    fixture.next.click();
    vi.advanceTimersByTime(499);
    expect(fixture.slides[1].classList.contains("is-active")).toBe(false);

    vi.advanceTimersByTime(1);
    expect(fixture.slides[0].classList.contains("is-leaving")).toBe(false);
    expect(fixture.slides[1].classList.contains("is-active")).toBe(true);

    fixture.next.click();
    vi.advanceTimersByTime(500);
    expectActive(fixture, 1);

    fixture.next.click();
    expect(fixture.dots[2].getAttribute("aria-pressed")).toBe("true");
  });

  it("wraps navigation and handles keyboard arrows", () => {
    vi.useFakeTimers();
    const fixture = createSlider();

    fixture.previous.click();
    vi.advanceTimersByTime(1_000);
    expectActive(fixture, 2);

    const event = keydown(fixture.root, "ArrowRight");
    expect(event.defaultPrevented).toBe(true);
    vi.advanceTimersByTime(1_000);
    expectActive(fixture, 0);
  });

  it("requires a swipe distance greater than 50 pixels", () => {
    vi.useFakeTimers();
    const fixture = createSlider();

    swipe(fixture.root, 100, 50);
    expectActive(fixture, 0);

    swipe(fixture.root, 100, 49);
    expect(fixture.dots[1].getAttribute("aria-pressed")).toBe("true");
    vi.advanceTimersByTime(1_000);
    expectActive(fixture, 1);
  });

  it("switches immediately and remains unlocked with reduced motion", () => {
    const fixture = createSlider(3, true);

    fixture.next.click();
    expectActive(fixture, 1);

    fixture.next.click();
    expectActive(fixture, 2);
  });

  it("synchronizes ARIA and inert state and is idempotent", () => {
    const fixture = createSlider(3, true);
    expectActive(fixture, 0);

    initHeroSlider(fixture.root as unknown as HTMLElement);
    fixture.dots[2].click();
    expectActive(fixture, 2);
  });

  it("keeps a single slide active and suppresses its controls", () => {
    const fixture = createSlider(1);

    expectActive(fixture, 0);
    expect(fixture.controls.hidden).toBe(true);
    fixture.next.click();
    expectActive(fixture, 0);
  });
});

import { describe, expect, it } from "vitest";

import stampCarouselSource from "../src/components/stamp-carousel/StampCarousel.astro?raw";
import { initStampCarousel } from "../src/components/stamp-carousel/stamp-carousel";
import svgStampSource from "../src/components/svg-stamp/SvgStamp.astro?raw";
import { createStampFilterId } from "../src/components/svg-stamp/svg-stamp";
import homepageSource from "../src/pages/index.astro?raw";

const expectedAssets = [
  "/uploads/stamps/ecuestre.svg",
  "/uploads/stamps/lxf.svg",
  "/uploads/stamps/oraculo.svg",
  "/uploads/stamps/sagrada.svg",
  "/uploads/stamps/central.svg",
  "/uploads/stamps/galo.svg",
  "/uploads/stamps/selva.svg",
] as const;

const withoutComments = (source: string) =>
  source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

const styleSource =
  stampCarouselSource.match(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/i)?.[1] ?? "";

class FakeClassList {
  private readonly classes = new Set<string>();

  toggle(name: string, force?: boolean) {
    const shouldAdd = force ?? !this.classes.has(name);
    if (shouldAdd) this.classes.add(name);
    else this.classes.delete(name);
    return shouldAdd;
  }

  contains(name: string) {
    return this.classes.has(name);
  }
}

class FakeButton extends EventTarget {
  readonly attributes = new Map<string, string>();
  readonly listenerCounts = new Map<string, number>();
  disabled = false;

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
    if (!this.disabled) this.dispatchEvent(new Event("click"));
  }
}

class FakeMediaQuery extends EventTarget {
  readonly listenerCounts = new Map<string, number>();

  constructor(public matches: boolean) {
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

  setMatches(matches: boolean) {
    this.matches = matches;
    this.dispatchEvent(new Event("change"));
  }
}

function createCarousel(reducedMotion = false) {
  const button = new FakeButton();
  const track = new EventTarget();
  const mediaQuery = new FakeMediaQuery(reducedMotion);
  const root = new EventTarget() as EventTarget & {
    classList: FakeClassList;
    dataset: Record<string, string>;
    ownerDocument: {
      defaultView: { matchMedia: (query: string) => FakeMediaQuery };
    };
    querySelector: (selector: string) => FakeButton | EventTarget | null;
  };

  root.classList = new FakeClassList();
  root.dataset = {};
  root.ownerDocument = {
    defaultView: {
      matchMedia: (query) => {
        expect(query).toBe("(prefers-reduced-motion: reduce)");
        return mediaQuery;
      },
    },
  };
  root.querySelector = (selector) => {
    if (selector === "[data-stamp-carousel-toggle]") return button;
    if (selector === "[data-stamp-carousel-track]") return track;
    return null;
  };

  initStampCarousel(root as unknown as HTMLElement);
  return { root, button, mediaQuery };
}

describe("homepage stamp carousel integration", () => {
  it("renders the stamp carousel between featured products and Brand", () => {
    const homepageMarkup = withoutComments(homepageSource);

    expect(homepageSource).toMatch(
      /import\s+StampCarousel\s+from\s+["'][^"']*components\/stamp-carousel\/StampCarousel\.astro["']/,
    );
    expect(homepageMarkup).toMatch(
      /<FeaturedProducts\b[^>]*\/>[\s\S]*?<StampCarousel\b[^>]*\/>[\s\S]*?<Brand\b[^>]*\/>/,
    );
  });
});

describe("stamp carousel source contract", () => {
  it("uses exactly the configured public SVG assets", () => {
    const assetReferences = [
      ...stampCarouselSource.matchAll(/["'`](\/uploads\/stamps\/[^"'`]+\.svg)["'`]/g),
    ].map(([, asset]) => asset);

    expect(assetReferences).toEqual(expectedAssets);
  });

  it("keeps every stamp decorative, lazy, async, dimensioned, and non-interactive", () => {
    const markup = withoutComments(stampCarouselSource);
    const imageTag = markup.match(/<img\b[^>]*>/i)?.[0] ?? "";

    expect(imageTag).toMatch(/\balt=["']{2}/i);
    expect(imageTag).toMatch(/\bloading=["']lazy["']/i);
    expect(imageTag).toMatch(/\bdecoding=["']async["']/i);
    expect(imageTag).toMatch(/\bwidth=["']\d+["']/i);
    expect(imageTag).toMatch(/\bheight=["']\d+["']/i);
    expect(markup).not.toMatch(/<(?:a|h[1-6])\b/i);
  });

  it("duplicates one coherent group and hides the duplicate from assistive technology", () => {
    const groupTags = [
      ...withoutComments(stampCarouselSource).matchAll(
        /<(?:ul|div)\b[^>]*data-stamp-carousel-group[^>]*>/gi,
      ),
    ].map(([tag]) => tag);

    expect(groupTags).toHaveLength(2);
    expect(groupTags[0]).not.toMatch(/aria-hidden/i);
    expect(groupTags[1]).toMatch(/aria-hidden=["']true["']/i);
    expect(stampCarouselSource.match(/stamps\.map\s*\(/g) ?? []).toHaveLength(2);
    expect(stampCarouselSource).toMatch(/const\s+inkColor\s*=\s*["']#[0-9a-f]{6}["']/i);
    expect(stampCarouselSource).toMatch(/angle:\s*-?\d+[\s\S]*seed:\s*\d+[\s\S]*roughness:\s*[\d.]+[\s\S]*grit:\s*\d+/i);
  });

  it("keeps every stamp upright with uniform grit", () => {
    const effectSettings = [
      ...stampCarouselSource.matchAll(/angle:\s*(-?\d+)[\s\S]*?grit:\s*(\d+)/g),
    ].map(([, angle, grit]) => ({ angle: Number(angle), grit: Number(grit) }));

    expect(effectSettings).toHaveLength(expectedAssets.length);
    expect(effectSettings.every(({ angle, grit }) => angle === 0 && grit === 18)).toBe(true);
  });

  it("defines a seamless linear marquee without page-width overflow", () => {
    expect(styleSource).toMatch(/@keyframes\s+stamp-marquee/i);
    expect(styleSource).toMatch(/animation\s*:\s*stamp-marquee\s+[^;]*linear\s+infinite/i);
    expect(styleSource).toMatch(/translate(?:3d|X)\([^;]*-50%/i);
    expect(styleSource).toMatch(/\.stamp-carousel\s*\{[^}]*max-width\s*:\s*100%[^}]*overflow\s*:\s*hidden/is);
    expect(styleSource).toMatch(/\.stamp-carousel__group\s*\{[^}]*flex\s*:\s*0\s+0\s+auto/is);
  });

  it("keeps wide duplicate groups viewport-filling with balanced boundary spacing", () => {
    const carouselRule =
      styleSource.match(/\.stamp-carousel\s*\{([^}]*)\}/i)?.[1] ?? "";
    const groupRule =
      styleSource.match(/\.stamp-carousel__group\s*\{([^}]*)\}/i)?.[1] ?? "";

    expect(carouselRule).toMatch(
      /--stamp-carousel-gap\s*:\s*clamp\(1\.75rem,\s*5vw,\s*4\.5rem\)/i,
    );
    expect(groupRule).toMatch(/min-width\s*:\s*100vw/i);
    expect(groupRule).toMatch(/justify-content\s*:\s*space-around/i);
    expect(groupRule).toMatch(/gap\s*:\s*var\(--stamp-carousel-gap\)/i);
    expect(groupRule).toMatch(
      /padding-inline\s*:\s*calc\(var\(--stamp-carousel-gap\)\s*\/\s*2\)/i,
    );
  });

  it("stops animation and leaves one horizontally usable row for reduced motion", () => {
    const reducedMotionRule =
      styleSource.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*)\}\s*$/i)?.[1] ?? "";

    expect(reducedMotionRule).toMatch(/\.stamp-carousel__track\s*\{[^}]*animation\s*:\s*none/is);
    expect(reducedMotionRule).toMatch(/\.stamp-carousel__duplicate\s*\{[^}]*display\s*:\s*none/is);
    expect(reducedMotionRule).toMatch(/\.stamp-carousel__viewport\s*\{[^}]*overflow-x\s*:\s*auto/is);
  });

  it("provides an accessible pause control and Astro lifecycle initialization", () => {
    const button =
      withoutComments(stampCarouselSource).match(
        /<button\b[^>]*data-stamp-carousel-toggle[^>]*>/i,
      )?.[0] ?? "";

    expect(button).toMatch(/\btype=["']button["']/i);
    expect(button).toMatch(/\baria-pressed=["']false["']/i);
    expect(button).toMatch(/\baria-label=["'][^"']+["']/i);
    expect(button).toMatch(/\baria-controls=["'][^"']+["']/i);
    expect(stampCarouselSource).toContain("initAllStampCarousels");
    expect(stampCarouselSource).toContain('document.addEventListener("astro:page-load", init)');
  });
});

describe("SvgStamp source contract", () => {
  it("supports the approved stamp controls and slot content", () => {
    for (const prop of [
      "color",
      "roughness",
      "grit",
      "angle",
      "bleed",
      "opacity",
      "seed",
      "scale",
      "class",
    ]) {
      expect(svgStampSource).toMatch(new RegExp(`\\b${prop}\\??:`));
    }
    expect(svgStampSource).toMatch(/<slot\s*\/>/i);
  });

  it("keeps the complete filter primitive pipeline", () => {
    for (const primitive of [
      "feTurbulence",
      "feDisplacementMap",
      "feComposite",
      "feMorphology",
      "feColorMatrix",
    ]) {
      expect(svgStampSource).toContain(`<${primitive}`);
    }
    expect(svgStampSource).toMatch(/operator=\{morphOperator\}/);
    expect(svgStampSource).toContain("gritMatrixValues");
    expect(svgStampSource).toContain("colorMatrixValues");
  });

  it("creates a unique filter ID for every instance", () => {
    const firstId = createStampFilterId();
    const secondId = createStampFilterId();

    expect(firstId).toMatch(/^svg-stamp-filter-/);
    expect(secondId).toMatch(/^svg-stamp-filter-/);
    expect(firstId).not.toBe(secondId);
    expect(svgStampSource).toMatch(/`filter:\s*url\(#\$\{filterId\}\)`/);
  });

  it("does not retain the discarded React demo features", () => {
    expect(svgStampSource).not.toMatch(
      /react|tailwind|dangerouslySetInnerHTML|canvas|FileReader|AudioContext|clipboard|preset|playground|svgString/i,
    );
  });
});

describe("initStampCarousel", () => {
  it("toggles pause state and accessible button text", () => {
    const { root, button } = createCarousel();

    expect(root.classList.contains("is-paused")).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("false");
    expect(button.getAttribute("aria-label")).toMatch(/pausar/i);

    button.click();
    expect(root.classList.contains("is-paused")).toBe(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-label")).toMatch(/reanudar/i);

    button.click();
    expect(root.classList.contains("is-paused")).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });

  it("initializes idempotently without duplicate listeners", () => {
    const { root, button, mediaQuery } = createCarousel();
    const clickListeners = button.listenerCounts.get("click");
    const motionListeners = mediaQuery.listenerCounts.get("change");

    initStampCarousel(root as unknown as HTMLElement);

    expect(button.listenerCounts.get("click")).toBe(clickListeners);
    expect(mediaQuery.listenerCounts.get("change")).toBe(motionListeners);
  });

  it("disables the control and forces a paused state for reduced motion", () => {
    const { root, button, mediaQuery } = createCarousel(true);

    expect(root.classList.contains("is-paused")).toBe(true);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-label")).toMatch(/movimiento reducido/i);

    mediaQuery.setMatches(false);
    expect(root.classList.contains("is-paused")).toBe(false);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("false");
  });

  it("preserves an explicit pause across reduced-motion preference changes", () => {
    const { root, button, mediaQuery } = createCarousel();

    button.click();
    mediaQuery.setMatches(true);
    mediaQuery.setMatches(false);

    expect(root.classList.contains("is-paused")).toBe(true);
    expect(button.disabled).toBe(false);
    expect(button.getAttribute("aria-pressed")).toBe("true");
    expect(button.getAttribute("aria-label")).toMatch(/reanudar/i);
  });
});

import { describe, expect, it } from "vitest";

import { initStampDetail } from "../src/components/timbres/stamp-detail";
import stampGridSource from "../src/components/timbres/StampGrid.astro?raw";
import stampCardSource from "../src/components/timbres/StampCard.astro?raw";
import detailPageSource from "../src/pages/timbres/[brand]/[family]/[stamp].astro?raw";

describe("timbres UI contract evidence", () => {
  it("keeps 3-up desktop grid and simplified stamp card", () => {
    expect(stampGridSource).toContain("@media (min-width: 1024px)");
    expect(stampGridSource).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");

    expect(stampCardSource).toContain("/timbres/${stamp.brandSlug}/${stamp.familySlug}/${stamp.slug}");
    expect(stampCardSource).toContain("<img");
    expect(stampCardSource).toContain("<h2>{stamp.modelName}</h2>");
    expect(stampCardSource).not.toContain("stamp.description");
    expect(stampCardSource).not.toContain("stamp.sizeMm");
    expect(stampCardSource).not.toContain("stamp.colors");
  });

  it("keeps stamp detail route generation and not-found redirect", () => {
    expect(detailPageSource).toContain("export const getStaticPaths = () =>");
    expect(detailPageSource).toContain("getStampStaticParams()");
    expect(detailPageSource).toContain('return Astro.redirect("/404")');
  });
});

describe("stamp detail runtime behavior", () => {
  it("updates selected color and image source on color selection", () => {
    const listenersByEvent = new Map<string, (() => void)[]>();
    let swappingClassAdded = false;

    const image = {
      src: "default.jpg",
      classList: {
        add: (className: string) => {
          if (className === "is-swapping") {
            swappingClassAdded = true;
          }
        },
        remove: () => undefined,
      },
      setAttribute: (name: string, value: string) => {
        if (name === "src") {
          image.src = value;
        }
      },
      getAttribute: (name: string) => (name === "src" ? image.src : null),
      addEventListener: (event: string, cb: () => void) => {
        const current = listenersByEvent.get(event) ?? [];
        listenersByEvent.set(event, [...current, cb]);
      },
    };

    const selected: string[] = [];
    const ariaPressedStates: string[] = [];
    const createButton = (color: string, imagePath: string) => {
      const runtime = {
        click: (): void => undefined,
      };

      return {
        dataset: { color, image: imagePath },
        classList: {
          toggle: (_className: string, isActive: boolean) => {
            if (isActive) {
              selected.push(color);
            }
          },
        },
        setAttribute: (name: string, value: string) => {
          if (name === "aria-pressed") {
            ariaPressedStates.push(value);
          }
        },
        addEventListener: (event: string, cb: () => void) => {
          if (event === "click") {
            runtime.click = cb;
          }
        },
        click: () => runtime.click(),
      };
    };

    const button = createButton("azul", "azul.jpg");
    const root = {
      dataset: { selectedColor: "negro" },
      querySelector: () => image,
      querySelectorAll: () => [button],
    };

    (globalThis as unknown as { window: { setTimeout: (cb: () => void, ms: number) => void } }).window = {
      setTimeout: (cb: () => void) => cb(),
    };

    initStampDetail(root as unknown as HTMLElement);
    button.click();

    expect(root.dataset.selectedColor).toBe("azul");
    expect(image.src).toBe("azul.jpg");
    expect(selected.at(-1)).toBe("azul");
    expect(swappingClassAdded).toBe(true);
    expect(ariaPressedStates).toContain("true");
  });
});

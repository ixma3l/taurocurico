import { describe, expect, it } from "vitest";

import { initStampDetail } from "../src/components/timbres/stamp-detail";
import stampGridSource from "../src/components/timbres/StampGrid.astro?raw";
import stampCardSource from "../src/components/timbres/StampCard.astro?raw";
import stampDetailSource from "../src/components/timbres/StampDetail.astro?raw";
import familyCardSource from "../src/components/timbres/FamilyCard.astro?raw";
import familyPageSource from "../src/pages/timbres/[brand]/[family].astro?raw";
import detailPageSource from "../src/pages/timbres/[brand]/[family]/[stamp].astro?raw";

describe("timbres UI contract evidence", () => {
  it("keeps a 3-up default grid and supports an opt-in 4-up desktop grid", () => {
    expect(stampGridSource).toContain("grid-template-columns: 1fr;");
    expect(stampGridSource).toContain("@media (min-width: 640px)");
    expect(stampGridSource).toContain("grid-template-columns: repeat(2, minmax(0, 1fr));");
    expect(stampGridSource).toContain("@media (min-width: 1024px)");
    expect(stampGridSource).toContain("desktopColumns = 3");
    expect(stampGridSource).toContain('"stamp-grid--four-columns": desktopColumns === 4');
    expect(stampGridSource).toContain("grid-template-columns: repeat(3, minmax(0, 1fr));");
    expect(stampGridSource).toContain("grid-template-columns: repeat(4, minmax(0, 1fr));");
    expect(familyPageSource).toContain("<StampGrid stamps={availableStamps} />");
    expect(familyPageSource).toContain("getAvailableStamps(family)");
    expect(familyPageSource).toContain("availableStamps.length > 0");
    expect(familyPageSource).toContain("No hay modelos publicados en esta familia todavía.");
    expect(familyCardSource).toContain("getAvailableStamps(family).length");

    expect(stampCardSource).toContain("/timbres/${stamp.brandSlug}/${stamp.familySlug}/${stamp.slug}");
    expect(stampCardSource).toContain("<img");
    expect(stampCardSource).toContain("<h2>{stamp.modelName}</h2>");
    expect(stampCardSource).not.toContain("stamp.description");
    expect(stampCardSource).not.toContain("stamp.sizeMm");
    expect(stampCardSource).not.toContain("stamp.colors");
  });

  it("renders a responsive, accessible product-detail hierarchy", () => {
    expect(stampDetailSource).toContain("data-stamp-detail");
    expect(stampDetailSource).toContain("data-stamp-image");
    expect(stampDetailSource).toContain("data-stamp-color");
    expect(stampDetailSource).toContain("getInitialStampColor(stamp)");
    expect(stampDetailSource).toContain("const initialColor = getInitialStampColor(stamp)");
    expect(stampDetailSource).not.toContain("stamp.colors[0]");
    expect(stampDetailSource).toContain("stamp.colors.map");
    expect(stampDetailSource).not.toContain("availableColors.map");
    expect(stampDetailSource).toContain("data-color={color.code}");
    expect(stampDetailSource).toContain("No hay colores disponibles para este modelo.");
    expect(stampDetailSource).toContain("data-image={imageForColor}");
    expect(stampDetailSource).toContain('aria-pressed={isSelected ? "true" : "false"}');
    expect(stampDetailSource).toContain("is-selected");
    expect(stampDetailSource).toContain("is-swapping");
    expect(stampDetailSource).toContain("<h1>{stamp.modelName}</h1>");
    expect(stampDetailSource).toContain("<fieldset");
    expect(stampDetailSource).toContain("<legend>Colores</legend>");
    expect(stampDetailSource).toContain(">Especificaciones</h2>");
    expect(stampDetailSource).toContain("stamp.sizeMm.width");
    expect(stampDetailSource).toContain("stamp.sizeMm.height");
    expect(stampDetailSource).toContain("object-fit: contain;");
    expect(stampDetailSource).toContain("@media (min-width: 768px)");
    expect(stampDetailSource).toContain("grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);");
  });

  it("renders every color as a 28px accessible chip and marks unavailable colors", () => {
    const colorChipStyles = stampDetailSource.match(/\.color-chip \{([\s\S]*?)\n  \}/)?.[1] ?? "";
    const unavailableStyles =
      stampDetailSource.match(/\.color-chip\.is-unavailable \{([\s\S]*?)\n  \}/)?.[1] ?? "";

    expect(stampDetailSource).toContain("stamp.colors.map");
    expect(stampDetailSource).toContain("const isUnavailable = !color.available;");
    expect(stampDetailSource).toContain('isUnavailable ? "is-unavailable" : ""');
    expect(stampDetailSource).toContain("disabled={isUnavailable}");
    expect(stampDetailSource).toContain('`${colorMeta.label}, sin stock`');
    expect(stampDetailSource).toContain("aria-label={accessibleLabel}");
    expect(stampDetailSource).toContain("title={accessibleLabel}");
    expect(stampDetailSource).not.toContain("<span>{colorMeta.label}</span>");
    expect(colorChipStyles).toContain("background: var(--chip-color);");
    expect(colorChipStyles).toContain("border-radius: 50%;");
    expect(colorChipStyles).toContain("height: 28px;");
    expect(colorChipStyles).toContain("width: 28px;");
    expect(unavailableStyles).toContain("cursor: not-allowed;");
    expect(unavailableStyles).toContain("opacity: 0.5;");
  });

  it("keeps all chips visible and announces when no color is available", () => {
    expect(stampDetailSource).toContain(
      "const hasAvailableColors = stamp.colors.some((color) => color.available);",
    );
    expect(stampDetailSource).toContain("{stamp.colors.map");
    expect(stampDetailSource).toContain("!hasAvailableColors");
    expect(stampDetailSource).toContain('class="stamp-detail__color-empty" role="status"');
    expect(stampDetailSource).toContain("No hay colores disponibles para este modelo.");
  });

  it("keeps route generation and adds named breadcrumbs and related models", () => {
    expect(detailPageSource).toContain("export const getStaticPaths = () =>");
    expect(detailPageSource).toContain("getStampStaticParams()");
    expect(detailPageSource).toContain('return Astro.redirect("/404")');
    expect(detailPageSource).toContain("getBrandBySlug");
    expect(detailPageSource).toContain("getFamilyBySlugs");
    expect(detailPageSource).toContain("{brand.name}");
    expect(detailPageSource).toContain("{family.name}");
    expect(detailPageSource).toContain("{stamp.modelName}");
    expect(detailPageSource).toContain("getAvailableStamps(family)");
    expect(detailPageSource).not.toContain("family.stamps.filter");
    expect(detailPageSource).toContain(".slice(0, 4)");
    expect(detailPageSource).toContain("relatedStamps.length > 0");
    expect(detailPageSource).toContain("<StampGrid stamps={relatedStamps} desktopColumns={4} />");
  });

  it("does not add unsupported ecommerce or gallery features", () => {
    const productDetailSources = `${stampDetailSource}\n${detailPageSource}`;

    expect(productDetailSources).not.toMatch(
      /price|precio|cart|carrito|wishlist|review|reseña|bootstrap|font-awesome|fontawesome|googleapis|thumbnail|miniatura|zoom/i,
    );
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

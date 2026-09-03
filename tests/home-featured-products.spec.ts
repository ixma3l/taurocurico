import { describe, expect, it } from "vitest";

import image4912Url from "/uploads/timbres/4912/trodat-4912-printy.webp?url";
import image4630Url from "/uploads/timbres/4630/trodat-4630-printy-01.webp?url";
import image4923Url from "/uploads/timbres/4923/trodat-4923-printy.webp?url";
import image4916Url from "/uploads/timbres/4916/trodat-4916-printy.webp?url";
import image4926Url from "/uploads/timbres/4926/trodat-4926-printy.webp?url";
import featuredProductsSource from "../src/components/featured-products/FeaturedProducts.astro?raw";
import { featuredProducts } from "../src/data/featured-products.data";
import featuredProductsDataSource from "../src/data/featured-products.data.ts?raw";
import {
  getInitialStampColor,
  getStampBySlugs,
  getStampImageForColor,
} from "../src/data/timbres-data";

const expectedProductTriples = [
  ["trodat", "printy", "4912"],
  ["trodat", "redondos", "4630"],
  ["trodat", "printy", "4923"],
  ["trodat", "printy", "4916"],
  ["trodat", "printy", "4926"],
] as const;

const expectedProductImageUrls = [
  image4912Url,
  image4630Url,
  image4923Url,
  image4916Url,
  image4926Url,
] as const;

const withoutComments = (source: string) =>
  source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

const styleSource =
  featuredProductsSource.match(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/i)?.[1] ?? "";

describe("homepage featured products data contract", () => {
  it("selects exactly the five approved available catalog products in order", () => {
    expect(
      featuredProducts.map((product) => [
        product.brandSlug,
        product.familySlug,
        product.slug,
      ]),
    ).toEqual(expectedProductTriples);

    featuredProducts.forEach((product, index) => {
      const [brandSlug, familySlug, stampSlug] = expectedProductTriples[index];
      const catalogProduct = getStampBySlugs(brandSlug, familySlug, stampSlug);

      expect(catalogProduct).toBeDefined();
      expect(product).toMatchObject({
        brandSlug,
        familySlug,
        slug: stampSlug,
        active: true,
        modelName: catalogProduct?.modelName,
        images: { default: catalogProduct?.images.default },
      });
    });
  });

  it("uses the imported catalog image for an available color of every product", () => {
    featuredProducts.forEach((product, index) => {
      const [brandSlug, familySlug, stampSlug] = expectedProductTriples[index];
      const catalogDefaultImage = getStampBySlugs(
        brandSlug,
        familySlug,
        stampSlug,
      )?.images.default;
      const initialColor = getInitialStampColor(product);
      const image = getStampImageForColor(product, initialColor);

      expect(initialColor).toBeDefined();
      expect(catalogDefaultImage).toBe(expectedProductImageUrls[index]);
      expect(catalogDefaultImage).toMatch(/^\/uploads\//);
      expect(image).toBe(catalogDefaultImage);
    });
  });
});

describe("homepage featured products source contract", () => {
  it("renders a labelled Spanish section and a semantic product list", () => {
    const markup = withoutComments(featuredProductsSource);
    const sectionOpeningTag = markup.match(/<section\b[^>]*>/i)?.[0] ?? "";
    const heading = markup.match(
      /<h2\b[^>]*\bid=["']([^"']+)["'][^>]*>\s*Productos destacados\s*<\/h2>/i,
    );

    expect(heading).not.toBeNull();
    expect(sectionOpeningTag).toMatch(
      new RegExp(`\\baria-labelledby=["']${heading?.[1]}["']`, "i"),
    );
    expect(markup).toMatch(
      /<section\b[^>]*data-featured-products[^>]*>[\s\S]*?<ul\b[^>]*data-featured-products-track[^>]*>[\s\S]*?<li\b[^>]*data-featured-product/i,
    );
    expect(featuredProductsSource).toMatch(/featuredProducts\.map\s*\(/);
  });

  it("links every card to its canonical detail route with catalog image alt text", () => {
    const imageOpeningTag =
      withoutComments(featuredProductsSource).match(/<img\b[^>]*>/i)?.[0] ?? "";

    expect(featuredProductsSource).toMatch(
      /href\s*=\s*\{\s*`\/timbres\/\$\{product\.brandSlug\}\/\$\{product\.familySlug\}\/\$\{product\.slug\}`\s*\}/,
    );
    expect(imageOpeningTag).toMatch(/\bsrc\s*=\s*\{product\.images\.default\}/i);
    expect(imageOpeningTag).toMatch(/\balt\s*=\s*\{product\.modelName\}/i);
    expect(featuredProductsSource).toMatch(/<h3\b[^>]*>\s*\{product\.modelName\}\s*<\/h3>/i);
  });

  it("uses square contain media and exposes 1, 2, 3, and 4 visible-item layouts", () => {
    const visibleCounts = [
      ...styleSource.matchAll(
        /--featured-products-visible-count\s*:\s*([1-4])\s*;/g,
      ),
    ].map(([, count]) => Number(count));

    expect(styleSource).toMatch(/aspect-ratio\s*:\s*1(?:\s*\/\s*1)?\s*;/i);
    expect(styleSource).toMatch(/object-fit\s*:\s*contain\s*;/i);
    expect(new Set(visibleCounts)).toEqual(new Set([1, 2, 3, 4]));
    expect(visibleCounts[0]).toBe(1);
    expect(styleSource).toMatch(
      /grid-auto-columns\s*:\s*calc\([^;]*var\(--featured-products-visible-count\)[^;]*\)\s*;/i,
    );
    expect(styleSource).toMatch(
      /transform\s*:[^;]*var\(--featured-products-current-index\)[^;]*;/i,
    );
    expect(styleSource).toMatch(/overflow\s*:\s*hidden\s*;/i);
    expect(styleSource).not.toMatch(/overflow-x\s*:\s*auto|scroll-snap-type/i);
  });

  it("provides only previous and next arrow controls and initializes the runtime", () => {
    const previousButton =
      featuredProductsSource.match(/<button\b[^>]*data-featured-products-previous[^>]*>/i)?.[0] ?? "";
    const nextButton =
      featuredProductsSource.match(/<button\b[^>]*data-featured-products-next[^>]*>/i)?.[0] ?? "";

    expect(withoutComments(featuredProductsSource).match(/<button\b/gi) ?? []).toHaveLength(2);
    expect(previousButton).toMatch(/\btype=["']button["']/i);
    expect(nextButton).toMatch(/\btype=["']button["']/i);
    expect(previousButton).toMatch(/aria-label=["'](?:Producto )?anterior["']/i);
    expect(nextButton).toMatch(/aria-label=["'](?:Producto )?siguiente["']/i);
    expect(featuredProductsSource).toContain("initAllFeaturedProductsCarousels");
    expect(featuredProductsSource).toContain('document.addEventListener("astro:page-load", init)');
  });

  it("does not add unsupported ecommerce, badge, autoplay, loop, or swipe UI", () => {
    const sources = `${withoutComments(featuredProductsSource)}\n${withoutComments(featuredProductsDataSource)}`;

    expect(sources).not.toMatch(
      /price|precio|cart|carrito|badge|insignia|autoplay|auto-play|loop|swipe|touchstart|touchend|pointerdown/i,
    );
  });
});

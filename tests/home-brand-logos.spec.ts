import { describe, expect, it } from "vitest";

import brandSource from "../src/components/Brand.astro?raw";
import homepageSource from "../src/pages/index.astro?raw";

const expectedBrands = ["Trodat", "Isofit", "Torre", "Giotto", "Artel"] as const;

const withoutComments = (source: string) =>
  source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

const styleSource =
  brandSource.match(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/i)?.[1] ?? "";

const svgReferences = [
  ...brandSource.matchAll(/["'`]([^"'`]*\.svg(?:\?url)?)["'`]/gi),
].map(([, reference]) => reference);

const referencedBrandNames = svgReferences
  .map((reference) =>
    expectedBrands.find((brand) =>
      new RegExp(`(?:^|[/_-])${brand}(?:[/_.-]|$)`, "i").test(reference),
    ),
  )
  .filter((brand): brand is (typeof expectedBrands)[number] => brand !== undefined);

describe("homepage brand logo source contract", () => {
  it("renders featured products between the hero and Brand", () => {
    const homepageMarkup = withoutComments(homepageSource);

    expect(homepageSource).toMatch(
      /import\s+Brand\s+from\s+["'][^"']*components\/Brand\.astro["']/,
    );
    expect(homepageSource).toMatch(
      /import\s+FeaturedProducts\s+from\s+["'][^"']*components\/featured-products\/FeaturedProducts\.astro["']/,
    );
    expect(homepageMarkup).toMatch(
      /<HeroSlider\b[^>]*\/>[\s\S]*?<FeaturedProducts\b[^>]*\/>[\s\S]*?<Brand\b[^>]*\/>/,
    );
  });

  it("renders exactly the five approved SVG wordmarks as a semantic, non-interactive list", () => {
    const brandMarkup = withoutComments(brandSource);
    const sectionOpeningTag = brandMarkup.match(/<section\b[^>]*>/i)?.[0] ?? "";
    const hasSectionName =
      /\baria-(?:label|labelledby)\s*=/.test(sectionOpeningTag) ||
      /<h[2-6]\b/i.test(brandMarkup);

    expect(brandMarkup).toMatch(/<section\b[^>]*>[\s\S]*<ul\b[^>]*>[\s\S]*<li\b/i);
    expect(hasSectionName).toBe(true);
    expect(brandMarkup).toMatch(/<img\b[^>]*\bsrc\s*=/i);
    expect(brandMarkup).toMatch(/<img\b[^>]*\balt\s*=/i);
    expect(svgReferences).toHaveLength(expectedBrands.length);
    expect([...referencedBrandNames].sort()).toEqual([...expectedBrands].sort());
    for (const brand of expectedBrands) {
      expect(brandSource).toMatch(new RegExp(`\\b${brand}\\b`, "i"));
    }
    expect(brandMarkup).not.toMatch(/<(?:a|button)\b/i);
  });

  it("uses five equal desktop items and a native mobile scroll-snap strip", () => {
    const logoRuleBodies = [
      ...styleSource.matchAll(/[^{}]*(?:img|logo)[^{}]*\{([^{}]*)\}/gi),
    ]
      .map(([, declarations]) => declarations)
      .join("\n");

    expect(styleSource).toMatch(
      /@media\s*\(\s*min-width\s*:[^)]+\)[\s\S]*?grid-template-columns\s*:\s*repeat\(\s*5\s*,\s*(?:minmax\(\s*0\s*,\s*1fr\s*\)|1fr)\s*\)/i,
    );
    expect(logoRuleBodies).toMatch(
      /filter\s*:\s*[^;{}]*brightness\(\s*0\s*\)/i,
    );
    expect(logoRuleBodies).toMatch(/opacity\s*:\s*(?:0?\.5|50%)/i);
    expect(styleSource).toMatch(/display\s*:\s*flex/i);
    expect(styleSource).toMatch(/flex-wrap\s*:\s*nowrap/i);
    expect(styleSource).toMatch(/overflow-x\s*:\s*auto/i);
    expect(styleSource).toMatch(/scroll-snap-type\s*:\s*x\s+mandatory/i);
    expect(styleSource).toMatch(/scroll-snap-align\s*:\s*(?:start|center)/i);
    expect(brandSource).not.toMatch(/<script\b/i);
    expect(brandSource).not.toMatch(/\bautoplay\b/i);
  });
});

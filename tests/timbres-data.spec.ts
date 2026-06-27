import { describe, expect, it } from "vitest";

import {
  buildTimbresMenuTree,
  getBrandStaticParams,
  getBrands,
  getFamilyBySlugs,
  getFamilyStaticParams,
  getStampBySlugs,
  getStampImageForColor,
  getStampStaticParams,
  timbresCatalog,
} from "../src/data/timbres-data";

describe("timbres catalog selectors", () => {
  it("builds a menu tree with one family path per brand/family", () => {
    const menu = buildTimbresMenuTree();
    const familiesFromCatalog = getBrands().flatMap((brand) =>
      brand.families.map((family) => `/timbres/${brand.slug}/${family.slug}`),
    );

    const familyPathsFromMenu = menu.flatMap((brand) =>
      (brand.children ?? []).map((family) => family.path),
    );

    expect(familyPathsFromMenu).toEqual(familiesFromCatalog);
  });

  it("resolves family by slugs and returns undefined for invalid pairs", () => {
    const trodatPrinty = getFamilyBySlugs("trodat", "printy");
    expect(trodatPrinty?.brandSlug).toBe("trodat");
    expect(trodatPrinty?.slug).toBe("printy");

    expect(getFamilyBySlugs("trodat", "does-not-exist")).toBeUndefined();
    expect(getFamilyBySlugs("does-not-exist", "printy")).toBeUndefined();
  });
});

describe("timbres catalog integrity", () => {
  it("keeps stamps aligned to their canonical brand/family path", () => {
    for (const brand of timbresCatalog.brands) {
      for (const family of brand.families) {
        expect(family.brandSlug).toBe(brand.slug);

        for (const stamp of family.stamps) {
          expect(stamp.brandSlug).toBe(brand.slug);
          expect(stamp.familySlug).toBe(family.slug);
          expect(stamp.modelName.length).toBeGreaterThan(0);
          expect(stamp.description.length).toBeGreaterThan(0);
          expect(stamp.sizeMm.width).toBeGreaterThan(0);
          expect(stamp.sizeMm.height).toBeGreaterThan(0);
          expect(stamp.colors.length).toBeGreaterThan(0);
          expect(stamp.images.default.length).toBeGreaterThan(0);

          for (const colorKey of Object.keys(stamp.images.byColor)) {
            expect(stamp.colors).toContain(colorKey);
            expect(stamp.images.byColor[colorKey as keyof typeof stamp.images.byColor]).toBeTruthy();
          }
        }
      }
    }
  });
});

describe("timbres static route params", () => {
  it("derives brand and family static params from catalog", () => {
    const brandParams = getBrandStaticParams();
    const familyParams = getFamilyStaticParams();

    const brandSlugsFromCatalog = timbresCatalog.brands.map((brand) => brand.slug);
    const familyPairsFromCatalog = timbresCatalog.brands.flatMap((brand) =>
      brand.families.map((family) => `${brand.slug}/${family.slug}`),
    );

    expect(brandParams.map((entry) => entry.params.brand)).toEqual(brandSlugsFromCatalog);
    expect(
      familyParams.map((entry) => `${entry.params.brand}/${entry.params.family}`),
    ).toEqual(familyPairsFromCatalog);
  });

  it("derives stamp static params from catalog", () => {
    const stampParams = getStampStaticParams();
    const stampTriplesFromCatalog = timbresCatalog.brands.flatMap((brand) =>
      brand.families.flatMap((family) =>
        family.stamps.map((stamp) => `${brand.slug}/${family.slug}/${stamp.slug}`),
      ),
    );

    expect(
      stampParams.map((entry) => `${entry.params.brand}/${entry.params.family}/${entry.params.stamp}`),
    ).toEqual(stampTriplesFromCatalog);
  });
});

describe("timbres stamp lookup and image resolution", () => {
  const expectPublicOrBundledAssetUrl = (value: string): void => {
    expect(typeof value).toBe("string");
    expect(value.length).toBeGreaterThan(0);
    expect(value.startsWith("/")).toBe(true);
  };

  it("resolves stamp by slugs and returns undefined for invalid paths", () => {
    const stamp = getStampBySlugs("trodat", "printy", "4911");

    expect(stamp?.slug).toBe("4911");
    expect(stamp?.brandSlug).toBe("trodat");
    expect(stamp?.familySlug).toBe("printy");

    expect(getStampBySlugs("trodat", "printy", "does-not-exist")).toBeUndefined();
    expect(getStampBySlugs("trodat", "does-not-exist", "4911")).toBeUndefined();
    expect(getStampBySlugs("does-not-exist", "printy", "4911")).toBeUndefined();
  });

  it("returns color variant image when available and fallback default otherwise", () => {
    const stamp = getStampBySlugs("trodat", "printy", "4911");

    expect(stamp).toBeDefined();
    if (!stamp) {
      return;
    }

    const stampWithVariant = {
      ...stamp,
      images: {
        ...stamp.images,
        byColor: {
          negro: "/images/custom-negro-4911.jpg",
        },
      },
    };

    expect(getStampImageForColor(stampWithVariant, "negro")).toBe(
      stampWithVariant.images.byColor.negro,
    );
    expect(getStampImageForColor(stampWithVariant, "azul")).toBe(stampWithVariant.images.default);
    expect(getStampImageForColor(stampWithVariant, undefined)).toBe(
      stampWithVariant.images.default,
    );
  });

  it("maps Trodat 4912 real color variants and keeps negro on default image", () => {
    const stamp4912 = getStampBySlugs("trodat", "printy", "4912");

    expect(stamp4912).toBeDefined();
    if (!stamp4912) {
      return;
    }

    expectPublicOrBundledAssetUrl(stamp4912.images.default);

    expect(getStampImageForColor(stamp4912, "negro")).toBe(stamp4912.images.default);

    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "rojo"));
    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "azul"));
    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "verde"));
    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "gris"));
    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "blanco"));
    expectPublicOrBundledAssetUrl(getStampImageForColor(stamp4912, "fucsia"));
  });

  it("exposes runtime-ready image URLs instead of source-relative paths", () => {
    for (const brand of timbresCatalog.brands) {
      for (const family of brand.families) {
        for (const stamp of family.stamps) {
          expectPublicOrBundledAssetUrl(stamp.images.default);

          for (const imagePath of Object.values(stamp.images.byColor)) {
            if (!imagePath) {
              continue;
            }

            expectPublicOrBundledAssetUrl(imagePath);
          }
        }
      }
    }
  });
});

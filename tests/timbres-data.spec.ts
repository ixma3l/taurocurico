import { describe, expect, it } from "vitest";

import {
  buildTimbresMenuTree,
  getAvailableColors,
  getAvailableStamps,
  getBrandStaticParams,
  getBrands,
  getFamilyBySlugs,
  getFamilyStaticParams,
  getInitialStampColor,
  getStampBySlugs,
  getStampImageForColor,
  getStampStaticParams,
  timbresCatalog,
  validateTimbresCatalog,
  type TimbresCatalog,
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
          expect(typeof stamp.active).toBe("boolean");
          expect(stamp.colors.length).toBeGreaterThan(0);
          expect(stamp.images.default.length).toBeGreaterThan(0);

          const colorCodes = stamp.colors.map((color) => color.code);
          expect(new Set(colorCodes).size).toBe(colorCodes.length);
          for (const color of stamp.colors) {
            expect(typeof color.code).toBe("string");
            expect(typeof color.available).toBe("boolean");
          }

          for (const colorKey of Object.keys(stamp.images.byColor)) {
            expect(colorCodes).toContain(colorKey);
            expect(stamp.images.byColor[colorKey as keyof typeof stamp.images.byColor]).toBeTruthy();
          }
        }
      }
    }
  });

  it("rejects invalid/duplicate color codes and non-boolean availability", () => {
    const baseStamp = timbresCatalog.brands[0].families[0].stamps[0];
    const makeCatalog = (colors: unknown[]): TimbresCatalog => ({
      brands: [
        {
          slug: "test-brand",
          name: "Test Brand",
          families: [
            {
              slug: "test-family",
              name: "Test Family",
              brandSlug: "test-brand",
              stamps: [
                {
                  ...baseStamp,
                  slug: "test-stamp",
                  brandSlug: "test-brand",
                  familySlug: "test-family",
                  colors,
                },
              ],
            },
          ],
        },
      ],
    } as TimbresCatalog);

    expect(() =>
      validateTimbresCatalog(
        makeCatalog([
          { code: "negro", available: true },
          { code: "negro", available: false },
        ]),
      ),
    ).toThrow(/duplicate color/i);
    expect(() =>
      validateTimbresCatalog(makeCatalog([{ code: "negro", available: "yes" }])),
    ).toThrow(/availability.*boolean/i);
    expect(() =>
      validateTimbresCatalog(makeCatalog([{ code: "violeta", available: true }])),
    ).toThrow(/unknown color code/i);
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

  it("returns no available models for a family whose stamps are all inactive", () => {
    const printy = getFamilyBySlugs("trodat", "printy");
    expect(printy).toBeDefined();
    if (!printy) {
      return;
    }

    const inactiveFamily = {
      ...printy,
      stamps: printy.stamps.filter((stamp) => !stamp.active),
    };
    expect(inactiveFamily.stamps.length).toBeGreaterThan(0);
    expect(getAvailableStamps(inactiveFamily)).toEqual([]);
  });

  it("derives stamp static params only from active catalog stamps", () => {
    const stampParams = getStampStaticParams();
    const stampTriplesFromCatalog = timbresCatalog.brands.flatMap((brand) =>
      brand.families.flatMap((family) =>
        getAvailableStamps(family).map(
          (stamp) => `${brand.slug}/${family.slug}/${stamp.slug}`,
        ),
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

    expect(getStampBySlugs("trodat", "printy", "4612")).toBeUndefined();
    expect(getStampBySlugs("trodat", "printy", "46019")).toBeUndefined();
    expect(getStampBySlugs("trodat", "printy", "46025")).toBeUndefined();
    expect(getStampBySlugs("trodat", "printy", "does-not-exist")).toBeUndefined();
    expect(getStampBySlugs("trodat", "does-not-exist", "4911")).toBeUndefined();
    expect(getStampBySlugs("does-not-exist", "printy", "4911")).toBeUndefined();
  });

  it("keeps unavailable color image URLs but selects only available colors", () => {
    const stamp = timbresCatalog.brands
      .find((brand) => brand.slug === "trodat")
      ?.families.find((family) => family.slug === "printy")
      ?.stamps.find((candidate) => candidate.slug === "4630");

    expect(stamp).toBeDefined();
    if (!stamp) {
      return;
    }

    expect(stamp.colors).toEqual([
      { code: "negro", available: false },
      { code: "rojo", available: true },
      { code: "azul", available: false },
    ]);
    expect(getAvailableColors(stamp).map((color) => color.code)).toEqual(["rojo"]);
    expect(getInitialStampColor(stamp)).toBe("rojo");
    expect(getStampImageForColor(stamp, getInitialStampColor(stamp))).toBe(
      stamp.images.byColor.rojo,
    );
    expect(stamp.images.byColor.rojo).toBeTruthy();
    expect(stamp.images.byColor.azul).toBeTruthy();
  });

  it("keeps color availability independent across duplicate model slugs", () => {
    const printyStamp = getStampBySlugs("trodat", "printy", "4630");
    const redondosStamp = getStampBySlugs("trodat", "redondos", "4630");

    expect(printyStamp).toBeDefined();
    expect(redondosStamp).toBeDefined();
    expect(printyStamp?.familySlug).toBe("printy");
    expect(redondosStamp?.familySlug).toBe("redondos");
    expect(redondosStamp?.colors).not.toBe(printyStamp?.colors);
  });

  it("falls back to the default image when no color is available", () => {
    const stamp = getStampBySlugs("trodat", "printy", "4911");
    expect(stamp).toBeDefined();
    if (!stamp) {
      return;
    }

    const unavailableColorsStamp = {
      ...stamp,
      colors: stamp.colors.map((color) => ({ ...color, available: false })),
    };

    expect(getAvailableColors(unavailableColorsStamp)).toEqual([]);
    expect(getInitialStampColor(unavailableColorsStamp)).toBeUndefined();
    expect(getStampImageForColor(unavailableColorsStamp, undefined)).toBe(
      unavailableColorsStamp.images.default,
    );
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

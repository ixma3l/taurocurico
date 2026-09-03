import {
  getStampBySlugs,
  type TimbreStamp,
} from "./timbres-data";

const featuredProductSelections = [
  ["trodat", "printy", "4912"],
  ["trodat", "redondos", "4630"],
  ["trodat", "printy", "4923"],
  ["trodat", "printy", "4916"],
  ["trodat", "printy", "4926"],
] as const;

const resolveFeaturedProduct = (
  brandSlug: string,
  familySlug: string,
  stampSlug: string,
): TimbreStamp => {
  const product = getStampBySlugs(brandSlug, familySlug, stampSlug);

  if (!product || !product.active) {
    throw new Error(
      `Featured product "${brandSlug}/${familySlug}/${stampSlug}" is missing or inactive`,
    );
  }

  return product;
};

export const featuredProducts: TimbreStamp[] = featuredProductSelections.map(
  ([brandSlug, familySlug, stampSlug]) =>
    resolveFeaturedProduct(brandSlug, familySlug, stampSlug),
);

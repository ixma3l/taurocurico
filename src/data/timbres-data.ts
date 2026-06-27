export type TimbreColorCode =
  | "negro"
  | "azul"
  | "rojo"
  | "verde"
  | "gris"
  | "blanco"
  | "fucsia"
  | "turquesa";

export interface TimbreStamp {
  slug: string;
  modelName: string;
  brandSlug: string;
  familySlug: string;
  active: boolean;
  sizeMm: {
    width: number;
    height: number;
  };
  description: string;
  colors: TimbreColorCode[];
  images: TimbreStampImages;
}

export interface TimbreStampImages {
  default: string;
  byColor: Partial<Record<TimbreColorCode, string>>;
}

export interface TimbreFamily {
  slug: string;
  name: string;
  brandSlug: string;
  stamps: TimbreStamp[];
}

export interface TimbreBrand {
  slug: string;
  name: string;
  families: TimbreFamily[];
}

export interface TimbresCatalog {
  brands: TimbreBrand[];
}

/**
 * Reglas de mantenimiento del catálogo:
 * 1) `brand.slug` y `family.slug` definen la URL canónica `/timbres/{brand}/{family}`.
 * 2) Cada familia DEBE pertenecer al brand contenedor (`family.brandSlug === brand.slug`).
 * 3) Cada timbre DEBE quedar anclado a una única familia (`stamp.brandSlug/familySlug`).
 * 4) `stamp.colors` es la ÚNICA fuente de colores disponibles por modelo.
 */

export interface MenuNode {
  title: string;
  path: string;
  children?: MenuNode[];
}

export interface TimbresRouteParams {
  params: {
    brand: string;
    family?: string;
  };
}

export interface TimbresStampRouteParams {
  params: {
    brand: string;
    family: string;
    stamp: string;
  };
}

type RuntimeImageModule =
  | { default: string }
  | { default: { src: string } }
  | { src: string };

const TIMBRE_ASSET_MODULES = import.meta.glob<RuntimeImageModule>(
  "../assets/images/uploads/timbres/*.{jpg,jpeg,png,webp}",
  { eager: true },
);

const getRuntimeImageUrl = (module: RuntimeImageModule): string => {
  if ("default" in module) {
    return typeof module.default === "string" ? module.default : module.default.src;
  }

  return module.src;
};

const TIMBRE_ASSET_URL_BY_NAME = new Map(
  Object.entries(TIMBRE_ASSET_MODULES).map(([modulePath, module]) => [
    modulePath.split("/").pop() ?? modulePath,
    getRuntimeImageUrl(module),
  ]),
);

const resolveStampImageUrl = (imagePath: string): string => {
  const normalized = imagePath.trim();
  if (!normalized) {
    return normalized;
  }

  if (normalized.startsWith("/")) {
    return normalized;
  }

  const fileName = normalized.split("/").pop();
  if (!fileName) {
    return normalized;
  }

  const bundledUrl = TIMBRE_ASSET_URL_BY_NAME.get(fileName);
  if (bundledUrl) {
    return bundledUrl;
  }

  const srcAssetsIndex = normalized.indexOf("/src/assets/");
  if (srcAssetsIndex >= 0) {
    return normalized.slice(srcAssetsIndex);
  }

  return normalized;
};

export const TIMBRE_COLOR_META: Record<
  TimbreColorCode,
  { label: string; hex: string }
> = {
  negro: { label: "Negro", hex: "#101010" },
  rojo: { label: "Rojo", hex: "#DC2626" },
  azul: { label: "Azul", hex: "#1D4ED8" },
  verde: { label: "Verde", hex: "#16A34A" },
  gris: { label: "Gris", hex: "#64748B" },
  blanco: { label: "Blanco", hex: "#F8FAFC" },
  fucsia: { label: "Fucsia", hex: "#C026D3" },
  turquesa: { label: "Turquesa", hex: "#14B8A6" },
};

export const timbresCatalog: TimbresCatalog = {
  brands: [
    {
      slug: "trodat",
      name: "Trodat",
      families: [
        {
          slug: "printy",
          name: "Printy",
          brandSlug: "trodat",
          stamps: [
            {
              slug: "4612",
              modelName: "Trodat Printy 4612",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 12, height: 12 },
              description: "Timbre automático redondo para marcaciones pequeñas.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4612/trodat-4612-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "46019",
              modelName: "Trodat Printy 46019",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 19, height: 19 },
              description: "Timbre automático redondo para sellos compactos.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy-02.webp",
                },
              },
            },
            {
              slug: "46025",
              modelName: "Trodat Printy 46025",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 25, height: 25 },
              description: "Timbre automático redondo para diseños circulares compactos.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy-02.webp",
                },
              },
            },
            {
              slug: "4630",
              modelName: "Trodat Printy 4630",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 30, height: 30 },
              description: "Timbre automático redondo para logos y marcaciones circulares.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy-02.webp",
                },
              },
            },
            {
              slug: "4638",
              modelName: "Trodat Printy 4638",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 38, height: 38 },
              description: "Timbre automático redondo para diseños circulares de tamaño medio.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy-02.webp",
                },
              },
            },
            {
              slug: "4642",
              modelName: "Trodat Printy 4642",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 42, height: 42 },
              description: "Timbre automático redondo para logos, insignias o sellos destacados.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy-02.webp",
                },
              },
            },
            {
              slug: "4645",
              modelName: "Trodat Printy 4645",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 45, height: 45 },
              description: "Timbre automático redondo grande para diseños con mayor presencia.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy-02.webp",
                },
              },
            },
            {
              slug: "46050",
              modelName: "Trodat Printy 46050",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 50, height: 50 },
              description: "Timbre automático redondo de gran formato para sellos destacados.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46050/trodat-46050-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "4907",
              modelName: "Trodat Printy 4907",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 13, height: 6 },
              description: "Timbre automático mini para marcaciones muy pequeñas.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4907/trodat-4907-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "4908",
              modelName: "Trodat Printy 4908",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 15, height: 7 },
              description: "Timbre automático pequeño para textos breves y marcaciones compactas.",
              colors: ["negro", "rojo"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4908/trodat-4908-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4908/trodat-4908-printy-01.webp",
                },
              },
            },
            {
              slug: "4910",
              modelName: "Trodat Printy 4910",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 26, height: 9 },
              description: "Timbre automático compacto para textos cortos y marcaciones pequeñas.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-02.webp",
                  verde: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-04.webp",
                  blanco: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-05.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/4910/trodat-4910-printy-06.webp",
                },
              },
            },
            {
              slug: "4911",
              modelName: "Trodat Printy 4911",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 38, height: 14 },
              description: "Timbre automático compacto para uso diario.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4911/trodat-4911-printy.webp",
                byColor: {
                  rojo:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-01.webp",
                  azul:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-02.webp",
                  verde:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-03.webp",
                  gris:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-04.webp",
                  blanco:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-05.webp",
                  fucsia:"../../src/assets/images/uploads/timbres/4911/trodat-4911-printy-06.webp",
                },
              },
            },
            {
              slug: "4912",
              modelName: "Trodat Printy 4912",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 47, height: 18 },
              description: "Modelo horizontal para textos un poco más extensos.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-02.webp",
                  verde: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-04.webp",
                  blanco: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-05.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/4912/trodat-4912-printy-06.webp",
                },
              },
            },
            {
              slug: "4913",
              modelName: "Trodat Printy 4913",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 58, height: 22 },
              description: "Modelo horizontal para textos un poco más extensos.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-02.webp",
                  verde: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-04.webp",
                  blanco: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-05.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/4913/trodat-4913-printy-06.webp",
                },
              },
            },
            {
              slug: "4914",
              modelName: "Trodat Printy 4914",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 64, height: 26 },
              description: "Timbre automático de mayor formato para textos amplios o datos comerciales.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-02.webp",
                  verde: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-04.webp",
                  blanco: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-05.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/4914/trodat-4914-printy-06.webp",
                },
              },
            },
            {
              slug: "4915",
              modelName: "Trodat Printy 4915",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 70, height: 25 },
              description: "Timbre automático rectangular para textos largos y marcaciones de oficina.",
              colors: ["negro", "rojo", "azul", "verde", "gris", "blanco", "fucsia"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-02.webp",
                  verde: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-04.webp",
                  blanco: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-05.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/4915/trodat-4915-printy-06.webp",
                },
              },
            },
            {
              slug: "4916",
              modelName: "Trodat Printy 4916",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 70, height: 10 },
              description: "Timbre automático horizontal para textos largos en formato angosto.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4916/trodat-4916-printy.webp",
                byColor: {
                },
              },
            },
            {
              slug: "4917",
              modelName: "Trodat Printy 4917",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 50, height: 10 },
              description: "Timbre automático horizontal para textos largos en formato angosto.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4917/trodat-4917-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "4918",
              modelName: "Trodat Printy 4918",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 75, height: 15 },
              description: "Timbre automático horizontal para líneas extensas de texto.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4918/trodat-4918-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "4921",
              modelName: "Trodat Printy 4921",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 12, height: 12 },
              description: "Timbre automático cuadrado para iconos, códigos o marcaciones pequeñas.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4921/trodat-4921-printy.webp",
                byColor: {
                  "rojo": "../../src/assets/images/uploads/timbres/4921/trodat-4921-printy-01.webp",
                  "azul": "../../src/assets/images/uploads/timbres/4921/trodat-4921-printy-02.webp"
                },
              },
            },
            {
              slug: "4922",
              modelName: "Trodat Printy 4922",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 20, height: 20 },
              description: "Timbre automático cuadrado para sellos compactos y marcaciones generales.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4922/trodat-4922-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "4923",
              modelName: "Trodat Printy 4923",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 30, height: 30 },
              description: "Timbre automático cuadrado para diseños de mayor presencia.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4923/trodat-4923-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4923/trodat-4923-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4923/trodat-4923-printy-02.webp"
                },
              },
            },
            {
              slug: "4924",
              modelName: "Trodat Printy 4924",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 40, height: 40 },
              description: "Timbre automático cuadrado grande para logos o diseños destacados.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4924/trodat-4924-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4924/trodat-4924-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4924/trodat-4924-printy-02.webp"
                },
              },
            },
            {
              slug: "4925",
              modelName: "Trodat Printy 4925",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 82, height: 25 },
              description: "Timbre automático de formato ancho para textos extensos.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4925/trodat-4925-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4925/trodat-4925-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4925/trodat-4925-printy-02.webp"
                },
              },
            },
            {
              slug: "4926",
              modelName: "Trodat Printy 4926",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 75, height: 38 },
              description: "Timbre automático de gran formato para información comercial amplia.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4926/trodat-4926-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4926/trodat-4926-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4926/trodat-4926-printy-02.webp"
                },
              },
            },
            {
              slug: "4927",
              modelName: "Trodat Printy 4927",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 60, height: 40 },
              description: "Timbre automático rectangular grande para datos institucionales o comerciales.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4927/trodat-4927-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4927/trodat-4927-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4927/trodat-4927-printy-02.webp"
                },
              },
            },
            {
              slug: "4928",
              modelName: "Trodat Printy 4928",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 60, height: 33 },
              description: "Timbre automático rectangular para textos amplios y uso frecuente.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4928/trodat-4928-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4928/trodat-4928-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4928/trodat-4928-printy-02.webp"
                },
              },
            },
            {
              slug: "4929",
              modelName: "Trodat Printy 4929",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 50, height: 30 },
              description: "Timbre automático rectangular para información de oficina y datos comerciales.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4929/trodat-4929-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4929/trodat-4929-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4929/trodat-4929-printy-02.webp"
                },
              },
            },
            {
              slug: "4931",
              modelName: "Trodat Printy 4931",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 70, height: 30 },
              description: "Timbre automático rectangular amplio para textos de varias líneas.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4931/trodat-4931-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4931/trodat-4931-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4931/trodat-4931-printy-02.webp"
                },
              },
            },
            {
              slug: "4933",
              modelName: "Trodat Printy 4933",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 25, height: 25 },
              description: "Timbre automático cuadrado para diseños compactos con buena visibilidad.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4933/trodat-4933-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4933/trodat-4933-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4933/trodat-4933-printy-02.webp"
                },
              },
            },
            {
              slug: "4941",
              modelName: "Trodat Printy 4941",
              brandSlug: "trodat",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 41, height: 24 },
              description: "Timbre automático rectangular para datos de contacto y textos de oficina.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4941/trodat-4941-printy.webp",
                byColor: {},
              },
            },
          ],
        },
        {
          slug: "profesional",
          name: "Profesional",
          brandSlug: "trodat",
          stamps: [
            {
              slug: "5212",
              modelName: "5212",
              brandSlug: "trodat",
              familySlug: "profesional",
              active: true,
              sizeMm: { width: 45, height: 30 },
              description: "Modelo metálico para alto volumen de uso.",
              colors: ["negro", "rojo"],
              images: {
                default: "../../src/assets/images/uploads/timbres/profesional-trodat-5212.jpg",
                byColor: {},
              },
            },
          ],
        },
        {
          slug: "mobile-pocket",
          name: "Mobile / Pocket",
          brandSlug: "trodat",
          stamps: [
            {
              slug: "9511",
              modelName: "Trodat Mobile Printy 9511",
              brandSlug: "trodat",
              familySlug: "mobile-pocket",
              active: true,
              sizeMm: { width: 38, height: 14 },
              description: "Timbre automático de bolsillo para traslado diario y uso portátil.",
              colors: ["negro", "rojo", "fucsia", "turquesa", "gris", "verde", "azul", "blanco"],
              images: {
                default: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-01.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-02.webp",
                  turquesa: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-04.webp",
                  verde: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-05.webp",
                  azul: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-06.webp",
                  blanco: "../../src/assets/images/uploads/timbres/9511/trodat-9511-mobile-pocket-07.webp",
                },
              },
            },
            {
              slug: "9512",
              modelName: "Trodat Mobile Printy 9512",
              brandSlug: "trodat",
              familySlug: "mobile-pocket",
              active: true,
              sizeMm: { width: 47, height: 18 },
              description: "Timbre automático de bolsillo de mayor tamaño para textos portátiles.",
              colors: ["negro", "rojo", "fucsia", "turquesa", "gris", "verde", "azul", "blanco"],
              images: {
                default: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-01.webp",
                  fucsia: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-02.webp",
                  turquesa: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-03.webp",
                  gris: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-04.webp",
                  verde: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-05.webp",
                  azul: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-06.webp",
                  blanco: "../../src/assets/images/uploads/timbres/9512/trodat-9512-mobile-pocket-07.webp",
                },
              },
            },
          ],
        },
        {
          slug: "redondos",
          name: "Redondos",
          brandSlug: "trodat",
          stamps: [
            {
              slug: "4612",
              modelName: "Trodat Printy 4612",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 12, height: 12 },
              description: "Timbre automático redondo para marcaciones pequeñas.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4612/trodat-4612-printy.webp",
                byColor: {},
              },
            },
            {
              slug: "46019",
              modelName: "Trodat Printy 46019",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 19, height: 19 },
              description: "Timbre automático redondo para sellos compactos.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/46019/trodat-46019-printy-02.webp",
                },
              },
            },
            {
              slug: "46025",
              modelName: "Trodat Printy 46025",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 25, height: 25 },
              description: "Timbre automático redondo para diseños circulares compactos.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/46025/trodat-46025-printy-02.webp",
                },
              },
            },
            {
              slug: "4630",
              modelName: "Trodat Printy 4630",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 30, height: 30 },
              description: "Timbre automático redondo para logos y marcaciones circulares.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4630/trodat-4630-printy-02.webp",
                },
              },
            },
            {
              slug: "4638",
              modelName: "Trodat Printy 4638",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 38, height: 38 },
              description: "Timbre automático redondo para diseños circulares de tamaño medio.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4638/trodat-4638-printy-02.webp",
                },
              },
            },
            {
              slug: "4642",
              modelName: "Trodat Printy 4642",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 42, height: 42 },
              description: "Timbre automático redondo para logos, insignias o sellos destacados.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4642/trodat-4642-printy-02.webp",
                },
              },
            },
            {
              slug: "4645",
              modelName: "Trodat Printy 4645",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 45, height: 45 },
              description: "Timbre automático redondo grande para diseños con mayor presencia.",
              colors: ["negro", "rojo", "azul"],
              images: {
                default: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy.webp",
                byColor: {
                  rojo: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy-01.webp",
                  azul: "../../src/assets/images/uploads/timbres/4645/trodat-4645-printy-02.webp",
                },
              },
            },
            {
              slug: "46050",
              modelName: "Trodat Printy 46050",
              brandSlug: "trodat",
              familySlug: "redondos",
              active: true,
              sizeMm: { width: 50, height: 50 },
              description: "Timbre automático redondo de gran formato para sellos destacados.",
              colors: ["negro"],
              images: {
                default: "../../src/assets/images/uploads/timbres/46050/trodat-46050-printy.webp",
                byColor: {},
              },
            },
          ],
        },
      ],
    },
    {
      slug: "imprint",
      name: "Imprint",
      families: [
        {
          slug: "printy",
          name: "Printy",
          brandSlug: "imprint",
          stamps: [
            {
              slug: "8911",
              modelName: "8911",
              brandSlug: "imprint",
              familySlug: "printy",
              active: true,
              sizeMm: { width: 38, height: 14 },
              description: "Modelo compacto de línea Imprint para uso general.",
              colors: ["negro", "rojo"],
              images: {
                default: "../../src/assets/images/uploads/timbres/printy-imprint-8911.jpg",
                byColor: {},
              },
            },
          ],
        },
      ],
    },
  ],
};

const normalizeCatalogImageUrls = (catalog: TimbresCatalog): void => {
  for (const brand of catalog.brands) {
    for (const family of brand.families) {
      for (const stamp of family.stamps) {
        stamp.images.default = resolveStampImageUrl(stamp.images.default);

        for (const color of Object.keys(stamp.images.byColor) as TimbreColorCode[]) {
          const variant = stamp.images.byColor[color];
          if (!variant) {
            continue;
          }

          stamp.images.byColor[color] = resolveStampImageUrl(variant);
        }
      }
    }
  }
};

const assertCatalogIntegrity = (catalog: TimbresCatalog): void => {
  const validBrandSlugs = new Set(catalog.brands.map((brand) => brand.slug));

  for (const brand of catalog.brands) {
    for (const family of brand.families) {
      if (family.brandSlug !== brand.slug || !validBrandSlugs.has(family.brandSlug)) {
        throw new Error(
          `Invalid family \"${family.slug}\": brandSlug mismatch (${family.brandSlug} vs ${brand.slug})`,
        );
      }

      for (const stamp of family.stamps) {
        const hasRequiredFields =
          stamp.modelName.trim().length > 0 &&
          stamp.description.trim().length > 0 &&
          Number.isFinite(stamp.sizeMm.width) &&
          Number.isFinite(stamp.sizeMm.height);

        if (!hasRequiredFields) {
          throw new Error(`Non-publishable stamp \"${stamp.slug}\": missing required fields`);
        }

        if (stamp.brandSlug !== brand.slug || stamp.familySlug !== family.slug) {
          throw new Error(
            `Orphan stamp \"${stamp.slug}\": expected ${brand.slug}/${family.slug} and got ${stamp.brandSlug}/${stamp.familySlug}`,
          );
        }

        if (stamp.colors.length === 0) {
          throw new Error(`Invalid stamp "${stamp.slug}": colors must not be empty`);
        }

        if (stamp.images.default.trim().length === 0) {
          throw new Error(`Invalid stamp "${stamp.slug}": images.default is required`);
        }

        for (const byColorKey of Object.keys(stamp.images.byColor) as TimbreColorCode[]) {
          if (!stamp.colors.includes(byColorKey)) {
            throw new Error(
              `Invalid stamp "${stamp.slug}": images.byColor key "${byColorKey}" is not present in colors`,
            );
          }

          const variantPath = stamp.images.byColor[byColorKey];
          if (!variantPath || variantPath.trim().length === 0) {
            throw new Error(
              `Invalid stamp "${stamp.slug}": images.byColor["${byColorKey}"] must be a non-empty path`,
            );
          }
        }
      }
    }
  }
};

normalizeCatalogImageUrls(timbresCatalog);
assertCatalogIntegrity(timbresCatalog);

export const getBrands = (): TimbreBrand[] => timbresCatalog.brands;

export const getBrandBySlug = (brandSlug: string): TimbreBrand | undefined =>
  timbresCatalog.brands.find((brand) => brand.slug === brandSlug);

export const getFamilyBySlugs = (
  brandSlug: string,
  familySlug: string,
): TimbreFamily | undefined => {
  const brand = getBrandBySlug(brandSlug);
  if (!brand) {
    return undefined;
  }

  return brand.families.find((family) => family.slug === familySlug);
};

export const getStampBySlugs = (
  brandSlug: string,
  familySlug: string,
  stampSlug: string,
): TimbreStamp | undefined => {
  const family = getFamilyBySlugs(brandSlug, familySlug);
  if (!family) {
    return undefined;
  }

  return family.stamps.find((stamp) => stamp.slug === stampSlug);
};

export const getStampStaticParams = (): TimbresStampRouteParams[] =>
  getBrands().flatMap((brand) =>
    brand.families.flatMap((family) =>
      family.stamps.map((stamp) => ({
        params: {
          brand: brand.slug,
          family: family.slug,
          stamp: stamp.slug,
        },
      })),
    ),
  );

export const getStampImageForColor = (
  stamp: TimbreStamp,
  color: TimbreColorCode | undefined,
): string => {
  if (!color) {
    return stamp.images.default;
  }

  return stamp.images.byColor[color] ?? stamp.images.default;
};

export const buildTimbresMenuTree = (): MenuNode[] =>
  getBrands().map((brand) => ({
    title: brand.name,
    path: `/timbres/${brand.slug}`,
    children: brand.families.map((family) => ({
      title: family.name,
      path: `/timbres/${brand.slug}/${family.slug}`,
    })),
  }));

export const getBrandStaticParams = (): TimbresRouteParams[] =>
  getBrands().map((brand) => ({
    params: { brand: brand.slug },
  }));

export const getFamilyStaticParams = (): TimbresRouteParams[] =>
  getBrands().flatMap((brand) =>
    brand.families.map((family) => ({
      params: {
        brand: brand.slug,
        family: family.slug,
      },
    })),
  );

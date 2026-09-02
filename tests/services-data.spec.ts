import { describe, expect, it } from "vitest";

import formulariosSvg from "../src/assets/images/services/formularios.svg?raw";
import formulariosImage from "../src/assets/images/services/formularios.svg?url";
import formulariosCamposSvg from "../src/assets/images/services/formularios-campos.svg?raw";
import formulariosCamposImage from "../src/assets/images/services/formularios-campos.svg?url";
import formulariosCopiasSvg from "../src/assets/images/services/formularios-copias.svg?raw";
import formulariosCopiasImage from "../src/assets/images/services/formularios-copias.svg?url";
import formulariosNumeradosSvg from "../src/assets/images/services/formularios-numerados.svg?raw";
import formulariosNumeradosImage from "../src/assets/images/services/formularios-numerados.svg?url";
import formulariosAutocopiativosSvg from "../src/assets/images/services/formularios-autocopiativos.svg?raw";
import formulariosAutocopiativosImage from "../src/assets/images/services/formularios-autocopiativos.svg?url";
import formulariosRegistroSvg from "../src/assets/images/services/formularios-registro.svg?raw";
import formulariosRegistroImage from "../src/assets/images/services/formularios-registro.svg?url";
import formulariosOrdenTrabajoSvg from "../src/assets/images/services/formularios-orden-trabajo.svg?raw";
import formulariosOrdenTrabajoImage from "../src/assets/images/services/formularios-orden-trabajo.svg?url";
import impresionesIndividualesSvg from "../src/assets/images/services/impresiones-individuales.svg?raw";
import impresionesIndividualesImage from "../src/assets/images/services/impresiones-individuales.svg?url";
import impresionesIndividualesColorSvg from "../src/assets/images/services/impresiones-individuales-color.svg?raw";
import impresionesIndividualesColorImage from "../src/assets/images/services/impresiones-individuales-color.svg?url";
import impresionesIndividualesDocumentosSvg from "../src/assets/images/services/impresiones-individuales-documentos.svg?raw";
import impresionesIndividualesDocumentosImage from "../src/assets/images/services/impresiones-individuales-documentos.svg?url";
import recetariosSvg from "../src/assets/images/services/recetarios.svg?raw";
import recetariosImage from "../src/assets/images/services/recetarios.svg?url";
import recetariosBlockSvg from "../src/assets/images/services/recetarios-block.svg?raw";
import recetariosBlockImage from "../src/assets/images/services/recetarios-block.svg?url";
import recetariosDetalleSvg from "../src/assets/images/services/recetarios-detalle.svg?raw";
import recetariosDetalleImage from "../src/assets/images/services/recetarios-detalle.svg?url";
import tarjeteriaSvg from "../src/assets/images/services/tarjeteria.svg?raw";
import tarjeteriaImage from "../src/assets/images/services/tarjeteria.svg?url";
import tarjeteriaEventosSvg from "../src/assets/images/services/tarjeteria-eventos.svg?raw";
import tarjeteriaEventosImage from "../src/assets/images/services/tarjeteria-eventos.svg?url";
import tarjeteriaPresentacionSvg from "../src/assets/images/services/tarjeteria-presentacion.svg?raw";
import tarjeteriaPresentacionImage from "../src/assets/images/services/tarjeteria-presentacion.svg?url";
import { buildMenuData } from "../src/data/navbar-menu.data";
import {
  buildServiceStaticPaths,
  getActiveServices,
  getServiceBySlug,
  printingServices,
  type PrintingService,
} from "../src/data/services.data";

const serviceAssets = {
  formularios: [
    { src: formulariosImage, svg: formulariosSvg },
    { src: formulariosCamposImage, svg: formulariosCamposSvg },
    { src: formulariosCopiasImage, svg: formulariosCopiasSvg },
    { src: formulariosNumeradosImage, svg: formulariosNumeradosSvg },
    {
      src: formulariosAutocopiativosImage,
      svg: formulariosAutocopiativosSvg,
    },
    { src: formulariosRegistroImage, svg: formulariosRegistroSvg },
    {
      src: formulariosOrdenTrabajoImage,
      svg: formulariosOrdenTrabajoSvg,
    },
  ],
  "impresiones-individuales": [
    { src: impresionesIndividualesImage, svg: impresionesIndividualesSvg },
    {
      src: impresionesIndividualesDocumentosImage,
      svg: impresionesIndividualesDocumentosSvg,
    },
    {
      src: impresionesIndividualesColorImage,
      svg: impresionesIndividualesColorSvg,
    },
  ],
  recetarios: [
    { src: recetariosImage, svg: recetariosSvg },
    { src: recetariosDetalleImage, svg: recetariosDetalleSvg },
    { src: recetariosBlockImage, svg: recetariosBlockSvg },
  ],
  tarjeteria: [
    { src: tarjeteriaImage, svg: tarjeteriaSvg },
    { src: tarjeteriaPresentacionImage, svg: tarjeteriaPresentacionSvg },
    { src: tarjeteriaEventosImage, svg: tarjeteriaEventosSvg },
  ],
} as const;

const expectedServices = [
  {
    slug: "formularios",
    title: "Formularios",
    summary:
      "Formularios impresos para organizar registros, solicitudes y procesos internos.",
    images: [
      {
        src: formulariosImage,
        alt: "Ilustración de formularios impresos con campos organizados",
      },
      {
        src: formulariosCamposImage,
        alt: "Formulario con secciones y campos listos para completar",
      },
      {
        src: formulariosCopiasImage,
        alt: "Juego de formularios autocopiativos en varias hojas",
      },
      {
        src: formulariosNumeradosImage,
        alt: "Formularios numerados para control correlativo",
      },
      {
        src: formulariosAutocopiativosImage,
        alt: "Talón de formularios autocopiativos por capas",
      },
      {
        src: formulariosRegistroImage,
        alt: "Planilla de registro con filas verificadas",
      },
      {
        src: formulariosOrdenTrabajoImage,
        alt: "Orden de trabajo con tareas y herramientas",
      },
    ],
    description: [
      "Creamos formularios adaptados al flujo de trabajo de cada negocio o institución.",
      "La información, los campos y la distribución se organizan para facilitar su lectura y uso cotidiano.",
    ],
    features: [
      "Diseño personalizado de campos y secciones",
      "Distintos tamaños y orientaciones",
      "Opciones de numeración y copias",
      "Tiradas ajustadas a cada necesidad",
    ],
    applications: [
      "Órdenes de trabajo",
      "Comprobantes y registros",
      "Solicitudes y fichas",
      "Documentación administrativa",
    ],
    active: true,
    order: 1,
  },
  {
    slug: "impresiones-individuales",
    title: "Impresiones individuales",
    summary:
      "Impresiones para documentos, material gráfico y necesidades puntuales.",
    images: [
      {
        src: impresionesIndividualesImage,
        alt: "Ilustración de documentos para impresiones individuales",
      },
      {
        src: impresionesIndividualesDocumentosImage,
        alt: "Conjunto de documentos individuales impresos y ordenados",
      },
      {
        src: impresionesIndividualesColorImage,
        alt: "Láminas de impresión individual con detalles a color",
      },
    ],
    description: [
      "Resolvemos trabajos de impresión individuales cuando se necesitan pocas unidades o piezas específicas.",
      "Cada archivo se revisa para mantener una presentación clara y adecuada al uso previsto.",
    ],
    features: [
      "Impresión en color o blanco y negro",
      "Distintos tamaños de papel",
      "Documentos de una o varias páginas",
      "Cantidades reducidas",
    ],
    applications: [
      "Documentos personales",
      "Presentaciones",
      "Material de estudio",
      "Piezas gráficas puntuales",
    ],
    active: true,
    order: 2,
  },
  {
    slug: "recetarios",
    title: "Recetarios",
    summary: "Recetarios personalizados para profesionales y centros de atención.",
    images: [
      {
        src: recetariosImage,
        alt: "Ilustración de un recetario personalizado",
      },
      {
        src: recetariosDetalleImage,
        alt: "Detalle de una hoja de recetario con indicaciones médicas",
      },
      {
        src: recetariosBlockImage,
        alt: "Block de recetarios personalizados listo para usar",
      },
    ],
    description: [
      "Diseñamos recetarios con una estructura clara para los datos del profesional y las indicaciones.",
      "El contenido puede adaptarse a la identidad y a las necesidades de uso de cada consulta.",
    ],
    features: [
      "Datos profesionales personalizados",
      "Espacio organizado para indicaciones",
      "Distintos tamaños",
      "Presentación práctica para uso diario",
    ],
    applications: [
      "Consultas médicas",
      "Profesionales independientes",
      "Centros de atención",
      "Indicaciones y órdenes",
    ],
    active: true,
    order: 3,
  },
  {
    slug: "tarjeteria",
    title: "Tarjetería",
    summary: "Tarjetas personalizadas para presentaciones, eventos y comunicaciones.",
    images: [
      {
        src: tarjeteriaImage,
        alt: "Ilustración de tarjetas impresas personalizadas",
      },
      {
        src: tarjeteriaPresentacionImage,
        alt: "Tarjeta de presentación con diseño profesional",
      },
      {
        src: tarjeteriaEventosImage,
        alt: "Invitaciones y tarjetas impresas para eventos",
      },
    ],
    description: [
      "Producimos tarjetas pensadas para comunicar información de manera clara y cuidada.",
      "El formato, el papel y la composición visual se adaptan al propósito de cada pieza.",
    ],
    features: [
      "Variedad de formatos",
      "Impresión simple o doble faz",
      "Diferentes tipos de papel",
      "Terminaciones según el proyecto",
    ],
    applications: [
      "Tarjetas personales",
      "Invitaciones",
      "Saludos y agradecimientos",
      "Tarjetas para turnos o eventos",
    ],
    active: true,
    order: 4,
  },
] satisfies PrintingService[];

const makeService = (
  slug: string,
  overrides: Partial<PrintingService> = {},
): PrintingService => ({
  slug,
  title: `Servicio ${slug}`,
  summary: `Resumen de ${slug}`,
  images: [
    {
      src: `/images/services/${slug}.svg`,
      alt: `Ilustración del servicio ${slug}`,
    },
  ],
  description: [`Descripción de ${slug}`],
  features: ["Característica"],
  applications: ["Aplicación"],
  active: true,
  order: 0,
  ...overrides,
});

describe("printing services catalog", () => {
  it("contains the four agreed provisional services with complete typed content", () => {
    expect(printingServices).toEqual(expectedServices);
    expect(printingServices.map(({ slug, title }) => ({ slug, title }))).toEqual([
      { slug: "formularios", title: "Formularios" },
      {
        slug: "impresiones-individuales",
        title: "Impresiones individuales",
      },
      { slug: "recetarios", title: "Recetarios" },
      { slug: "tarjeteria", title: "Tarjetería" },
    ]);
  });

  it("keeps every slug unique and every catalog field usable", () => {
    const slugs = printingServices.map(({ slug }) => slug);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(
      Object.fromEntries(
        printingServices.map(({ slug, images }) => [slug, images.length]),
      ),
    ).toEqual({
      formularios: 7,
      "impresiones-individuales": 3,
      recetarios: 3,
      tarjeteria: 3,
    });
    for (const service of printingServices) {
      expect(service.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(service.title.trim()).not.toBe("");
      expect(service.summary.trim()).not.toBe("");
      expect(service.images.length).toBeGreaterThan(0);
      expect(service.images[0]).toEqual({
        src: serviceAssets[service.slug as keyof typeof serviceAssets][0].src,
        alt: expect.stringMatching(/^Ilustración\b/),
      });
      expect(new Set(service.images.map(({ src }) => src)).size).toBe(
        service.images.length,
      );
      expect(new Set(service.images.map(({ alt }) => alt)).size).toBe(
        service.images.length,
      );
      expect(service.images.every(({ src }) => src.trim().length > 0)).toBe(true);
      expect(service.images.every(({ alt }) => alt.trim().length > 0)).toBe(true);
      expect(service.description.every(Boolean)).toBe(true);
      expect(service.features.every(Boolean)).toBe(true);
      expect(service.applications.every(Boolean)).toBe(true);
      expect(service.description.length).toBeGreaterThan(0);
      expect(service.features.length).toBeGreaterThan(0);
      expect(service.applications.length).toBeGreaterThan(0);
      expect(Number.isInteger(service.order)).toBe(true);
      expect(service.order).toBeGreaterThanOrEqual(0);
    }
  });

  it("provides unique, valid, concise 4:3 SVG assets without raster or external content", () => {
    const imageSources = printingServices.flatMap(({ images }) =>
      images.map(({ src }) => src),
    );

    expect(new Set(imageSources).size).toBe(16);
    for (const service of printingServices) {
      const assets = serviceAssets[service.slug as keyof typeof serviceAssets];

      expect(service.images.map(({ src }) => src)).toEqual(
        assets.map(({ src }) => src),
      );
      assets.forEach((asset) => {
        expect(asset.svg).toMatch(/^<svg[^>]+viewBox="0 0 1200 900"/);
        expect(asset.svg).toMatch(/<title(?:\s[^>]*)?>/);
        expect(asset.svg.length).toBeLessThan(3_000);
        for (const color of ["#ff5f00", "#0099a8", "#102a43", "#f4f7f8"]) {
          expect(asset.svg).toContain(color);
        }
        expect(asset.svg).not.toMatch(
          /<image|data:|(?:href|src)=["']https?:|<text/i,
        );
      });
    }
  });

  it("accepts a synthetic service with a single-image non-empty gallery", () => {
    const service = makeService("imagen-unica");

    expect(service.images).toHaveLength(1);
    expect(service.images[0]).toEqual({
      src: "/images/services/imagen-unica.svg",
      alt: "Ilustración del servicio imagen-unica",
    });
  });

  it("filters inactive services and sorts deterministically without mutating input", () => {
    const services = [
      makeService("zeta", { order: 1 }),
      makeService("inactivo", { active: false, order: 0 }),
      makeService("beta", { order: 0 }),
      makeService("alfa", { order: 1 }),
    ];
    const original = [...services];

    expect(getActiveServices(services).map(({ slug }) => slug)).toEqual([
      "beta",
      "alfa",
      "zeta",
    ]);
    expect(services).toEqual(original);
  });

  it("looks up services by slug without changing the catalog", () => {
    const original = [...printingServices];

    expect(getServiceBySlug("recetarios")).toEqual(expectedServices[2]);
    expect(getServiceBySlug("desconocido")).toBeUndefined();
    expect(printingServices).toEqual(original);
  });

  it("generates exactly the four active catalog detail routes", () => {
    expect(
      buildServiceStaticPaths().map(({ params, props }) => ({
        slug: params.slug,
        title: props.service.title,
      })),
    ).toEqual([
      { slug: "formularios", title: "Formularios" },
      {
        slug: "impresiones-individuales",
        title: "Impresiones individuales",
      },
      { slug: "recetarios", title: "Recetarios" },
      { slug: "tarjeteria", title: "Tarjetería" },
    ]);
  });

  it("builds sorted active static paths", () => {
    const services = [
      makeService("segundo", { title: "Segundo", order: 2 }),
      makeService("oculto", { title: "Oculto", active: false, order: 0 }),
      makeService("primero", { title: "Primero", order: 1 }),
    ];

    expect(buildServiceStaticPaths(services)).toEqual([
      { params: { slug: "primero" }, props: { service: services[2] } },
      { params: { slug: "segundo" }, props: { service: services[0] } },
    ]);
  });

  it("builds Servicios as a direct catalog link while preserving Timbres navigation", () => {
    const menu = buildMenuData();
    const servicesMenu = menu.find(({ title }) => title === "Servicios");
    const timbresMenu = menu.find(({ title }) => title === "Timbres");

    expect(servicesMenu).toEqual({
      id: 4,
      title: "Servicios",
      path: "/servicios",
    });
    expect(servicesMenu).not.toHaveProperty("subMenu");
    expect(timbresMenu?.path).toBe("");
    expect(timbresMenu?.subMenu?.length).toBeGreaterThan(0);
  });
});

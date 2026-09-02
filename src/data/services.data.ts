import formulariosImage from "../assets/images/services/formularios.svg?url";
import formulariosCamposImage from "../assets/images/services/formularios-campos.svg?url";
import formulariosCopiasImage from "../assets/images/services/formularios-copias.svg?url";
import formulariosAutocopiativosImage from "../assets/images/services/formularios-autocopiativos.svg?url";
import formulariosNumeradosImage from "../assets/images/services/formularios-numerados.svg?url";
import formulariosOrdenTrabajoImage from "../assets/images/services/formularios-orden-trabajo.svg?url";
import formulariosRegistroImage from "../assets/images/services/formularios-registro.svg?url";
import impresionesIndividualesImage from "../assets/images/services/impresiones-individuales.svg?url";
import impresionesIndividualesColorImage from "../assets/images/services/impresiones-individuales-color.svg?url";
import impresionesIndividualesDocumentosImage from "../assets/images/services/impresiones-individuales-documentos.svg?url";
import recetariosImage from "../assets/images/services/recetarios.svg?url";
import recetariosBlockImage from "../assets/images/services/recetarios-block.svg?url";
import recetariosDetalleImage from "../assets/images/services/recetarios-detalle.svg?url";
import tarjeteriaImage from "../assets/images/services/tarjeteria.svg?url";
import tarjeteriaEventosImage from "../assets/images/services/tarjeteria-eventos.svg?url";
import tarjeteriaPresentacionImage from "../assets/images/services/tarjeteria-presentacion.svg?url";

export interface PrintingServiceImage {
  src: string;
  alt: string;
}

export type PrintingServiceGallery = readonly [
  PrintingServiceImage,
  ...PrintingServiceImage[],
];

export interface PrintingService {
  slug: string;
  title: string;
  summary: string;
  images: PrintingServiceGallery;
  description: string[];
  features: string[];
  applications: string[];
  active: boolean;
  order: number;
}

export interface PrintingServiceStaticPath {
  params: {
    slug: string;
  };
  props: {
    service: PrintingService;
  };
}

export const printingServices: readonly PrintingService[] = [
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
];

export const getActiveServices = (
  services: readonly PrintingService[] = printingServices,
): PrintingService[] =>
  services
    .filter((service) => service.active)
    .sort(
      (left, right) =>
        left.order - right.order || left.slug.localeCompare(right.slug),
    );

export const getServiceBySlug = (
  slug: string,
  services: readonly PrintingService[] = printingServices,
): PrintingService | undefined =>
  services.find((service) => service.slug === slug);

export const buildServiceStaticPaths = (
  services: readonly PrintingService[] = printingServices,
): PrintingServiceStaticPath[] =>
  getActiveServices(services).map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));

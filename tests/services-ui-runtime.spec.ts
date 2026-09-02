import { describe, expect, it } from "vitest";

import serviceCardSource from "../src/components/services/ServiceCard.astro?raw";
import serviceGallerySource from "../src/components/services/service-gallery.ts?raw";
import navbarMenuSource from "../src/components/navbar-menu/NavbarMenu.astro?raw";
import navbarDataSource from "../src/data/navbar-menu.data.ts?raw";
import servicesDataSource from "../src/data/services.data.ts?raw";
import catalogPageSource from "../src/pages/servicios/index.astro?raw";
import detailPageSource from "../src/pages/servicios/[slug].astro?raw";

const serviceRuntimeSources = [
  servicesDataSource,
  navbarDataSource,
  navbarMenuSource,
  catalogPageSource,
  detailPageSource,
  serviceCardSource,
  serviceGallerySource,
].join("\n");

const serviceUiSources = [
  serviceCardSource,
  catalogPageSource,
  detailPageSource,
].join("\n");

describe("services UI source contracts", () => {
  it("uses only the synchronous TypeScript catalog in service runtime wiring", () => {
    expect(serviceRuntimeSources).not.toContain("astro:content");
    expect(serviceRuntimeSources).not.toContain("getCollection(");
    expect(serviceRuntimeSources).not.toContain("render(service)");
    expect(serviceRuntimeSources).not.toMatch(/\bawait\b/);

    expect(catalogPageSource).toContain("getActiveServices()");
    expect(navbarMenuSource).toContain("buildMenuData()");
  });

  it("keeps service galleries non-empty without fixing their image count", () => {
    expect(servicesDataSource).toMatch(
      /export type PrintingServiceGallery = readonly \[\s*PrintingServiceImage,\s*\.\.\.PrintingServiceImage\[\],\s*\]/,
    );
    expect(servicesDataSource).not.toMatch(
      /readonly \[\s*PrintingServiceImage,\s*PrintingServiceImage,\s*PrintingServiceImage\s*\]/,
    );
  });

  it("renders each catalog card as an image-and-title anchor matching Timbres", () => {
    expect(serviceCardSource).toContain("import type { PrintingService }");
    expect(serviceCardSource).toContain(
      '<a class="service-card" href={`/servicios/${service.slug}`}',
    );
    expect(serviceCardSource).toContain(
      "aria-label={`Ver detalle de ${service.title}`}",
    );
    expect(serviceCardSource).toContain("const primaryImage = service.images[0]");
    expect(serviceCardSource).toContain("src={primaryImage.src}");
    expect(serviceCardSource).toContain("alt={primaryImage.alt}");
    expect(serviceCardSource).toContain('loading="lazy"');
    expect(serviceCardSource).toContain('width="300"');
    expect(serviceCardSource).toContain('height="225"');
    expect(serviceCardSource).toContain("<h2>{service.title}</h2>");
    expect(serviceCardSource).not.toContain("service.summary");
    expect(serviceCardSource).not.toMatch(/<article|<p[ >]/);

    expect(serviceCardSource).toContain("border: 1px solid #d9e2ec");
    expect(serviceCardSource).toContain("border-radius: 12px");
    expect(serviceCardSource).toContain("padding: 12px");
    expect(serviceCardSource).toContain("aspect-ratio: 4 / 3");
    expect(serviceCardSource).toContain("object-fit: contain");
    expect(serviceCardSource).toContain("transform: translateY(-1px)");
  });

  it("renders a semantic one, two, and three-column service grid", () => {
    expect(catalogPageSource).toContain("services.length > 0");
    expect(catalogPageSource).toContain('<ul class="services-page__grid">');
    expect(catalogPageSource).toContain("services.map");
    expect(catalogPageSource).toContain("<li>");
    expect(catalogPageSource).toContain("<ServiceCard service={service} />");
    expect(catalogPageSource).toContain(
      "No hay servicios disponibles por el momento.",
    );
    expect(catalogPageSource).toContain("grid-template-columns: 1fr");
    expect(catalogPageSource).toMatch(
      /@media \(min-width: 640px\)[\s\S]*?repeat\(2, minmax\(0, 1fr\)\)/,
    );
    expect(catalogPageSource).toMatch(
      /@media \(min-width: 1024px\)[\s\S]*?repeat\(3, minmax\(0, 1fr\)\)/,
    );
    expect(catalogPageSource).toContain("list-style: none");
    expect(catalogPageSource).toContain("padding: 0");
  });

  it("generates detail routes with a responsive left-media and right-content layout", () => {
    expect(detailPageSource).toMatch(/export function getStaticPaths/);
    expect(detailPageSource).toContain("return buildServiceStaticPaths()");
    expect(detailPageSource).toContain("type PrintingService");
    expect(detailPageSource).toContain('href="/servicios"');
    expect(detailPageSource).toContain('<section class="service-detail__primary">');
    expect(detailPageSource).toContain('class="service-detail__media-wrap"');
    expect(detailPageSource).toContain("data-service-gallery");
    expect(detailPageSource).toContain('class="service-detail__media"');
    expect(detailPageSource).toContain("data-service-gallery-image");
    expect(detailPageSource).toContain("src={initialImage.src}");
    expect(detailPageSource).toContain("alt={initialImage.alt}");
    expect(detailPageSource).toContain('loading="eager"');
    expect(detailPageSource).toContain('width="720"');
    expect(detailPageSource).toContain('height="540"');
    expect(detailPageSource).toContain('class="service-detail__content"');
    expect(detailPageSource).toContain(
      '<p class="service-detail__eyebrow">Servicio de impresión</p>',
    );
    expect(detailPageSource).toContain("service.description.map");
    expect(detailPageSource).toContain("<p>{paragraph}</p>");
    expect(detailPageSource).toContain("service.features.map");
    expect(detailPageSource).toContain("service.applications.map");
    expect(detailPageSource).toContain("aspect-ratio: 4 / 3");
    expect(detailPageSource).toContain("object-fit: contain");
    expect(detailPageSource).toMatch(
      /@media \(min-width: 768px\)[\s\S]*?grid-template-columns: minmax\(0, 5fr\) minmax\(0, 7fr\)/,
    );
    expect(detailPageSource).toContain("position: sticky");
    expect(detailPageSource).toContain("top: 24px");
    expect(detailPageSource).toContain("service.images.map");
    expect(detailPageSource).toContain("data-service-gallery-thumbnail");
    expect(detailPageSource).toContain("data-image={image.src}");
    expect(detailPageSource).toContain("data-alt={image.alt}");
    expect(detailPageSource).toContain("data-index={index}");
    expect(detailPageSource).toContain('aria-pressed={index === 0 ? "true" : "false"}');
    expect(detailPageSource).toContain('loading="lazy"');
    expect(detailPageSource).toContain("data-service-gallery-previous");
    expect(detailPageSource).toContain("data-service-gallery-next");
    expect(detailPageSource).toContain('aria-label="Ver imagen anterior"');
    expect(detailPageSource).toContain('aria-label="Ver imagen siguiente"');
    expect(detailPageSource).toContain(".service-gallery__thumbnail.is-selected");
    expect(detailPageSource).toContain(".service-gallery__thumbnail:focus-visible");

    const primaryIndex = detailPageSource.indexOf("service-detail__primary");
    const listsIndex = detailPageSource.indexOf("service-detail__lists");
    expect(primaryIndex).toBeGreaterThan(-1);
    expect(listsIndex).toBeGreaterThan(primaryIndex);
    expect(detailPageSource).not.toContain("<Content");
  });

  it("conditionally renders controls and uses a one-row scrollable thumbnail strip", () => {
    expect(detailPageSource).toContain(
      "const hasMultipleImages = service.images.length > 1",
    );
    expect(detailPageSource).toContain("const galleryAttributes = hasMultipleImages");
    expect(detailPageSource).toContain("{...galleryAttributes}");
    expect(detailPageSource).toMatch(
      /\{hasMultipleImages && \(\s*<>[\s\S]*?data-service-gallery-previous[\s\S]*?data-service-gallery-next[\s\S]*?<\/>\s*\)\}/,
    );
    expect(detailPageSource).toMatch(
      /\{hasMultipleImages && \(\s*<div[\s\S]*?class="service-gallery__thumbnails"[\s\S]*?service\.images\.map[\s\S]*?<\/div>\s*\)\}/,
    );
    expect(detailPageSource).toMatch(
      /\.service-gallery__thumbnails \{[\s\S]*?display: flex;[\s\S]*?flex-wrap: nowrap;[\s\S]*?overflow-x: auto;[\s\S]*?scroll-snap-type: x mandatory;/,
    );
    expect(detailPageSource).toMatch(
      /\.service-gallery__thumbnail \{[\s\S]*?flex: 0 0 clamp\([^)]+\);[\s\S]*?scroll-snap-align: start;/,
    );
    expect(detailPageSource).not.toContain(
      "grid-template-columns: repeat(3, minmax(0, 1fr))",
    );
    expect(serviceGallerySource).toContain("thumbnail.scrollIntoView({");
    expect(serviceGallerySource).toContain('block: "nearest"');
    expect(serviceGallerySource).toContain('inline: "nearest"');
  });

  it("keeps Servicios as a direct catalog link and preserves Timbres navigation", () => {
    expect(navbarDataSource).toContain("buildTimbresMenuTree()");
    expect(navbarDataSource).not.toContain("buildServicesNavigation");
    expect(navbarDataSource).not.toContain('title: "Todos los servicios"');
    expect(navbarDataSource).toMatch(
      /id: 4,\s*title: "Servicios",\s*path: "\/servicios",\s*}/,
    );
    expect(navbarDataSource).not.toMatch(
      /title: "Servicios",\s*path: "\/servicios",\s*subMenu:/,
    );
    expect(navbarDataSource.match(/subMenu: timbresSubMenu/g)).toHaveLength(1);
  });

  it("adds only the intentional gallery controls and script, with no CTA", () => {
    const galleryScripts = detailPageSource.match(/<script>[\s\S]*?<\/script>/g) ?? [];
    const galleryScriptIndex = detailPageSource.indexOf("<script>");
    const closingLayoutIndex = detailPageSource.indexOf("</Layout>");

    expect(galleryScripts).toHaveLength(1);
    expect(galleryScripts[0]).toContain(
      'import { initAllServiceGalleries } from "@/components/services/service-gallery"',
    );
    expect(galleryScriptIndex).toBeGreaterThan(-1);
    expect(closingLayoutIndex).toBeGreaterThan(galleryScriptIndex);
    expect(detailPageSource).toContain('document.addEventListener("DOMContentLoaded", init');
    expect(detailPageSource).toContain('document.addEventListener("astro:page-load", init)');
    expect(serviceGallerySource).toContain("export function initServiceGallery");
    expect(serviceGallerySource).toContain("export function initAllServiceGalleries");
    expect(serviceUiSources).not.toMatch(/<form|client:|call-to-action|\bcta\b/i);
    expect(serviceUiSources).not.toMatch(
      /solicitar|cotizar|contáctanos|contactanos|ver detalles/i,
    );
  });
});

import type { HeroSlideItem } from "@/components/hero-slider/hero-slider.types";
import backgroundUrl from "@/assets/background.svg?url";
import logoUrl from "@/assets/images/logo.svg?url";

export const sliderItems: HeroSlideItem[] = [
  {
    eyebrow: "Tauro Curicó",
    title: "Timbres automáticos para tu negocio",
    description: "Soluciones Trodat para oficina, comercio y uso profesional.",
    image: logoUrl,
    link: "#",
    buttonText: "Ver catálogo",
    layout: "right",
    active: true,
  },
  {
    eyebrow: "Catálogo especializado",
    title: "Modelos para cada necesidad",
    description: "Encuentra formatos redondos, cuadrados y rectangulares según tu uso.",
    image: backgroundUrl,
    link: "#",
    buttonText: "Explorar timbres",
    layout: "left",
    active: true,
  },
  {
    eyebrow: "Atención local",
    title: "Asesoría para elegir tu timbre",
    description: "Te ayudamos a seleccionar el modelo adecuado para tu marca o documento.",
    image: logoUrl,
    link: "#",
    buttonText: "Contactar",
    active: true,
  },
];

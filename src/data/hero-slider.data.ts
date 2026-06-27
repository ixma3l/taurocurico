import type { HeroSlideItem } from "@/components/hero-slider/hero-slider.types";

export const sliderItems: HeroSlideItem[] = [
  {
    eyebrow: "Limited time offer!",
    title: "Huge Summer Sale",
    description: "La imagen entra primero desde arriba y luego aparece el contenido.",
    image: "https://bigbag-html.netlify.app/assets/img/home/banner-slider/sl1.png",
    link: "#",
    buttonText: "Buy now",
    layout: "right",
    active: true,
  },
  {
    eyebrow: "Limited time offer!",
    title: "Ladies Backpack",
    description: "Este slide está desactivado.",
    image: "https://bigbag-html.netlify.app/assets/img/home/banner-slider/sl2.png",
    link: "#",
    buttonText: "Buy now",
    layout: "left",
    active: true,
  },
  {
    eyebrow: "Limited time offer!",
    title: "Canvas Sneaker",
    description: "Este sí se mostrará.",
    image: "https://bigbag-html.netlify.app/assets/img/home/banner-slider/shoe1.png",
    link: "#",
    buttonText: "Buy now",
    active: true,
  },
];
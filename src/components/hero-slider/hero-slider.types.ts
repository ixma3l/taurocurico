export type SlideLayout = "left" | "right";

export interface HeroSlideItem {
  title: string;
  image: string;
  link: string;
  eyebrow?: string;
  description?: string;
  buttonText?: string;
  layout?: SlideLayout;
  active?: boolean;
}

export interface HeroSliderProps {
  items?: HeroSlideItem[];
  autoPlayMs?: number;
  ariaLabel?: string;
  class?: string;
}

export interface SubMenuItem {
  title: string;
  path: string;
}

export interface MenuItem {
  id: number;
  title: string;
  path: string;
  subMenu?: SubMenuItem[];
}

export const MenuData: MenuItem[] = [
  {
    id: 1,
    title: "Inicio",
    path: "/",
  },
  {
    id: 2,
    title: "Acerca",
    path: "/acerca",
  },
  {
    id: 3,
    title: "Timbres",
    path: "",
    subMenu: [
      { title: "Imprint", path: "/timbres/imprint" },
      { title: "Trodat", path: "/timbres/trodat" },
    ],
  },
  {
    id: 4,
    title: "Contacto",
    path: "/contacto",
  },
];

export default MenuData;

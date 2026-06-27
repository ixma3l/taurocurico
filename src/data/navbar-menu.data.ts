import { buildTimbresMenuTree } from "@/data/timbres-data";

export interface SubMenuItem {
  title: string;
  path: string;
  subMenu?: SubMenuItem[];
}

export interface MenuItem {
  id: number;
  title: string;
  path: string;
  subMenu?: SubMenuItem[];
}

const timbresSubMenu: SubMenuItem[] = buildTimbresMenuTree().map((brandNode) => ({
  title: brandNode.title,
  path: "",
  subMenu: brandNode.children?.map((familyNode) => ({
    title: familyNode.title,
    path: familyNode.path,
  })),
}));

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
    subMenu: timbresSubMenu,
  },
  {
    id: 4,
    title: "Servicios",
    path: "/servicios",
    subMenu: timbresSubMenu,
  },
  {
    id: 5,
    title: "Contacto",
    path: "/contacto",
  },
];

export default MenuData;

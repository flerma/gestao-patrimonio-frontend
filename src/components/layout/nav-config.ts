import {
  Building2,
  FileText,
  LayoutDashboard,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Resumo do patrimônio",
  },
  {
    title: "Imóveis",
    href: "/imoveis",
    icon: Building2,
    description: "Cadastro e busca de imóveis",
  },
  {
    title: "Inquilinos",
    href: "/inquilinos",
    icon: UsersRound,
    description: "Cadastro e busca de inquilinos",
  },
  {
    title: "Contratos",
    href: "/contratos",
    icon: FileText,
    description: "Contratos de locação",
  },
  {
    title: "Usuários",
    href: "/usuarios",
    icon: Users,
    description: "Proprietários do patrimônio",
  },
];

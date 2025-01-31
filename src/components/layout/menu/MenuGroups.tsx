import { HardHat, LayoutDashboard, Users, Building2, Briefcase, CircleDollarSign, 
  UserCog, Truck, Factory, FileText, Calendar, Plus, ClipboardCheck, Boxes, CalendarRange } from "lucide-react";
import { MenuItem, MenuGroup } from "./types";

export function useMenuGroups(shouldShowMenuItem: (path: string) => boolean) {
  const createNewItemAction = (selector: string) => ({
    icon: Plus,
    label: "Novo Item",
    onClick: () => {
      const newButton = document.querySelector(selector);
      if (newButton instanceof HTMLButtonElement) {
        newButton.click();
      }
    },
  });

  const menuGroups: MenuGroup[] = [
    {
      id: "main",
      items: [
        { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      id: "rh",
      label: "RH",
      icon: HardHat,
      items: [
        {
          path: "/employees",
          label: "Funcionários",
          icon: Users,
          action: createNewItemAction("[data-new-employee]"),
        },
        { 
          path: "/functions", 
          label: "Funções", 
          icon: Briefcase,
          action: createNewItemAction("[data-new-function]"),
        },
        { 
          path: "/teams", 
          label: "Equipes", 
          icon: Users,
          action: createNewItemAction("[data-new-team]"),
        },
        { 
          path: "/companies", 
          label: "Empresas", 
          icon: Building2,
          action: createNewItemAction("[data-new-company]"),
        },
        { 
          path: "/cost-centers", 
          label: "Centros de Custo", 
          icon: CircleDollarSign,
          action: createNewItemAction("[data-new-cost-center]"),
        },
        { path: "/permissions", label: "Permissões de Usuário", icon: UserCog },
      ].filter(item => shouldShowMenuItem(item.path)),
    },
    {
      id: "equipment",
      label: "Cadastro CAM/EQUI",
      icon: Truck,
      items: [
        { 
          path: "/trucks-equipment", 
          label: "Caminhões/Equipamentos", 
          icon: Truck,
          action: createNewItemAction("[data-new-truck-equipment]"),
        },
        { 
          path: "/fleets", 
          label: "Frotas", 
          icon: Boxes,
          action: createNewItemAction("[data-new-fleet]"),
        },
        { 
          path: "/plants", 
          label: "Usinas", 
          icon: Factory,
          action: createNewItemAction("[data-new-plant]"),
        },
        { path: "/inspection-checklist", label: "Checklist de Inspeção", icon: ClipboardCheck },
      ].filter(item => shouldShowMenuItem(item.path)),
    },
    {
      id: "mass-planning",
      label: "Planejamento",
      icon: CalendarRange,
      items: [
        { 
          path: "/mass-requests", 
          label: "Requisição de Massa", 
          icon: FileText,
          action: createNewItemAction("[data-new-mass-request]"),
        },
        { 
          path: "/mass-programming", 
          label: "Programação de Massa", 
          icon: Calendar,
          action: createNewItemAction("[data-new-mass-programming]"),
        },
      ].filter(item => shouldShowMenuItem(item.path)),
    },
  ];

  return menuGroups;
}
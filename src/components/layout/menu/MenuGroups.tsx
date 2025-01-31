import { HardHat, LayoutDashboard, Users, Building2, Briefcase, CircleDollarSign, 
  UserCog, Truck, Factory, FileText, Calendar, Plus, ClipboardCheck, Boxes, CalendarRange } from "lucide-react";
import { MenuItem, MenuGroup } from "./types";

export function useMenuGroups(shouldShowMenuItem: (path: string) => boolean) {
  const createNewItemAction = (selector: string, screenName: string) => ({
    icon: Plus,
    label: "Novo Item",
    permission: 'create' as const,
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
          action: createNewItemAction("[data-new-employee]", "employees"),
        },
        { 
          path: "/functions", 
          label: "Funções", 
          icon: Briefcase,
          action: createNewItemAction("[data-new-function]", "functions"),
        },
        { 
          path: "/teams", 
          label: "Equipes", 
          icon: Users,
          action: createNewItemAction("[data-new-team]", "teams"),
        },
        { 
          path: "/companies", 
          label: "Empresas", 
          icon: Building2,
          action: createNewItemAction("[data-new-company]", "companies"),
        },
        { 
          path: "/cost-centers", 
          label: "Centros de Custo", 
          icon: CircleDollarSign,
          action: createNewItemAction("[data-new-cost-center]", "cost-centers"),
        },
        { path: "/permissions", label: "Permissões de Usuário", icon: UserCog },
      ],
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
          action: createNewItemAction("[data-new-truck-equipment]", "trucks-equipment"),
        },
        { 
          path: "/fleets", 
          label: "Frotas", 
          icon: Boxes,
          action: createNewItemAction("[data-new-fleet]", "fleets"),
        },
        { 
          path: "/plants", 
          label: "Usinas", 
          icon: Factory,
          action: createNewItemAction("[data-new-plant]", "plants"),
        },
        { path: "/inspection-checklist", label: "Checklist de Inspeção", icon: ClipboardCheck },
      ],
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
          action: createNewItemAction("[data-new-mass-request]", "mass-requests"),
        },
        { 
          path: "/mass-programming", 
          label: "Programação de Massa", 
          icon: Calendar,
          action: createNewItemAction("[data-new-mass-programming]", "mass-programming"),
        },
      ],
    },
  ];

  // Filter out menu groups where no items are visible
  return menuGroups.filter(group => {
    const visibleItems = group.items.filter(item => shouldShowMenuItem(item.path));
    return visibleItems.length > 0;
  });
}
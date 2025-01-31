import { useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  CircleDollarSign,
  LogOut,
  Truck,
  Factory,
  FileText,
  Calendar,
  Plus,
  UserCog,
  ClipboardCheck,
  Boxes,
  CalendarRange,
  ChevronDown,
  ChevronLeft,
  HardHat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem } from "./SidebarMenuItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/usePermissions";

interface MenuItem {
  path: string;
  label: string;
  icon: typeof LayoutDashboard;
  action?: {
    icon: typeof Plus;
    label: string;
    onClick: () => void;
  };
}

interface MenuGroup {
  id: string;
  label?: string;
  icon?: typeof HardHat;
  items: MenuItem[];
}

export function DashboardLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const { canAccessScreen, userPermissionLevel } = usePermissions();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    if (isMobile && location.pathname === "/inspection-checklist") {
      setShowSidebar(false);
    } else if (isMobile) {
      setShowSidebar(true);
    }
  }, [location.pathname, isMobile]);

  const toggleGroup = (group: string) => {
    setOpenGroups(current =>
      current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
    );
  };

  // Function to check if user should see menu item
  const shouldShowMenuItem = (path: string) => {
    return userPermissionLevel === 'admin' || canAccessScreen(path.substring(1));
  };

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
          action: {
            icon: Plus,
            label: "Novo Funcionário",
            onClick: () => {
              const newButton = document.querySelector("[data-new-employee]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/functions", 
          label: "Funções", 
          icon: Briefcase,
          action: {
            icon: Plus,
            label: "Nova Função",
            onClick: () => {
              const newButton = document.querySelector("[data-new-function]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/teams", 
          label: "Equipes", 
          icon: Users,
          action: {
            icon: Plus,
            label: "Nova Equipe",
            onClick: () => {
              const newButton = document.querySelector("[data-new-team]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/companies", 
          label: "Empresas", 
          icon: Building2,
          action: {
            icon: Plus,
            label: "Nova Empresa",
            onClick: () => {
              const newButton = document.querySelector("[data-new-company]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/cost-centers", 
          label: "Centros de Custo", 
          icon: CircleDollarSign,
          action: {
            icon: Plus,
            label: "Novo Centro de Custo",
            onClick: () => {
              const newButton = document.querySelector("[data-new-cost-center]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
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
          action: {
            icon: Plus,
            label: "Novo Caminhão/Equipamento",
            onClick: () => {
              const newButton = document.querySelector("[data-new-truck-equipment]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/fleets", 
          label: "Frotas", 
          icon: Boxes,
          action: {
            icon: Plus,
            label: "Nova Frota",
            onClick: () => {
              const newButton = document.querySelector("[data-new-fleet]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/plants", 
          label: "Usinas", 
          icon: Factory,
          action: {
            icon: Plus,
            label: "Nova Usina",
            onClick: () => {
              const newButton = document.querySelector("[data-new-plant]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
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
          action: {
            icon: Plus,
            label: "Nova Requisição",
            onClick: () => {
              const newButton = document.querySelector("[data-new-mass-request]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
        { 
          path: "/mass-programming", 
          label: "Programação de Massa", 
          icon: Calendar,
          action: {
            icon: Plus,
            label: "Nova Programação",
            onClick: () => {
              const newButton = document.querySelector("[data-new-mass-programming]");
              if (newButton instanceof HTMLButtonElement) {
                newButton.click();
              }
            },
          },
        },
      ].filter(item => shouldShowMenuItem(item.path)),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        {showSidebar ? (
          <div className={cn(
            "w-64 bg-white shadow-lg flex-shrink-0",
            isMobile && "fixed inset-0 w-full z-50"
          )}>
            <div className="flex flex-col h-full">
              <div className="p-4">
                <h1 className="text-xl font-bold">RH Asfalto</h1>
              </div>
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuGroups.map((group) => (
                    <li key={group.id}>
                      {group.label ? (
                        <Collapsible
                          open={openGroups.includes(group.id)}
                          onOpenChange={() => toggleGroup(group.id)}
                        >
                          <CollapsibleTrigger asChild>
                            <button
                              className={cn(
                                "flex w-full items-center justify-between px-4 py-2 rounded-lg transition-colors hover:bg-gray-100",
                                openGroups.includes(group.id) && "bg-gray-100"
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {group.icon && <group.icon className="h-5 w-5" />}
                                <span>{group.label}</span>
                              </div>
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  openGroups.includes(group.id) && "rotate-180"
                                )}
                              />
                            </button>
                          </CollapsibleTrigger>
                          <CollapsibleContent className="pl-4 space-y-1">
                            {group.items.map((item) => (
                              <SidebarMenuItem
                                key={item.path}
                                path={item.path}
                                label={item.label}
                                icon={item.icon}
                                isActive={isActive(item.path)}
                                action={item.action}
                              />
                            ))}
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        group.items.map((item) => (
                          <SidebarMenuItem
                            key={item.path}
                            path={item.path}
                            label={item.label}
                            icon={item.icon}
                            isActive={isActive(item.path)}
                            action={item.action}
                          />
                        ))
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t">
                <Button
                  variant="outline"
                  className="w-full flex items-center space-x-2"
                  onClick={() => signOut()}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50"
            onClick={() => setShowSidebar(true)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <div className={cn(
          "flex-1 overflow-auto",
          !showSidebar && "w-full"
        )}>
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

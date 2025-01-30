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
  HardHat,
  Boxes,
  Scale,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem } from "./SidebarMenuItem";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function DashboardLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleGroup = (group: string) => {
    setOpenGroups(current =>
      current.includes(group)
        ? current.filter(g => g !== group)
        : [...current, group]
    );
  };

  const menuGroups = [
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
        { path: "/functions", label: "Funções", icon: Briefcase },
        { path: "/teams", label: "Equipes", icon: Users },
        { path: "/companies", label: "Empresas", icon: Building2 },
        { path: "/cost-centers", label: "Centros de Custo", icon: CircleDollarSign },
        { path: "/permissions", label: "Permissões de Usuário", icon: UserCog },
      ],
    },
    {
      id: "equipment",
      label: "Cadastro CAM/EQUI",
      icon: Truck,
      items: [
        { path: "/trucks-equipment", label: "Caminhões/Equipamentos", icon: Truck },
        { path: "/fleets", label: "Frotas", icon: Boxes },
        { path: "/plants", label: "Usinas", icon: Factory },
        { path: "/inspection-checklist", label: "Checklist de Inspeção", icon: ClipboardCheck },
      ],
    },
    {
      id: "mass-planning",
      label: "Cadastro Planejamento de Massa",
      icon: Scale,
      items: [
        { path: "/mass-requests", label: "Requisição de Massa", icon: FileText },
        { path: "/mass-programming", label: "Programação de Massa", icon: Calendar },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen">
        <div className="w-64 bg-white shadow-lg flex-shrink-0">
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
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
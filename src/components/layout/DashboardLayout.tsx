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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarMenuItem } from "./SidebarMenuItem";

export function DashboardLayout() {
  const { signOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
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
    { path: "/teams", label: "Equipes", icon: Users },
    { path: "/companies", label: "Empresas", icon: Building2 },
    { path: "/functions", label: "Funções", icon: Briefcase },
    { path: "/cost-centers", label: "Centros de Custo", icon: CircleDollarSign },
    { path: "/fleets", label: "Frotas", icon: Truck },
    { path: "/trucks-equipment", label: "Caminhões/Equipamentos", icon: Truck },
    { path: "/plants", label: "Usinas", icon: Factory },
    { path: "/mass-requests", label: "Requisição de Massa", icon: FileText },
    { path: "/mass-programming", label: "Programação de Massa", icon: Calendar },
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
                {menuItems.map((item) => (
                  <SidebarMenuItem
                    key={item.path}
                    path={item.path}
                    label={item.label}
                    icon={item.icon}
                    isActive={isActive(item.path)}
                    action={item.action}
                  />
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
import { Link, useLocation, Outlet } from "react-router-dom";
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
          // This will be handled by the page component
          const newButton = document.querySelector('[data-new-employee]');
          if (newButton instanceof HTMLButtonElement) {
            newButton.click();
          }
        }
      }
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
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg flex-shrink-0">
          <div className="flex flex-col h-full">
            <div className="p-4">
              <h1 className="text-xl font-bold">RH Asfalto</h1>
            </div>
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.path} className="relative">
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                          isActive(item.path)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                      {item.action && isActive(item.path) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={item.action.onClick}
                        >
                          <item.action.icon className="h-4 w-4" />
                          <span className="sr-only">{item.action.label}</span>
                        </Button>
                      )}
                    </li>
                  );
                })}
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

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  </div>
  );
}
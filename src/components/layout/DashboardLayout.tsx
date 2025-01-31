import { useLocation, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePermissions } from "@/hooks/usePermissions";
import { useState, useEffect } from "react";
import { MenuContent } from "./menu/MenuContent";
import { useMenuGroups } from "./menu/MenuGroups";

export function DashboardLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const { canAccessScreen, userPermissionLevel } = usePermissions();

  useEffect(() => {
    if (isMobile && location.pathname === "/inspection-checklist") {
      setShowSidebar(false);
    } else if (isMobile) {
      setShowSidebar(true);
    }
  }, [location.pathname, isMobile]);

  const shouldShowMenuItem = (path: string) => {
    return userPermissionLevel === 'admin' || canAccessScreen(path.substring(1));
  };

  const menuGroups = useMenuGroups(shouldShowMenuItem);

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
                <MenuContent menuGroups={menuGroups} />
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
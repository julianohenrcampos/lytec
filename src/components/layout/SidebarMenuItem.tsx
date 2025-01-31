import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { usePermissions } from "@/hooks/usePermissions";

interface SidebarMenuItemProps {
  path: string;
  label: string;
  icon: LucideIcon;
  isActive: boolean;
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    permission?: 'create' | 'edit' | 'delete';
  };
}

export function SidebarMenuItem({ path, label, icon: Icon, isActive, action }: SidebarMenuItemProps) {
  const { canPerformAction, userPermissionLevel } = usePermissions();
  const screenName = path.substring(1); // Remove leading slash

  // Show action button if user is admin or has the required permission
  const showActionButton = action && (
    userPermissionLevel === 'admin' || 
    (!action.permission || canPerformAction(screenName, action.permission))
  );

  return (
    <li className="relative">
      <Link
        to={path}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-gray-100"
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
      {showActionButton && isActive && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={action.onClick}
        >
          <action.icon className="h-4 w-4" />
          <span className="sr-only">{action.label}</span>
        </Button>
      )}
    </li>
  );
}
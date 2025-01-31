import { useState } from "react";
import { useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenuItem } from "../SidebarMenuItem";
import { MenuGroup } from "./types";

interface MenuContentProps {
  menuGroups: MenuGroup[];
}

export function MenuContent({ menuGroups }: MenuContentProps) {
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

  return (
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
  );
}
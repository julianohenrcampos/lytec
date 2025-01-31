import { LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
  };
}

export interface MenuGroup {
  id: string;
  label?: string;
  icon?: LucideIcon;
  items: MenuItem[];
}
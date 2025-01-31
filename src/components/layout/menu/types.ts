import { LucideIcon } from "lucide-react";

export interface MenuItem {
  path: string;
  label: string;
  icon: LucideIcon;
  action?: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    permission?: 'create' | 'edit' | 'delete';
  };
}

export interface MenuGroup {
  id: string;
  label?: string;
  icon?: LucideIcon;
  items: MenuItem[];
}
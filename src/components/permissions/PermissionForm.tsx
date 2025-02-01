import { useAdminPermissions } from "@/hooks/useAdminPermissions";

export function PermissionForm() {
  useAdminPermissions();
  return null;
}
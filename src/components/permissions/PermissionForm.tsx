import { useAdminPermissions } from "@/hooks/useAdminPermissions";
import type { UserPermissionLevel } from "@/types/permissions";

interface PermissionFormProps {
  selectedUser: {
    id: string;
    nome: string;
    permissao_usuario: UserPermissionLevel | null;
  } | null;
  onSuccess: () => void;
}

export function PermissionForm({ selectedUser, onSuccess }: PermissionFormProps) {
  useAdminPermissions({ selectedUser, onSuccess });
  return null;
}
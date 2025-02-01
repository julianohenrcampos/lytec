import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function PermissionForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function updatePermissions() {
      if (user?.email === "julianohcampos@yahoo.com.br") {
        try {
          // Update user's permission level
          const { error: updateError } = await supabase
            .from("bd_rhasfalto")
            .update({ permissao_usuario: "admin" })
            .eq("id", user.id);
          
          if (updateError) throw updateError;

          // Update screen permissions
          const screens = [
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
          ];

          const { error: screenError } = await supabase
            .from("permission_screens")
            .upsert(
              screens.map(screen => ({
                permission_level: "admin",
                screen_name: screen,
                can_access: true,
                can_create: true,
                can_edit: true,
                can_delete: true,
              })),
              { onConflict: 'permission_level,screen_name' }
            );

          if (screenError) throw screenError;

          toast({
            title: "Sucesso",
            description: "Permissões atualizadas com sucesso",
          });
        } catch (error) {
          console.error("Error updating permissions:", error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar permissões",
            variant: "destructive",
          });
        }
      }
    }

    updatePermissions();
  }, [user, toast]);

  return null;
}
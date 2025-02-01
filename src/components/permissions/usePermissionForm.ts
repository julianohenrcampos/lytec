import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { UserPermissionLevel } from "@/types/permissions";

interface CreatePermissionParams {
  usuario_id: string;
  permissao_usuario: UserPermissionLevel;
  screens: string[];
}

export function usePermissionForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .order("nome");

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      return data;
    },
  });

  const createPermission = useMutation({
    mutationFn: async ({ usuario_id, permissao_usuario, screens }: CreatePermissionParams) => {
      try {
        console.log("Creating permission with:", { usuario_id, permissao_usuario, screens });
        
        // Update user's permission level
        const { error: updateError } = await supabase
          .from("bd_rhasfalto")
          .update({ permissao_usuario })
          .eq("id", usuario_id);

        if (updateError) {
          console.error("Error updating user permission:", updateError);
          throw updateError;
        }

        // Delete existing screen permissions for this permission level
        const { error: deleteError } = await supabase
          .from("permission_screens")
          .delete()
          .eq("permission_level", permissao_usuario);

        if (deleteError) {
          console.error("Error deleting existing permissions:", deleteError);
          throw deleteError;
        }

        // Only insert new permissions if there are selected screens
        if (screens.length > 0) {
          const permissionsToInsert = screens.map(screen => ({
            permission_level: permissao_usuario,
            screen_name: screen,
            can_access: true,
          }));

          console.log("Inserting permissions:", permissionsToInsert);

          const { error: screenError } = await supabase
            .from("permission_screens")
            .insert(permissionsToInsert);

          if (screenError) {
            console.error("Error inserting screen permissions:", screenError);
            throw screenError;
          }
        }

        return { success: true };
      } catch (error) {
        console.error("Error in createPermission:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["screenPermissions"] });
      onSuccess();
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast({
        title: "Erro",
        description: "Erro ao criar permissão",
        variant: "destructive",
      });
    },
  });

  return {
    users,
    isLoadingUsers,
    createPermission,
  };
}
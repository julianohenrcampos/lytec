import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CreatePermissionParams {
  usuario_id: string;
  tela: string;
  acesso: boolean;
  permissao_usuario?: "admin" | "rh" | "transporte" | "logistica" | "motorista" | "operador" | "apontador" | "encarregado";
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
    mutationFn: async ({ usuario_id, tela, acesso, permissao_usuario }: CreatePermissionParams) => {
      try {
        // First update the user's permission level if provided
        if (permissao_usuario) {
          const { error: updateError } = await supabase
            .from("bd_rhasfalto")
            .update({ permissao_usuario })
            .eq("id", usuario_id);

          if (updateError) throw updateError;
        }

        // Delete existing permission for this user and screen
        const { error: deleteError } = await supabase
          .from("bd_permissoes")
          .delete()
          .eq("usuario_id", usuario_id)
          .eq("tela", tela);

        if (deleteError) throw deleteError;

        // Create new permission if access is granted
        if (acesso || tela === "none") {
          const { error: insertError } = await supabase
            .from("bd_permissoes")
            .insert([{
              usuario_id,
              tela,
              acesso,
            }]);

          if (insertError) throw insertError;
        }

        return { success: true };
      } catch (error) {
        console.error("Error in createPermission:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      onSuccess();
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function usePermissionForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      console.log("Fetching users...");
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("id, nome")
        .order("nome");

      if (error) {
        console.error("Error fetching users:", error);
        throw error;
      }
      
      console.log("Users fetched:", data);
      return data;
    },
  });

  const createPermission = useMutation({
    mutationFn: async (values: {
      usuario_id: string;
      tela: string;
      acesso: boolean;
      permissao_usuario?: "admin" | "rh" | "transporte" | "logistica" | "motorista" | "operador" | "apontador" | "encarregado";
    }) => {
      // First update the user's permission level
      if (values.permissao_usuario) {
        const { error: updateError } = await supabase
          .from("bd_rhasfalto")
          .update({ permissao_usuario: values.permissao_usuario })
          .eq("id", values.usuario_id);

        if (updateError) throw updateError;
      }

      // Then create the screen-level permission
      const { data, error } = await supabase
        .from("bd_permissoes")
        .insert([{
          usuario_id: values.usuario_id,
          tela: values.tela,
          acesso: values.acesso,
        }])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      toast({
        title: "Sucesso",
        description: "Permissão criada com sucesso",
      });
      onSuccess();
    },
    onError: (error) => {
      console.error("Error creating permission:", error);
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
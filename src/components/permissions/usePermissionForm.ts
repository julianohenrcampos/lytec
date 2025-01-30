import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PermissionFormValues } from "./schema";

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

      if (error) throw error;
      return data;
    },
  });

  const createPermission = useMutation({
    mutationFn: async (values: PermissionFormValues) => {
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
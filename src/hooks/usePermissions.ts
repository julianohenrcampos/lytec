import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { UserPermissionLevel, ScreenPermission, PermissionAction, UpdatePermissionParams } from "@/types/permissions";
import { checkScreenAccess, checkActionPermission } from "@/utils/permissionUtils";

export function usePermissions() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user's permission level
  const { data: userPermissionLevel, isLoading: isUserLoading } = useQuery({
    queryKey: ["userPermissionLevel", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching permission level:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar o nível de permissão",
          variant: "destructive",
        });
        return null;
      }

      console.log("User permission level:", data?.permissao_usuario);
      return data?.permissao_usuario as UserPermissionLevel | null;
    },
    enabled: !!user?.id,
  });

  // Fetch screen permissions
  const { data: screenPermissions, isLoading: isScreenLoading } = useQuery({
    queryKey: ["screenPermissions", userPermissionLevel],
    queryFn: async () => {
      if (!userPermissionLevel) return [];

      const { data, error } = await supabase
        .from("permission_screens")
        .select("*")
        .eq("permission_level", userPermissionLevel);
      
      if (error) {
        console.error("Error fetching screen permissions:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar as permissões",
          variant: "destructive",
        });
        return [];
      }

      console.log("Screen permissions:", data);
      return data as ScreenPermission[];
    },
    enabled: !!userPermissionLevel,
  });

  const canAccessScreen = (screenName: string): boolean => {
    console.log("Checking access for screen:", screenName, "User level:", userPermissionLevel);
    return checkScreenAccess(screenName, userPermissionLevel, screenPermissions);
  };

  const canPerformAction = (screenName: string, action: PermissionAction): boolean => {
    console.log(`Checking ${action} permission for screen:`, screenName);
    return checkActionPermission(screenName, action, userPermissionLevel, screenPermissions);
  };

  const updateUserPermission = useMutation({
    mutationFn: async ({ userId, newPermissionLevel, screens }: UpdatePermissionParams) => {
      // Update user's permission level
      const { error: updateError } = await supabase
        .from("bd_rhasfalto")
        .update({ permissao_usuario: newPermissionLevel })
        .eq("id", userId);
      
      if (updateError) throw updateError;

      // Update screen permissions
      const { error: screenError } = await supabase
        .from("permission_screens")
        .upsert(
          screens.map(screen => ({
            permission_level: newPermissionLevel,
            screen_name: screen,
            can_access: true,
            can_create: true,
            can_edit: true,
            can_delete: true,
          })),
          { onConflict: 'permission_level,screen_name' }
        );

      if (screenError) throw screenError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPermissionLevel"] });
      queryClient.invalidateQueries({ queryKey: ["screenPermissions"] });
      toast({
        title: "Sucesso",
        description: "Permissões atualizadas com sucesso",
      });
    },
    onError: (error) => {
      console.error("Error updating permissions:", error);
      toast({
        title: "Erro",
        description: "Erro ao atualizar permissões",
        variant: "destructive",
      });
    },
  });

  return {
    userPermissionLevel,
    screenPermissions,
    canAccessScreen,
    canPerformAction,
    isLoading: isUserLoading || isScreenLoading,
    updateUserPermission,
  };
}
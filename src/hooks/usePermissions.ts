import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const { data: userPermissionLevel } = useQuery({
    queryKey: ["userPermissionLevel", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user permission level:", error);
        return null;
      }

      return data?.permissao_usuario;
    },
  });

  const { data: screenPermissions } = useQuery({
    queryKey: ["screenPermissions", userPermissionLevel],
    queryFn: async () => {
      if (!userPermissionLevel) return [];

      const { data, error } = await supabase
        .from("permission_screens")
        .select("*")
        .eq("permission_level", userPermissionLevel);

      if (error) {
        console.error("Error fetching screen permissions:", error);
        return [];
      }

      return data;
    },
    enabled: !!userPermissionLevel,
  });

  const canAccessScreen = (screenName: string) => {
    if (userPermissionLevel === 'admin') return true;
    if (!screenPermissions) return false;
    const permission = screenPermissions.find(p => p.screen_name === screenName);
    return permission?.can_access ?? false;
  };

  return {
    userPermissionLevel,
    screenPermissions,
    canAccessScreen,
  };
}
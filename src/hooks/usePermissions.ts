import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export function usePermissions() {
  const { user } = useAuth();

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
        console.error("Error fetching user permission level:", error);
        return null;
      }
      
      return data?.permissao_usuario || null;
    },
    enabled: !!user?.id,
  });

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
        return [];
      }
      
      return data || [];
    },
    enabled: !!userPermissionLevel,
  });

  const canAccessScreen = (screenName: string) => {
    // Admin users always have access
    if (userPermissionLevel === 'admin') return true;
    
    // If permissions aren't loaded yet or there are no permissions, deny access
    if (!screenPermissions) return false;
    
    // Find the specific screen permission
    const permission = screenPermissions.find(p => p.screen_name === screenName);
    
    // Return the permission status or false if not found
    return permission?.can_access ?? false;
  };

  return {
    userPermissionLevel,
    screenPermissions,
    canAccessScreen,
    isLoading: isUserLoading || isScreenLoading,
  };
}
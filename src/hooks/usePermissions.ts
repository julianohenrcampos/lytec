import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { checkScreenAccess, checkActionPermission } from "@/utils/permissionUtils";
import type { ScreenPermission, PermissionAction, UserPermissionLevel } from "@/types/permissions";

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

      console.log("User permission level data:", data);
      return data?.permissao_usuario as UserPermissionLevel | null;
    },
    enabled: !!user?.id,
  });

  const { data: screenPermissions, isLoading: isScreenLoading } = useQuery({
    queryKey: ["screenPermissions", userPermissionLevel],
    queryFn: async () => {
      if (!userPermissionLevel) return [];

      // If user is admin, get all screens and set access to true
      if (userPermissionLevel === 'admin') {
        const { data } = await supabase
          .from("permission_screens")
          .select("screen_name");
        
        // Use Set to get unique screen names
        const uniqueScreens = [...new Set(data?.map(screen => screen.screen_name) || [])];
        
        return uniqueScreens.map(screen_name => ({
          screen_name,
          can_access: true,
          can_create: true,
          can_edit: true,
          can_delete: true
        } as ScreenPermission));
      }

      const { data, error } = await supabase
        .from("permission_screens")
        .select("*")
        .eq("permission_level", userPermissionLevel);
      
      if (error) {
        console.error("Error fetching screen permissions:", error);
        return [];
      }

      console.log("Screen permissions data:", data);
      return (data || []) as ScreenPermission[];
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

  return {
    userPermissionLevel,
    screenPermissions,
    canAccessScreen,
    canPerformAction,
    isLoading: isUserLoading || isScreenLoading,
  };
}
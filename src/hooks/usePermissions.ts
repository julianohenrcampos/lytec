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

      console.log("User permission level data:", data); // Debug log
      return data?.permissao_usuario || null;
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
          can_access: true
        }));
      }

      const { data, error } = await supabase
        .from("permission_screens")
        .select("*")
        .eq("permission_level", userPermissionLevel);
      
      if (error) {
        console.error("Error fetching screen permissions:", error);
        return [];
      }

      console.log("Screen permissions data:", data); // Debug log
      return data || [];
    },
    enabled: !!userPermissionLevel,
  });

  const canAccessScreen = (screenName: string) => {
    console.log("Checking access for screen:", screenName, "User level:", userPermissionLevel); // Debug log
    
    // Admin users always have access
    if (userPermissionLevel === 'admin') {
      console.log("User is admin, granting access"); // Debug log
      return true;
    }
    
    // If permissions aren't loaded yet or there are no permissions, deny access
    if (!screenPermissions) {
      console.log("No screen permissions found, denying access"); // Debug log
      return false;
    }
    
    // Find the specific screen permission
    const permission = screenPermissions.find(p => p.screen_name === screenName);
    console.log("Found permission:", permission); // Debug log
    
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
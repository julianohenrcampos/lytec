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
        .maybeSingle();

      if (error) {
        console.error("Error fetching user permission level:", error);
        return null;
      }

      return data?.permissao_usuario || null;
    },
  });

  const canAccessScreen = (screenName: string) => {
    if (userPermissionLevel === 'admin') return true;
    
    return true; // Temporary return true for testing - will be replaced with actual permission check
  };

  return {
    userPermissionLevel,
    canAccessScreen,
  };
}
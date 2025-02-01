import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { UserPermissionLevel, ScreenPermission, PermissionAction } from "@/types/permissions";

export function usePermissions() {
  const { user } = useAuth();
  const { toast } = useToast();

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

      // If no permission is set, default to admin for the specific user
      if (!data?.permissao_usuario && user.email === "julianohcampos@yahoo.com.br") {
        return "admin" as UserPermissionLevel;
      }

      return data?.permissao_usuario as UserPermissionLevel | null;
    },
    enabled: !!user?.id,
  });

  const { data: screenPermissions, isLoading: isScreenLoading } = useQuery({
    queryKey: ["screenPermissions", userPermissionLevel],
    queryFn: async () => {
      // If user is admin or no permission level yet, return full access
      if (userPermissionLevel === "admin" || 
         (user?.email === "julianohcampos@yahoo.com.br" && !userPermissionLevel)) {
        return [];
      }

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

      return data as ScreenPermission[];
    },
    enabled: !!userPermissionLevel || user?.email === "julianohcampos@yahoo.com.br",
  });

  const isAdmin = (permissionLevel: UserPermissionLevel | null): boolean => 
    permissionLevel === "admin" || 
    (user?.email === "julianohcampos@yahoo.com.br" && !permissionLevel);

  const canAccessScreen = (screenName: string): boolean => {
    console.log("Checking access for screen:", screenName, "User level:", userPermissionLevel);
    
    // Admin or specific user can access everything
    if (isAdmin(userPermissionLevel)) {
      console.log("User is admin or has special access, granting access");
      return true;
    }
    
    if (!screenPermissions) {
      console.log("No screen permissions found, denying access");
      return false;
    }
    
    const permission = screenPermissions.find(p => p.screen_name === screenName);
    console.log("Found permission:", permission);
    
    return permission?.can_access ?? false;
  };

  const canPerformAction = (screenName: string, action: PermissionAction): boolean => {
    // Admin or specific user can perform all actions
    if (isAdmin(userPermissionLevel)) {
      return true;
    }

    if (!screenPermissions) {
      return false;
    }

    const permission = screenPermissions.find(p => p.screen_name === screenName);
    
    if (!permission) {
      return false;
    }
    
    switch (action) {
      case "create":
        return permission.can_create ?? false;
      case "edit":
        return permission.can_edit ?? false;
      case "delete":
        return permission.can_delete ?? false;
      default:
        return false;
    }
  };

  return {
    userPermissionLevel,
    screenPermissions,
    canAccessScreen,
    canPerformAction,
    isLoading: isUserLoading || isScreenLoading,
  };
}
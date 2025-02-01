import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { UserPermissionLevel } from "@/types/permissions";

export function PermissionForm() {
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    async function updatePermissions() {
      if (user?.email === "julianohcampos@yahoo.com.br") {
        try {
          // First, check if user exists in bd_rhasfalto
          const { data: existingUser, error: fetchError } = await supabase
            .from("bd_rhasfalto")
            .select("id, permissao_usuario")
            .eq("id", user.id)
            .maybeSingle();

          if (fetchError) throw fetchError;

          // First, get a default function and cost center for the user
          const { data: defaultFunction, error: functionError } = await supabase
            .from("bd_funcao")
            .select("id")
            .limit(1)
            .single();

          if (functionError) throw functionError;

          const { data: defaultCostCenter, error: costCenterError } = await supabase
            .from("bd_centrocusto")
            .select("id")
            .limit(1)
            .single();

          if (costCenterError) throw costCenterError;

          // If user doesn't exist in bd_rhasfalto, create them
          if (!existingUser) {
            // Generate a unique CPF based on timestamp and random numbers
            const timestamp = Date.now().toString().slice(-8);
            const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            const uniqueCpf = `${timestamp}${random}`;

            const { error: insertError } = await supabase
              .from("bd_rhasfalto")
              .insert({
                nome: user.email,
                cpf: uniqueCpf, // Using generated unique CPF
                matricula: '0000', // Required field placeholder
                admissao: new Date().toISOString(), // Required field placeholder
                salario: 0, // Required field placeholder
                permissao_usuario: "admin" as UserPermissionLevel,
                funcao_id: defaultFunction.id, // Required field
                centro_custo_id: defaultCostCenter.id, // Required field
              });

            if (insertError) throw insertError;

            // Fetch the newly created user to confirm admin status
            const { data: newUser, error: newUserError } = await supabase
              .from("bd_rhasfalto")
              .select("id, permissao_usuario")
              .eq("id", user.id)
              .single();

            if (newUserError) throw newUserError;
            if (newUser.permissao_usuario !== 'admin') throw new Error('Failed to set admin permission');
          } 
          // If user exists but doesn't have admin permission, update it
          else if (existingUser.permissao_usuario !== 'admin') {
            const { error: updateError } = await supabase
              .from("bd_rhasfalto")
              .update({ permissao_usuario: "admin" as UserPermissionLevel })
              .eq("id", user.id);

            if (updateError) throw updateError;

            // Verify the update was successful
            const { data: updatedUser, error: verifyError } = await supabase
              .from("bd_rhasfalto")
              .select("permissao_usuario")
              .eq("id", user.id)
              .single();

            if (verifyError) throw verifyError;
            if (updatedUser.permissao_usuario !== 'admin') throw new Error('Failed to update to admin permission');
          }

          // Now that we're sure the user is admin, update screen permissions
          const screens = [
            "dashboard",
            "employees",
            "teams",
            "companies",
            "functions",
            "cost-centers",
            "fleets",
            "trucks-equipment",
            "plants",
            "mass-requests",
            "mass-programming",
            "permissions",
            "profile",
            "settings",
            "inspection-checklist",
          ];

          const { error: screenError } = await supabase
            .from("permission_screens")
            .upsert(
              screens.map(screen => ({
                permission_level: "admin" as UserPermissionLevel,
                screen_name: screen,
                can_access: true,
                can_create: true,
                can_edit: true,
                can_delete: true,
              })),
              { onConflict: 'permission_level,screen_name' }
            );

          if (screenError) throw screenError;

          toast({
            title: "Sucesso",
            description: "Permissões atualizadas com sucesso",
          });
        } catch (error) {
          console.error("Error updating permissions:", error);
          toast({
            title: "Erro",
            description: "Erro ao atualizar permissões",
            variant: "destructive",
          });
        }
      }
    }

    updatePermissions();
  }, [user, toast]);

  return null;
}
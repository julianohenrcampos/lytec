import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PermissionForm } from "@/components/permissions/PermissionForm";
import { PermissionTable } from "@/components/permissions/PermissionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PermissionManagement() {
  const { data: permissions, isLoading } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_permissoes")
        .select(`
          id,
          tela,
          acesso,
          usuario_id,
          usuario:bd_rhasfalto(nome, permissao_usuario)
        `);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Permissões</CardTitle>
          <PermissionForm />
        </CardHeader>
        <CardContent>
          <PermissionTable permissions={permissions || []} />
        </CardContent>
      </Card>
    </div>
  );
}
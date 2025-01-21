import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeFormDialog } from "@/components/employees/EmployeeFormDialog";
import { EmployeeTable } from "@/components/employees/EmployeeTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const EmployeeManagement = () => {
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select(`
          *,
          funcao:bd_funcao(nome),
          centro_custo:bd_centrocusto(nome),
          empresa:bd_empresa(nome),
          equipe:bd_equipe(nome)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar funcionários",
          description: error.message,
        });
        return [];
      }

      return data || [];
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
          <EmployeeFormDialog />
        </CardHeader>
        <CardContent>
          <EmployeeTable employees={employees || []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
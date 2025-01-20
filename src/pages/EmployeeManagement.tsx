import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EmployeeForm } from "@/components/employees/EmployeeForm";
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
        <CardHeader>
          <CardTitle>Gerenciamento de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <EmployeeTable employees={employees || []} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default EmployeeManagement;
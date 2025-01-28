import { useQuery } from "@tanstack/react-query";
import { Table, TableBody } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmployeeFormValues } from "./types";
import { EmployeeTableHeader } from "./table/EmployeeTableHeader";
import { EmployeeTableRow } from "./table/EmployeeTableRow";

interface EmployeeTableProps {
  filters: {
    nome?: string;
    funcao?: string;
    empresa?: string;
  };
  onEdit: (employee: Partial<EmployeeFormValues>) => void;
}

export const EmployeeTable = ({ filters, onEdit }: EmployeeTableProps) => {
  const { toast } = useToast();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_rhasfalto")
        .select(`
          *,
          funcao:funcao_id(nome),
          empresa_proprietaria:empresa_proprietaria_id(nome),
          centro_custo:centro_custo_id(nome)
        `);

      if (filters.nome) {
        query = query.ilike("nome", `%${filters.nome}%`);
      }
      if (filters.funcao && filters.funcao !== "_all") {
        query = query.eq("funcao_id", filters.funcao);
      }
      if (filters.empresa && filters.empresa !== "_all") {
        query = query.eq("empresa_proprietaria_id", filters.empresa);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching employees:", error);
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

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Table>
      <EmployeeTableHeader />
      <TableBody>
        {employees?.map((employee) => (
          <EmployeeTableRow 
            key={employee.id} 
            employee={employee} 
            onEdit={onEdit}
          />
        ))}
      </TableBody>
    </Table>
  );
};
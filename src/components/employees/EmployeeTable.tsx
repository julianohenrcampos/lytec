import React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmployeeFormValues } from "./types";

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
          empresa:empresa_id(nome),
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
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Função</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Empresa Proprietária</TableHead>
          <TableHead>Centro de Custo</TableHead>
          <TableHead>Data de Admissão</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees?.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>{employee.nome}</TableCell>
            <TableCell>{employee.funcao?.nome}</TableCell>
            <TableCell>{employee.empresa?.nome}</TableCell>
            <TableCell>{employee.empresa_proprietaria?.nome}</TableCell>
            <TableCell>{employee.centro_custo?.nome}</TableCell>
            <TableCell>
              {employee.admissao ? format(new Date(employee.admissao), "dd/MM/yyyy") : "-"}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(employee)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
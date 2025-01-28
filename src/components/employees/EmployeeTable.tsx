import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployeeFormData } from "./hooks/useEmployeeFormData";

export const EmployeeTable = () => {
  const [filters, setFilters] = React.useState({
    nome: "",
    funcao: "",
    empresa: "",
  });

  const { funcoes, empresas } = useEmployeeFormData();

  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_rhasfalto")
        .select(`
          *,
          funcao:funcao_id(nome),
          empresa:empresa_id(nome)
        `);

      if (filters.nome) {
        query = query.ilike("nome", `%${filters.nome}%`);
      }
      if (filters.funcao && filters.funcao !== "_all") {
        query = query.eq("funcao_id", filters.funcao);
      }
      if (filters.empresa && filters.empresa !== "_all") {
        query = query.eq("empresa_id", filters.empresa);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching employees:", error);
        throw error;
      }
      return data || [];
    },
  });

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Input
            placeholder="Filtrar por nome"
            value={filters.nome}
            onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
          />
        </div>
        <div>
          <Select
            value={filters.funcao}
            onValueChange={(value) => setFilters({ ...filters, funcao: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todas as funções</SelectItem>
              {funcoes?.map((funcao) => (
                <SelectItem key={funcao.id} value={funcao.id}>
                  {funcao.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.empresa}
            onValueChange={(value) => setFilters({ ...filters, empresa: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Todas as empresas</SelectItem>
              {empresas?.map((empresa) => (
                <SelectItem key={empresa.id} value={empresa.id}>
                  {empresa.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Função</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Matrícula</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees?.map((employee) => (
            <TableRow key={employee.id}>
              <TableCell>{employee.nome}</TableCell>
              <TableCell>{employee.funcao?.nome}</TableCell>
              <TableCell>{employee.empresa?.nome}</TableCell>
              <TableCell>{employee.matricula}</TableCell>
              <TableCell>{employee.ativo ? "Ativo" : "Inativo"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
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

export const TeamTable = () => {
  const { data: teams, isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bd_equipe")
        .select(`
          *,
          encarregado:encarregado_id(nome),
          apontador:apontador_id(nome)
        `);
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
          <TableHead>Encarregado</TableHead>
          <TableHead>Apontador</TableHead>
          <TableHead>Colaboradores</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {teams?.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.nome}</TableCell>
            <TableCell>{team.encarregado?.nome}</TableCell>
            <TableCell>{team.apontador?.nome}</TableCell>
            <TableCell>{team.colaboradores?.length || 0} membros</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
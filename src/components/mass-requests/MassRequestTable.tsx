import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { MassRequest } from "./types";

interface MassRequestTableProps {
  filters: {
    data_inicio?: string;
    data_fim?: string;
    centro_custo?: string;
  };
}

export function MassRequestTable({ filters }: MassRequestTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: userPermission } = useQuery({
    queryKey: ["userPermission"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user permission:", error);
        return null;
      }

      return data?.permissao_usuario || null;
    },
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["massRequests", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_requisicao")
        .select("*, bd_ruas_requisicao(*)")
        .order("created_at", { ascending: false });

      if (filters.data_inicio && filters.data_fim) {
        query = query
          .gte("data", filters.data_inicio)
          .lte("data", filters.data_fim);
      }

      if (filters.centro_custo) {
        query = query.eq("centro_custo", filters.centro_custo);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar requisições",
          description: error.message,
        });
        return [];
      }

      return data;
    },
  });

  const handleNewProgramming = (request: MassRequest) => {
    navigate("/mass-programming/new", {
      state: { request },
    });
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Centro de Custo</TableHead>
          <TableHead>Logradouro</TableHead>
          <TableHead>Engenheiro</TableHead>
          <TableHead>Quantidade</TableHead>
          <TableHead>Quantidade Programada</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests?.map((request) => (
          <TableRow key={request.id}>
            <TableCell>
              {new Date(request.data).toLocaleDateString()}
            </TableCell>
            <TableCell>{request.centro_custo}</TableCell>
            <TableCell>{request.logradouro}</TableCell>
            <TableCell>{request.engenheiro}</TableCell>
            <TableCell>{request.peso}</TableCell>
            <TableCell>{request.quantidade_programada}</TableCell>
            <TableCell className="text-right space-x-2">
              {userPermission === "planejamento" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleNewProgramming(request)}
                  title="Nova Programação"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
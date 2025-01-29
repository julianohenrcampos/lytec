import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Eye, Pencil, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { MassRequest } from "./types";

interface MassRequestTableProps {
  filters: {
    data_inicio: Date | null;
    data_fim: Date | null;
    centro_custo: string;
  };
}

export function MassRequestTable({ filters }: MassRequestTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: userPermission } = useQuery({
    queryKey: ["user-permission", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bd_rhasfalto")
        .select("permissao_usuario")
        .eq("id", user?.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching user permission:", error);
        return null;
      }

      return data?.permissao_usuario;
    },
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["mass-requests", filters],
    queryFn: async () => {
      let query = supabase
        .from("bd_requisicao")
        .select(`
          *,
          bd_ruas_requisicao(*),
          bd_programacaomassa(volume)
        `)
        .order("created_at", { ascending: false });

      if (filters.data_inicio && filters.data_fim) {
        query = query
          .gte("data", filters.data_inicio.toISOString())
          .lte("data", filters.data_fim.toISOString());
      }

      if (filters.centro_custo !== "_all") {
        query = query.eq("centro_custo", filters.centro_custo);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching mass requests:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar requisições",
          description: "Ocorreu um erro ao carregar as requisições de massa.",
        });
        return [];
      }

      return data?.map(request => ({
        ...request,
        quantidade_programada: request.bd_programacaomassa?.reduce((acc: number, curr: any) => acc + (curr.volume || 0), 0) || 0
      }));
    },
  });

  const handleNewProgramming = (request: MassRequest) => {
    navigate("/mass-programming/new", {
      state: { request },
    });
  };

  const handleEdit = (request: MassRequest) => {
    navigate(`/mass-requests/${request.id}/edit`, {
      state: { request },
    });
  };

  const handleView = (request: MassRequest) => {
    navigate(`/mass-requests/${request.id}`);
  };

  const handleDelete = async (request: MassRequest) => {
    const { error } = await supabase
      .from("bd_requisicao")
      .delete()
      .eq("id", request.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir requisição",
        description: "Ocorreu um erro ao excluir a requisição de massa.",
      });
      return;
    }

    toast({
      title: "Requisição excluída",
      description: "A requisição de massa foi excluída com sucesso.",
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
          <TableHead>Engenheiro</TableHead>
          <TableHead>Área (m²)</TableHead>
          <TableHead>Volume (t)</TableHead>
          <TableHead>Qtd. Programada</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {requests && requests.length > 0 ? (
          requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{format(new Date(request.data), "dd/MM/yyyy")}</TableCell>
              <TableCell>{request.centro_custo}</TableCell>
              <TableCell>{request.engenheiro}</TableCell>
              <TableCell>{request.area}</TableCell>
              <TableCell>{request.peso}</TableCell>
              <TableCell>{request.quantidade_programada}</TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleView(request)}
                    title="Visualizar"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(request)}
                    title="Editar"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(request)}
                    title="Excluir"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
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
                </div>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="text-center">
              Nenhuma requisição encontrada
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}